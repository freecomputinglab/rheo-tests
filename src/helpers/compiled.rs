//! One-call fixture compile: copy a checked-in fixture into an isolated store,
//! patch its manifest version, run `rheo compile`, and clean up on drop.
//!
//! The generic `#[test_case]` runner in `tests/harness.rs` does its own version
//! of this and then diffs whole output trees against `ref/`. A bespoke test
//! instead asserts on one file, on a file's absence, or on stderr — but needs
//! the same preamble to get there.

use super::cli::rheo_cli_command;
use super::test_store::copy_project_to_test_store;
use rheo_core::config::manifest_version;
use std::path::{Path, PathBuf};
use std::process::Output;

/// A fixture copied into an isolated store and compiled.
///
/// The store is removed on drop, so a failing assertion cannot leak it into the
/// next run.
pub struct CompiledFixture {
    store: PathBuf,
    build_dir: PathBuf,
    output: Output,
}

impl CompiledFixture {
    /// Copy `fixture` (a path relative to the crate root, e.g.
    /// `cases/marrow`) into `store/<store_name>`, patch its `rheo.toml`
    /// version, and compile it for `formats` (e.g. `&["--html"]`).
    ///
    /// Does NOT assert the compile succeeded — chain
    /// [`Self::expect_success`] for that, or read [`Self::output`] to assert a
    /// deliberate failure.
    pub fn compile(fixture: &str, store_name: &str, formats: &[&str]) -> Self {
        let store = PathBuf::from("store").join(store_name);
        if store.exists() {
            std::fs::remove_dir_all(&store).expect("clean store");
        }
        std::fs::create_dir_all(&store).expect("create store");
        copy_project_to_test_store(Path::new(fixture), &store).expect("copy fixture");
        patch_manifest_version(&store.join("rheo.toml"));

        let build_dir = store.join("build");
        let output = run_compile(&store, &build_dir, formats);
        Self {
            store,
            build_dir,
            output,
        }
    }

    /// Assert the compile succeeded, naming its stderr on failure.
    pub fn expect_success(self) -> Self {
        assert!(
            self.output.status.success(),
            "compile failed: {}",
            self.stderr()
        );
        self
    }

    /// Compile the same store again for a different format set, e.g. to check
    /// that a marrow contribution is skipped under the combined PDF target.
    pub fn recompile(&self, formats: &[&str]) -> Output {
        run_compile(&self.store, &self.build_dir, formats)
    }

    /// The compile's captured output, for a test asserting on a deliberate
    /// failure or on a specific diagnostic.
    pub fn output(&self) -> &Output {
        &self.output
    }

    pub fn stdout(&self) -> String {
        String::from_utf8_lossy(&self.output.stdout).into_owned()
    }

    pub fn stderr(&self) -> String {
        String::from_utf8_lossy(&self.output.stderr).into_owned()
    }

    /// Stdout and stderr concatenated, for asserting a message appeared on
    /// either stream.
    pub fn combined(&self) -> String {
        format!("{}{}", self.stdout(), self.stderr())
    }

    /// A path inside the build directory, e.g. `path("html/feed.xml")`.
    pub fn path(&self, rel: &str) -> PathBuf {
        self.build_dir.join(rel)
    }

    /// Read a built file as text, naming it on failure.
    pub fn read(&self, rel: &str) -> String {
        let path = self.path(rel);
        std::fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()))
    }
}

impl Drop for CompiledFixture {
    fn drop(&mut self) {
        std::fs::remove_dir_all(&self.store).ok();
    }
}

fn run_compile(project: &Path, build_dir: &Path, formats: &[&str]) -> Output {
    rheo_cli_command()
        .args(["compile", project.to_str().expect("utf-8 store path")])
        .args(formats)
        .args(["--build-dir", build_dir.to_str().expect("utf-8 build path")])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("run rheo compile")
}

/// Rewrite `version = "..."` in `toml_path` to the rheo this suite tests, so a
/// fixture pinning an older version doesn't trip the version-mismatch warning.
/// A fixture deliberately exercising a stale version opts out by not going
/// through here (see `@rheo:keep-version` in `tests/harness.rs`).
fn patch_manifest_version(toml_path: &Path) {
    let Ok(content) = std::fs::read_to_string(toml_path) else {
        return;
    };
    let patched: String = content
        .lines()
        .map(|line| {
            if line.trim_start().starts_with("version = ") {
                format!("version = \"{}\"", manifest_version::CURRENT)
            } else {
                line.to_string()
            }
        })
        .collect::<Vec<_>>()
        .join("\n");
    std::fs::write(toml_path, patched + "\n").expect("patch rheo.toml version");
}
