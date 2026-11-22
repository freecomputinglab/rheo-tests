//! Opt-in timing test for `[watch] narrow = true`: an edit to one page
//! should recompile only that page plus its ligament dependents, instead of
//! every page, and this measures whether it actually does.
//!
//! Two latencies are reported because `rheo watch --open` always runs a
//! second, full in-memory compile for the dev server on top of the narrowed
//! disk rebuild (`update_dev_server` -> `Build::compile_for_watch` in
//! `../rheo/crates/cli/src/lib.rs`):
//! - disk latency (edit -> rebuild log line): what narrowing should shrink.
//! - served latency (edit -> served page shows the edit): expected to show
//!   little gain, since the full in-memory compile still runs regardless.
//!
//! Run explicitly, since it's a timing assertion and noisy under load:
//! ```bash
//! RHEO_BIN=... cargo test --test watch_narrow_speed -- --ignored --nocapture
//! ```

use rheo_core::config::manifest_version;
use rheo_tests::helpers::devserver::DevServer;
use std::fs;
use std::path::Path;
use std::time::{Duration, Instant};

const PAGE_COUNT: usize = 200;
/// [`DevServer::edit_and_wait_for_rebuild`]'s own post-growth settle wait
/// (`REBUILD_QUIESCE` in `src/helpers/devserver.rs`), included in its
/// returned duration but not part of the actual rebuild latency.
const REBUILD_QUIESCE: Duration = Duration::from_millis(2500);

fn page_body(n: usize, suffix: &str) -> String {
    format!("= Page {n}\n\nMARK-{n:03}-{suffix}\n\n#lorem(1500)\n")
}

/// Writes `PAGE_COUNT` pages (`p000.typ` .. `p199.typ`), each an unrelated
/// vertebra (no ligaments), plus a `rheo.toml` enabling `[watch] narrow` when
/// `narrow` is set.
fn generate(dir: &Path, narrow: bool) {
    for n in 0..PAGE_COUNT {
        fs::write(dir.join(format!("p{n:03}.typ")), page_body(n, "0")).expect("write page");
    }

    let mut toml = format!(
        "version = \"{}\"\nformats = [\"html\"]\n",
        manifest_version::CURRENT
    );
    if narrow {
        toml.push_str("\n[watch]\nnarrow = true\n");
    }
    fs::write(dir.join("rheo.toml"), toml).expect("write rheo.toml");
}

/// Disk and served latencies for one timed edit.
struct Timing {
    disk: Duration,
    served: Duration,
}

/// Runs the warm-up edit plus 3 timed edits against a server generated with
/// `narrow`, asserting every rebuild line matches the mode, and returns each
/// timed edit's (disk, served) latencies.
fn run_session(narrow: bool) -> Vec<Timing> {
    let dir = tempfile::tempdir().expect("tempdir");
    let project = dir.path();
    generate(project, narrow);

    let server = DevServer::start(project, &["--html"]);
    let p100 = project.join("p100.typ");

    // Warm-up: the first rebuild of a session can differ from the rest.
    let warmup_line = server.edit_and_wait_for_rebuild(|| {
        fs::write(&p100, page_body(100, "w")).expect("warm-up edit");
    });
    assert_rebuild_kind(&warmup_line, narrow);

    let mut timings = Vec::with_capacity(3);
    for k in 1..=3 {
        let suffix = k.to_string();
        let disk_start = Instant::now();
        let line = server.edit_and_wait_for_rebuild(|| {
            fs::write(&p100, page_body(100, &suffix)).expect("timed edit");
        });
        let disk_elapsed = disk_start.elapsed().saturating_sub(REBUILD_QUIESCE);
        assert_rebuild_kind(&line, narrow);

        let marker = format!("MARK-100-{suffix}");
        let served_start = Instant::now();
        server.wait_for_edit("/p100.html", || {}, |body| body.contains(&marker));
        let served_elapsed = served_start.elapsed();

        timings.push(Timing {
            disk: disk_elapsed,
            served: served_elapsed,
        });
    }
    timings
}

fn assert_rebuild_kind(line: &str, narrow: bool) {
    if narrow {
        assert!(
            line.starts_with("narrowed: 1 vertebra(e)"),
            "unexpected rebuild line with narrow=true: {line}"
        );
    } else {
        assert!(
            line.starts_with("full rebuild:"),
            "unexpected rebuild line with narrow=false: {line}"
        );
    }
}

fn median(durations: &mut [Duration]) -> Duration {
    durations.sort();
    durations[durations.len() / 2]
}

#[test]
#[ignore = "timing; run explicitly"]
fn narrowed_rebuild_is_faster_than_full() {
    let narrow_timings = run_session(true);
    let full_timings = run_session(false);

    let mut narrow_disk: Vec<_> = narrow_timings.iter().map(|t| t.disk).collect();
    let mut narrow_served: Vec<_> = narrow_timings.iter().map(|t| t.served).collect();
    let mut full_disk: Vec<_> = full_timings.iter().map(|t| t.disk).collect();
    let mut full_served: Vec<_> = full_timings.iter().map(|t| t.served).collect();

    let narrow_disk_median = median(&mut narrow_disk);
    let narrow_served_median = median(&mut narrow_served);
    let full_disk_median = median(&mut full_disk);
    let full_served_median = median(&mut full_served);

    eprintln!(
        "narrowed-rebuild timing ({PAGE_COUNT} pages, median of 3 edits):\n\
         {:>8} | {:>12} | {:>12}\n\
         {:>8} | {:>12?} | {:>12?}\n\
         {:>8} | {:>12?} | {:>12?}",
        "",
        "disk",
        "served",
        "narrow",
        narrow_disk_median,
        narrow_served_median,
        "full",
        full_disk_median,
        full_served_median,
    );

    assert!(
        narrow_disk_median <= full_disk_median / 2,
        "narrowed disk rebuild ({narrow_disk_median:?}) was not at least twice as fast as \
         a full rebuild ({full_disk_median:?})"
    );
}
