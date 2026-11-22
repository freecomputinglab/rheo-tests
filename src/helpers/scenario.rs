//! A scripted sequence of edits run under one `rheo watch` session, each
//! checked against both the rebuild-kind rheo logged and a fresh full
//! compile of the resulting tree — the reusable shape a scenario-specific
//! test (e.g. `tests/watch_narrow_rookery_smoke.rs`) scripts against a
//! fixture.

use super::devserver::DevServer;
use super::fixtures::TestCase;
use super::narrow::{fresh_compile_html, html_tree_diffs};
use super::test_store::copy_project_to_test_store;
use std::fmt::Write as _;
use std::fs;
use std::path::{Path, PathBuf};
use std::time::Instant;

/// What a step's rebuild line must look like.
pub enum Expect {
    /// A `narrowed: ...` line naming every one of these handles (order not
    /// checked).
    Narrowed(Vec<&'static str>),
    /// Any `narrowed: ...` line, regardless of which handles it names.
    AnyNarrowed,
    /// A `full rebuild: ...` line.
    Full,
    /// No check at all.
    Any,
}

impl Expect {
    fn check(&self, line: &str) -> bool {
        match self {
            Expect::Narrowed(handles) => {
                line.starts_with("narrowed: ") && handles.iter().all(|h| line.contains(h))
            }
            Expect::AnyNarrowed => line.starts_with("narrowed: "),
            Expect::Full => line.starts_with("full rebuild: "),
            Expect::Any => true,
        }
    }
}

/// One scripted edit plus what its rebuild line must look like. A step may
/// touch several files; `edit` is handed the project root and does whatever
/// it likes underneath it.
pub struct Step {
    pub name: &'static str,
    pub edit: Box<dyn Fn(&Path)>,
    pub expect: Expect,
}

impl Step {
    pub fn new(name: &'static str, expect: Expect, edit: impl Fn(&Path) + 'static) -> Self {
        Step {
            name,
            edit: Box::new(edit),
            expect,
        }
    }

    /// Replaces the first occurrence of `from` with `to` in `rel` (relative
    /// to the project root). Panics if `from` is not present — a stale
    /// anchor is a fact about the fixture to fix, not to silently no-op.
    /// Replaces the first occurrence of `from` with `to`. Idempotent — a
    /// step's edit closure is re-applied by [`DevServer::edit_and_wait_for_rebuild`]
    /// until a rebuild is observed, so a second call must not panic just
    /// because `from` is no longer there; it re-writes the same `to`-bearing
    /// content instead (still a real write, so the retry still emits a
    /// filesystem event). Panics only if NEITHER `from` nor `to` is present,
    /// which means `from` was never there to begin with.
    pub fn replace(
        name: &'static str,
        expect: Expect,
        rel: &'static str,
        from: &'static str,
        to: &'static str,
    ) -> Self {
        Step::new(name, expect, move |project| {
            let path = project.join(rel);
            let src = fs::read_to_string(&path)
                .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
            let next = if src.contains(from) {
                src.replacen(from, to, 1)
            } else {
                assert!(
                    src.contains(to),
                    "step {name:?}: neither {from:?} nor {to:?} found in {}",
                    path.display()
                );
                src
            };
            fs::write(&path, next).unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
        })
    }

    /// Appends `text` to `rel` (relative to the project root). Idempotent —
    /// see [`Step::replace`]'s doc comment for why: a second call sees `text`
    /// already at the end and skips appending it again, but still rewrites
    /// the file so the retry still emits a filesystem event.
    pub fn append(
        name: &'static str,
        expect: Expect,
        rel: &'static str,
        text: &'static str,
    ) -> Self {
        Step::new(name, expect, move |project| {
            let path = project.join(rel);
            let mut src = fs::read_to_string(&path)
                .unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
            if !src.ends_with(text) {
                src.push_str(text);
            }
            fs::write(&path, src).unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
        })
    }

    /// Creates or overwrites `rel` (relative to the project root) with
    /// `content`. Already idempotent — every call writes the same bytes.
    pub fn write(
        name: &'static str,
        expect: Expect,
        rel: &'static str,
        content: &'static str,
    ) -> Self {
        Step::new(name, expect, move |project| {
            let path = project.join(rel);
            if let Some(parent) = path.parent() {
                fs::create_dir_all(parent)
                    .unwrap_or_else(|e| panic!("mkdir {}: {e}", parent.display()));
            }
            fs::write(&path, content).unwrap_or_else(|e| panic!("write {}: {e}", path.display()));
        })
    }

