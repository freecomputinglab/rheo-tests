//! Regression coverage for three narrowed-rebuild (`[watch] narrow = true`)
//! staleness bugs found by reading rheo's source, each landed as one
//! `#[ignore]`d test that FAILS on today's rheo — the oracle for every test
//! is a fresh full `rheo compile` of the edited project.
//!
//! `cases/watch_narrow_regressions` has 6 vertebrae (`post`, `list`,
//! `holder`, `reader`, `x`, `y`; `_lib/item.typ` is excluded from the spine),
//! clearing the `floor(total * 0.25) = 1` narrowed-rebuild threshold for a
//! single dependent (see `tests/watch_narrow.rs`'s doc comment on the same
//! threshold with a 3-vertebra fixture).

use rheo_tests::helpers::{
    devserver::DevServer,
    fixtures::TestCase,
    narrow::{assert_html_trees_equal, fresh_compile_html},
    test_store::copy_project_to_test_store,
};
use std::fs;

fn start_server() -> (tempfile::TempDir, DevServer) {
    let fixture = TestCase::new("cases/watch_narrow_regressions");
    let dir = tempfile::tempdir().expect("tempdir");
    let project = dir.path();
    copy_project_to_test_store(fixture.project_path(), project).expect("copy fixture");
    let server = DevServer::start(project, &["--html"]);
    (dir, server)
}

#[test]
#[ignore = "rheo bug: rheo-metadata-impl never emits a rheo-ligament-bind, so a page \
            reading another vertebra's metadata via metadata-of is never treated as its \
            dependent and is not recompiled on a narrowed rebuild"]
fn metadata_listing_follows_title_edit() {
    let (dir, server) = start_server();
    let project = dir.path();
    let build_html = project.join("build/html");

    let post_typ = project.join("post.typ");
    let src = fs::read_to_string(&post_typ).expect("read post.typ");
    let edited = src.replace("First", "Second");
    assert_ne!(src, edited, "fixture must contain \"First\" to edit");

    server.edit_and_wait_for_rebuild(|| {
        fs::write(&post_typ, &edited).expect("rewrite post.typ");
    });

    let list_html = fs::read_to_string(build_html.join("list.html")).expect("read list.html");
    assert!(
        list_html.contains("Latest: Second"),
        "list.html did not pick up post's title edit:\n{list_html}"
    );

    assert_html_trees_equal(
        &build_html,
        &fresh_compile_html(project).path().join("build/html"),
    );
}

#[test]
#[ignore = "rheo bug: Build::set_incoming_ligaments is never reset, so a full rebuild \
            after a narrowed one is still fed the stale ligaments from that earlier \
            narrowed pass"]
fn full_rebuild_after_narrowed_drops_stale_ligaments() {
    let (dir, server) = start_server();
    let project = dir.path();
    let build_html = project.join("build/html");

    // Narrowed rebuild of `holder` alone, priming the fed-in ligaments.
    let holder_typ = project.join("holder.typ");
    let mut holder_src = fs::read_to_string(&holder_typ).expect("read holder.typ");
    holder_src.push_str("\nAn extra unrelated line.\n");
    server.edit_and_wait_for_rebuild(|| {
        fs::write(&holder_typ, &holder_src).expect("rewrite holder.typ");
    });

    // Edit a file outside the spine that `holder` imports: not itself a
    // vertebra, so this must fall back to a full rebuild.
    let item_typ = project.join("_lib/item.typ");
    let item_src = fs::read_to_string(&item_typ).expect("read _lib/item.typ");
    let item_edited = item_src.replace("alpha", "gamma");
    assert_ne!(
        item_src, item_edited,
        "fixture must contain \"alpha\" to edit"
    );

    let line = server.edit_and_wait_for_rebuild(|| {
        fs::write(&item_typ, &item_edited).expect("rewrite _lib/item.typ");
    });
    assert!(
        line.starts_with("full rebuild:"),
        "editing a non-vertebra dependency must trigger a full rebuild: {line}"
    );

    let reader_html = fs::read_to_string(build_html.join("reader.html")).expect("read reader.html");
    assert!(
        reader_html.contains("gamma"),
        "reader.html did not pick up the renamed item id:\n{reader_html}"
    );
    assert!(
        !reader_html.contains("alpha"),
        "reader.html still shows the stale ligament-fed \"alpha\" entry:\n{reader_html}"
    );

    assert_html_trees_equal(
        &build_html,
        &fresh_compile_html(project).path().join("build/html"),
    );
}

#[test]
#[ignore = "rheo bug: narrow_one_plugin's `seen` filter skips a dependent already compiled \
            this rebuild, so a bind cycle (x binds ky, y binds kx) never reaches a fixpoint \
            on a narrowed rebuild"]
fn bind_cycle_reaches_fixpoint() {
    let (dir, server) = start_server();
    let project = dir.path();
    let build_html = project.join("build/html");

    let x_typ = project.join("x.typ");
    let src = fs::read_to_string(&x_typ).expect("read x.typ");
    let edited = src.replace("x1", "x2");
    assert_ne!(src, edited, "fixture must contain \"x1\" to edit");

    server.edit_and_wait_for_rebuild(|| {
        fs::write(&x_typ, &edited).expect("rewrite x.typ");
    });

    let x_html = fs::read_to_string(build_html.join("x.html")).expect("read x.html");
    assert!(
        x_html.contains("y-of-x2"),
        "x.html did not see y's updated reflection of the new kx value:\n{x_html}"
    );

    assert_html_trees_equal(
        &build_html,
        &fresh_compile_html(project).path().join("build/html"),
    );
}
