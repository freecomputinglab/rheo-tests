//! Correctness coverage for `rheo watch`'s opt-in `[watch] narrow = true`
//! mode: an edit to one vertebra recompiles only that vertebra plus any
//! vertebra bound to a ligament key it attaches, and only those pages' disk
//! outputs change — everything else on disk is left exactly as a fresh full
//! compile would have produced it.
//!
//! `cases/watch_narrow` wires `a.typ` (attaches `"greeting"`), `b.typ` (binds
//! `"greeting"`, with a live-query fallback so it renders the same bytes on a
//! full compile), and `c.typ` (unrelated). All three assertions read disk —
//! `rheo watch --open`'s in-memory path always runs a full compile of its own
//! and would mask a narrowing bug entirely (see `cases/watch_narrow`'s bird).

use rheo_tests::helpers::{
    devserver::{DevServer, StdinWatch},
    fixtures::TestCase,
    narrow::{assert_html_trees_equal, fresh_compile_html},
    test_store::copy_project_to_test_store,
};
use std::fs;
use std::time::SystemTime;

fn start_watch_narrow_server() -> (tempfile::TempDir, DevServer) {
    let fixture = TestCase::new("cases/watch_narrow");
    let dir = tempfile::tempdir().expect("tempdir");
    let project = dir.path();
    copy_project_to_test_store(fixture.project_path(), project).expect("copy fixture");

    // `DevServer::start` only returns once the server has logged its bound
    // port, which happens after the initial full build has already written
    // its disk output — so no extra wait is needed before an mtime baseline.
    // (That initial build never goes through `RebuildPath::log` at all, so
    // waiting on a rebuild line here would simply time out.)
    let server = DevServer::start(project, &["--html"]);
    (dir, server)
}

fn mtime(path: &std::path::Path) -> SystemTime {
    fs::metadata(path)
        .unwrap_or_else(|e| panic!("stat {}: {e}", path.display()))
        .modified()
        .expect("mtime")
}

#[test]
fn attach_edit_recompiles_binder() {
    let (dir, server) = start_watch_narrow_server();
    let project = dir.path();
    let build_html = project.join("build/html");

    let c_html = build_html.join("c.html");
    let c_mtime_before = mtime(&c_html);

    let a_typ = project.join("a.typ");
    let src = fs::read_to_string(&a_typ).expect("read a.typ");
    let edited = src.replace("hello", "howdy");
    assert_ne!(src, edited, "fixture must contain \"hello\" to edit");

    let line = server.edit_and_wait_for_rebuild(|| {
        fs::write(&a_typ, &edited).expect("rewrite a.typ");
    });
    assert!(
        line.starts_with("narrowed: 2 vertebra(e) in"),
        "unexpected rebuild line: {line}"
    );
    assert!(
        line.contains('a') && line.contains('b'),
        "rebuild line must name both a and b: {line}"
    );

    let b_html = fs::read_to_string(build_html.join("b.html")).expect("read b.html");
    assert!(
        b_html.contains("Greeting: howdy"),
        "b.html did not pick up the attach edit:\n{b_html}"
    );

    assert_eq!(
        mtime(&c_html),
        c_mtime_before,
        "c.html must not be rewritten by an edit unrelated to it"
    );

    assert_html_trees_equal(
        &build_html,
        &fresh_compile_html(project).path().join("build/html"),
    );
}

#[test]
fn unrelated_edit_narrows_to_one_page() {
    let (dir, server) = start_watch_narrow_server();
    let project = dir.path();
    let build_html = project.join("build/html");

    let b_html = build_html.join("b.html");
    let b_mtime_before = mtime(&b_html);

    let c_typ = project.join("c.typ");
    let mut c_src = fs::read_to_string(&c_typ).expect("read c.typ");
    c_src.push_str("\nAnother unrelated line.\n");
    let line = server.edit_and_wait_for_rebuild(|| {
        fs::write(&c_typ, &c_src).expect("rewrite c.typ");
    });
    assert!(
        line.starts_with("narrowed: 1 vertebra(e) in"),
        "unexpected rebuild line: {line}"
    );
    assert!(line.contains('c'), "rebuild line must name c: {line}");

    assert_eq!(
        mtime(&b_html),
        b_mtime_before,
        "b.html must not be rewritten by an edit to the unrelated page"
    );

    assert_html_trees_equal(
        &build_html,
        &fresh_compile_html(project).path().join("build/html"),
    );
}