    /// Removes `rel` (relative to the project root). Idempotent — a second
    /// call finds the file already gone and does nothing, rather than
    /// panicking (see [`Step::replace`]'s doc comment for why a second call
    /// happens at all).
    pub fn remove(name: &'static str, expect: Expect, rel: &'static str) -> Self {
        Step::new(name, expect, move |project| {
            let path = project.join(rel);
            if path.exists() {
                fs::remove_file(&path).unwrap_or_else(|e| panic!("remove {}: {e}", path.display()));
            }
        })
    }
}

/// A named sequence of [`Step`]s run against one fixture under one `rheo
/// watch` session.
pub struct Scenario {
    pub name: &'static str,
    pub steps: Vec<Step>,
}

/// One step's outcome: the rebuild line it produced, how long the rebuild
/// took, whether that line matched the step's `expect`, and any difference
/// between the watch session's disk output and a fresh full compile taken
/// right after.
pub struct StepReport {
    pub name: &'static str,
    pub log_line: String,
    pub millis: u128,
    pub expect_ok: bool,
    pub diffs: Vec<String>,
}

pub struct ScenarioReport {
    pub name: &'static str,
    pub steps: Vec<StepReport>,
}

impl ScenarioReport {
    /// Prints a one-row-per-step table to stderr, then panics naming every
    /// step whose rebuild line didn't match its `expect` or whose disk
    /// output diverged from a fresh compile.
    pub fn assert_clean(&self) {
        let mut table = format!("scenario {:?}:\n", self.name);
        for step in &self.steps {
            let _ = writeln!(
                table,
                "  {:<24} expect={:<5} {:>6}ms  diffs={:<3} log={:?}",
                step.name,
                step.expect_ok,
                step.millis,
                step.diffs.len(),
                step.log_line
            );
        }
        eprint!("{table}");

        let failing: Vec<&StepReport> = self
            .steps
            .iter()
            .filter(|s| !s.expect_ok || !s.diffs.is_empty())
            .collect();
        if failing.is_empty() {
            return;
        }

        let mut message = format!(
            "scenario {:?}: {} step(s) failed:\n",
            self.name,
            failing.len()
        );
        for step in &failing {
            let _ = writeln!(message, "- {} (log: {:?})", step.name, step.log_line);
            if let Some(first_diff) = step.diffs.first() {
                let _ = writeln!(message, "  first diff:\n{first_diff}");
            }
        }
        panic!("{message}");
    }
}

impl Scenario {
    /// Copies `fixture` to a tempdir, runs `setup` against the copy, starts
    /// `rheo watch --html` over it, and runs every step in order. A step's
    /// failure (a mismatched `expect` or a disk diff) does not stop the
    /// scenario — every step runs, and [`ScenarioReport::assert_clean`]
    /// reports all of them together.
    pub fn run(&self, fixture: &str, setup: impl Fn(&Path)) -> ScenarioReport {
        let case = TestCase::new(fixture);
        let dir = tempfile::tempdir().expect("tempdir");
        let project = dir.path();
        copy_project_to_test_store(case.project_path(), project).expect("copy fixture");

        setup(project);

        let server = DevServer::start(project, &["--html"]);
        let build_html = project.join("build/html");

        let mut steps = Vec::with_capacity(self.steps.len());
        for step in &self.steps {
            let start = Instant::now();
            let log_line = server.edit_and_wait_for_rebuild(|| (step.edit)(project));
            let millis = start.elapsed().as_millis();
            let expect_ok = step.expect.check(&log_line);

            let fresh = fresh_compile_html(project);
            let diffs = html_tree_diffs(&build_html, &fresh.path().join("build/html"));

            steps.push(StepReport {
                name: step.name,
                log_line,
                millis,
                expect_ok,
                diffs,
            });
        }

        ScenarioReport {
            name: self.name,
            steps,
        }
    }
}

/// Resolves the rookery checkout to test scenarios against: the `ROOKERY_DIR`
/// env var if set, else `<CARGO_MANIFEST_DIR>/../rookery`. Returns `Some`
/// only if `core/0.1.1/typst.toml` exists under it — i.e. it genuinely looks
/// like a rookery checkout, not just a directory that happens to exist.
pub fn rookery_dir() -> Option<PathBuf> {
    let candidate = match std::env::var("ROOKERY_DIR") {
        Ok(dir) => PathBuf::from(dir),
        Err(_) => PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../rookery"),
    };
    candidate
        .join("core/0.1.1/typst.toml")
        .is_file()
        .then_some(candidate)
}

/// Replaces the `ROOKERY_DIR` placeholder in `project`'s `rheo.toml` with the
/// absolute path [`rookery_dir`] resolves, for use as a `Scenario::run` setup
/// closure. Panics with a clear message if no rookery checkout can be found.
pub fn rookery_setup(project: &Path) {
    let dir = rookery_dir().unwrap_or_else(|| {
        panic!(
            "rookery_setup: no rookery checkout found — set ROOKERY_DIR or check out \
             ../rookery next to this project"
        )
    });
    let rheo_toml = project.join("rheo.toml");
    let content = fs::read_to_string(&rheo_toml).unwrap_or_else(|e| panic!("read rheo.toml: {e}"));
    let absolute = fs::canonicalize(&dir).unwrap_or(dir);
    fs::write(
        &rheo_toml,
        content.replace("ROOKERY_DIR", &absolute.to_string_lossy()),
    )
    .unwrap_or_else(|e| panic!("write rheo.toml: {e}"));
}
