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
    devserver::DevServer,
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