#[test]
fn bind_only_edit_propagates_nothing() {
    let (dir, server) = start_watch_narrow_server();
    let project = dir.path();
    let build_html = project.join("build/html");

    let b_typ = project.join("b.typ");
    let mut b_src = fs::read_to_string(&b_typ).expect("read b.typ");
    b_src.push_str("\nSome more plain text.\n");
    let line = server.edit_and_wait_for_rebuild(|| {
        fs::write(&b_typ, &b_src).expect("rewrite b.typ");
    });
    assert!(
        line.starts_with("narrowed: 1 vertebra(e)"),
        "unexpected rebuild line: {line}"
    );
    assert!(line.contains('b'), "rebuild line must name b: {line}");

    assert_html_trees_equal(
        &build_html,
        &fresh_compile_html(project).path().join("build/html"),
    );
}

/// A copy of `case` under a stdin-triggered watch session, with the temp dirs
/// holding the project and its events file, which must outlive the session.
fn stdin_watch(case: &str, args: &[&str]) -> (tempfile::TempDir, tempfile::TempDir, StdinWatch) {
    let dir = tempfile::tempdir().expect("tempdir");
    let events = tempfile::tempdir().expect("tempdir");
    copy_project_to_test_store(TestCase::new(case).project_path(), dir.path())
        .expect("copy fixture");
    let watch = StdinWatch::start(dir.path(), events.path(), args);
    (dir, events, watch)
}

/// `--trigger stdin --events`: each `rebuild` line yields exactly one
/// `build_finished` event, tagged `narrowed` or `full` by the path taken.
#[test]
fn stdin_trigger_reports_event_kinds() {
    let (dir, _events, mut watch) = stdin_watch("cases/watch_narrow_regressions", &["--html"]);
    let project = dir.path();

    let initial = watch.events();
    assert_eq!(
        initial.len(),
        1,
        "only the initial build so far: {initial:?}"
    );
    assert!(
        initial[0].starts_with(
            r#"{"event":"build_finished","initial":true,"ok":true,"kind":"full","ms":"#
        ),
        "unexpected initial event: {}",
        initial[0]
    );

    let holder = project.join("holder.typ");
    let mut src = fs::read_to_string(&holder).expect("read holder.typ");
    src.push_str("\nAn extra unrelated line.\n");
    fs::write(&holder, &src).expect("rewrite holder.typ");
    let narrowed = watch.rebuild(&["holder.typ"]);
    assert!(
        narrowed.starts_with(
            r#"{"event":"build_finished","initial":false,"ok":true,"kind":"narrowed","ms":"#
        ),
        "unexpected narrowed event: {narrowed}"
    );
    let holder_html = fs::read_to_string(project.join("build/html/holder.html")).unwrap();
    assert!(holder_html.contains("An extra unrelated line."));

    let item = project.join("_lib/item.typ");
    let item_src = fs::read_to_string(&item).expect("read _lib/item.typ");
    fs::write(&item, item_src.replace("alpha", "gamma")).expect("rewrite item.typ");
    let full = watch.rebuild(&["_lib/item.typ"]);
    assert!(
        full.starts_with(
            r#"{"event":"build_finished","initial":false,"ok":true,"kind":"full","ms":"#
        ),
        "unexpected full event: {full}"
    );
    assert_eq!(watch.events().len(), 3, "one event per rebuild request");
}

