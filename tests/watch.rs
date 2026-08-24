//! Coverage for `rheo watch` and its dev server: that the server starts,
//! serves the initial page, rebuilds on a source change, and serves exactly
//! what `rheo compile` writes.

use rheo_tests::helpers::{
    cli::rheo_cli_command, devserver::DevServer, fixtures::TestCase,
    test_store::copy_project_to_test_store,
};
use std::fs;

/// The dev server always injects a live-reload `<script>` immediately before
/// `</body>` (`crates/html/src/server.rs::inject_live_reload_script`) — a
/// deliberate, permanent difference from a static compile. Strip it before
/// comparing served bytes to `rheo compile` output.
fn strip_live_reload_script(served: &str) -> String {
    const START: &str = "\n<script>\nconst eventSource = new EventSource";
    let start = served.find(START).expect("live-reload script present");
    let end = served[start..]
        .find("</script>\n")
        .map(|i| start + i + "</script>\n".len())
        .expect("live-reload script closes");
    format!("{}{}", &served[..start], &served[end..])
}

/// Parity check for rheo bead `rheo-head-hoist-watch-mhp`: `rheo watch` must
/// serve exactly what `rheo compile` writes for a page using `<rheo-head>`.
/// `cases/head_hoist` covers three shapes in one project — a wrapper
/// mid-body (a.html), two wrappers pinning hoist order (b.html), and a
/// control page with no wrapper at all (c.html) — and configures no CSS/JS
/// override and no `.rheo/head.html` fragment, relying solely on the html
/// plugin's default stylesheet. That is the gate `needs_head_mutation` used
/// to skip a parse for when nothing else triggered it, so c.html's parity
/// alone would not have caught the bug — a.html and b.html's would.
#[test]
fn served_html_matches_compiled_html_for_rheo_head() {
    let fixture = TestCase::new("cases/head_hoist");
    let dir = tempfile::tempdir().expect("tempdir");
    let project = dir.path();
    copy_project_to_test_store(fixture.project_path(), project).expect("copy fixture");
    fs::write(
        project.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            rheo_core::config::manifest_version::CURRENT
        ),
    )
    .expect("patch rheo.toml version");

    let server = DevServer::start(project, &["--html"]);

    // `rheo watch` serves from disk until its first in-memory rebuild lands
    // (`update_virtual_fs`, pushed once and never unset); a request right at
    // startup can race that push and hit the disk fallback, which is always
    // correct and would mask this exact bug. Force and await one rebuild —
    // by the time its effect is observable at all, the *first* push has long
    // since completed (both precede it in `run_watch`'s sequential setup) —
    // so every request after this is guaranteed to exercise the in-memory path.
    let c_typ = project.join("c.typ");
    let mut c_src = fs::read_to_string(&c_typ).expect("read c.typ");
    c_src.push_str("\nRebuildMarker\n");
    fs::write(&c_typ, &c_src).expect("rewrite c.typ");
    server.wait_for("/c.html", |body| body.contains("RebuildMarker"));

    let build_dir = project.join("build");
    let compile = rheo_cli_command()
        .args([
            "compile",
            project.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("run rheo compile");
    assert!(
        compile.status.success(),
        "compile failed: {}",
        String::from_utf8_lossy(&compile.stderr)
    );

    for page in ["a.html", "b.html", "c.html"] {
        let compiled = fs::read_to_string(build_dir.join("html").join(page))
            .unwrap_or_else(|e| panic!("read compiled {page}: {e}"));
        let served = strip_live_reload_script(&server.get(&format!("/{page}")));
        assert_eq!(served, compiled, "served {page} must match compiled {page}");
    }
}

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
