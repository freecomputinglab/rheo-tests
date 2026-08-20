//! Smoke coverage for `rheo watch` / the dev server (rheo-tests-u30). Scoped
//! to: server starts, serves the initial page, and rebuilds on a source
//! change — not a full served-vs-compiled byte comparison. That parity check
//! is `rheo-tests-watch-head-parity-typ`, which depends on the
//! `helpers::devserver::DevServer` capability exercised here (spawn the dev
//! server, fetch a page over HTTP, assert on the served HTML).

use rheo_tests::helpers::devserver::DevServer;
use std::fs;

#[test]
fn dev_server_serves_and_rebuilds_on_change() {
    let project = tempfile::tempdir().expect("tempdir");
    let content = project.path().join("content");
    fs::create_dir_all(&content).expect("mkdir content");
    fs::write(
        project.path().join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            rheo_core::config::manifest_version::CURRENT
        ),
    )
    .expect("write rheo.toml");
    let index = content.join("index.typ");
    fs::write(&index, "= Watch Smoke Test\nMarker-v1\n").expect("write index.typ");

    let server = DevServer::start(project.path(), &["--html"]);

    let initial = server.get("/");
    assert!(
        initial.contains("Marker-v1"),
        "expected initial page to contain Marker-v1, got:\n{initial}"
    );

    fs::write(&index, "= Watch Smoke Test\nMarker-v2\n").expect("rewrite index.typ");
    server.wait_for("/", |body| body.contains("Marker-v2"));
}