/// `[watch] narrow = "auto"` and `cache_size = 0` are accepted, and an
/// unattached edit narrows and still lands on disk.
#[test]
fn auto_narrow_with_cache_size_rebuilds() {
    let (dir, _events, mut watch) = stdin_watch("cases/watch_narrow_auto", &[]);
    let project = dir.path();

    let c_typ = project.join("c.typ");
    let mut src = fs::read_to_string(&c_typ).expect("read c.typ");
    src.push_str("\nEdited under auto.\n");
    fs::write(&c_typ, &src).expect("rewrite c.typ");
    let event = watch.rebuild(&["c.typ"]);
    assert!(event.contains(r#""ok":true,"kind":"narrowed""#), "{event}");

    // A second round, after the cache was emptied, still rebuilds correctly.
    src.push_str("\nAnd again.\n");
    fs::write(&c_typ, &src).expect("rewrite c.typ");
    watch.rebuild(&["c.typ"]);
    let c_html = fs::read_to_string(project.join("build/html/c.html")).unwrap();
    assert!(c_html.contains("Edited under auto.") && c_html.contains("And again."));

    assert_html_trees_equal(
        &project.join("build/html"),
        &fresh_compile_html(project).path().join("build/html"),
    );
}

/// An EPUB assembles the whole spine into one file, so with it among the
/// formats an edit takes the full path and the EPUB is rewritten.
#[test]
fn epub_among_formats_forces_full_rebuild() {
    let (dir, _events, mut watch) = stdin_watch("cases/watch_narrow_epub", &[]);
    let project = dir.path();

    let epub = project.join("build/epub");
    let epub_files = |dir: &std::path::Path| -> Vec<(std::path::PathBuf, SystemTime)> {
        let mut files: Vec<_> = walkdir::WalkDir::new(dir)
            .into_iter()
            .filter_map(Result::ok)
            .filter(|e| e.file_type().is_file())
            .map(|e| (e.path().to_path_buf(), mtime(e.path())))
            .collect();
        files.sort();
        files
    };
    let before = epub_files(&epub);
    assert!(!before.is_empty(), "initial build must write the EPUB");

    let c_typ = project.join("c.typ");
    let mut src = fs::read_to_string(&c_typ).expect("read c.typ");
    src.push_str("\nEdited with epub on.\n");
    fs::write(&c_typ, &src).expect("rewrite c.typ");
    let event = watch.rebuild(&["c.typ"]);
    assert!(event.contains(r#""ok":true,"kind":"full""#), "{event}");

    let c_html = fs::read_to_string(project.join("build/html/c.html")).unwrap();
    assert!(c_html.contains("Edited with epub on."));
    assert_ne!(
        epub_files(&epub),
        before,
        "the EPUB must be rebuilt, not left stale by a narrowed round"
    );
}

/// A narrowed rebuild of a math-free page keeps the equation CSS that
/// typst-html emits on every page of a compile with math anywhere.
#[test]
fn narrowed_rebuild_keeps_equation_css() {
    const EQUATION_CSS: &str = "/* Alignment */";
    let (dir, _events, mut watch) = stdin_watch("cases/watch_narrow_math", &[]);
    let project = dir.path();

    let b_html = project.join("build/html/b.html");
    assert_eq!(
        fs::read_to_string(&b_html)
            .unwrap()
            .matches(EQUATION_CSS)
            .count(),
        1,
        "full build must carry the equation CSS on every page"
    );

    let b_typ = project.join("b.typ");
    let mut src = fs::read_to_string(&b_typ).expect("read b.typ");
    src.push_str("\nEdited without math.\n");
    fs::write(&b_typ, &src).expect("rewrite b.typ");
    let event = watch.rebuild(&["b.typ"]);
    assert!(event.contains(r#""kind":"narrowed""#), "{event}");

    let html = fs::read_to_string(&b_html).unwrap();
    assert!(html.contains("Edited without math."), "b.html rewritten");
    assert_eq!(html.matches(EQUATION_CSS).count(), 1, "{html}");
}
