//! End-to-end coverage for `[packages.<ns>] repo = ...` — a namespace served
//! from a repository ref rather than a releases host.
//!
//! rheo's own unit tests cover the checkout backend in isolation: sha-keying,
//! cache hits, a branch advancing, and each error message. What they cannot
//! reach is the part that fails SILENTLY. Pre-warming and the package index run
//! before asset detection, and a package they miss produces a build that
//! succeeds and a page with no stylesheet — no error anywhere. These tests
//! assert on the built output, which is the only place that shows.

use rheo_core::config::manifest_version;
use rheo_tests::helpers::cli::rheo_cli_command;
use std::path::Path;
use std::process::Command;

/// Run git in `dir`, failing loudly — these build the fixture repository that
/// rheo then fetches from.
fn git_in(dir: &Path, args: &[&str]) {
    let output = Command::new("git")
        .current_dir(dir)
        .args(["-c", "user.name=rheo", "-c", "user.email=rheo@example.org"])
        .args(args)
        .output()
        .expect("git should be on PATH");
    assert!(
        output.status.success(),
        "git {args:?} failed: {}",
        String::from_utf8_lossy(&output.stderr),
    );
}

/// A repository with one package at `<name>/0.1.0/`, committed on `main`.
///
/// `files` are written under the package directory; `manifest` is its
/// `typst.toml` body after the `[package]` table.
fn fixture_repo(repo: &Path, name: &str, manifest: &str, files: &[(&str, &str)]) {
    std::fs::create_dir_all(repo).unwrap();
    git_in(repo, &["init", "--quiet", "--initial-branch=main", "."]);

    let pkg = repo.join(name).join("0.1.0");
    std::fs::create_dir_all(&pkg).unwrap();
    std::fs::write(
        pkg.join("typst.toml"),
        format!(
            "[package]\nname = \"{name}\"\nversion = \"0.1.0\"\n\
             entrypoint = \"src/lib.typ\"\n\n{manifest}",
        ),
    )
    .unwrap();
    for (rel, contents) in files {
        let path = pkg.join(rel);
        std::fs::create_dir_all(path.parent().unwrap()).unwrap();
        std::fs::write(path, contents).unwrap();
    }

    // `dist/` is build output no ref carries; the fixture must not accidentally
    // ship one, or these tests stop testing source mode at all.
    std::fs::write(repo.join(".gitignore"), "dist/\n").unwrap();
    git_in(repo, &["add", "-A"]);
    git_in(repo, &["commit", "--quiet", "-m", "fixture"]);
}

/// A project importing `@fixture/<name>:0.1.0` with the namespace pointed at
/// `repo`.
fn fixture_project(project: &Path, repo: &Path, name: &str) {
    std::fs::write(
        project.join("main.typ"),
        format!("#import \"@fixture/{name}:0.1.0\": *\n= Hello\n"),
    )
    .unwrap();
    std::fs::write(
        project.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n\n\
             [packages.fixture]\nrepo = \"{}\"\nbranch = \"main\"\n",
            manifest_version::CURRENT,
            repo.display(),
        ),
    )
    .unwrap();
}

fn compile(project: &Path, build_dir: &Path, cache: &Path) -> std::process::Output {
    rheo_cli_command()
        .args([
            "compile",
            project.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .env("XDG_CACHE_HOME", cache)
        .env("XDG_DATA_HOME", cache.join("data"))
        .output()
        .expect("failed to run rheo compile")
}

/// THE REGRESSION GUARD. A package fetched from a ref lives at a sha-keyed path
/// that bears no relation to the `{namespace}/{name}/{version}` layout the asset
/// scan probes. When that is not routed through the resolver the package is
/// fetched, found by nobody, and contributes no assets — and the build still
/// succeeds. Only the output shows it.
#[test]
fn repo_backed_namespace_assets_reach_the_output() {
    let tmp = tempfile::tempdir().unwrap();
    let repo = tmp.path().join("repo");
    let project = tmp.path().join("project");
    let cache = tmp.path().join("cache");
    std::fs::create_dir_all(&project).unwrap();

    fixture_repo(
        &repo,
        "buildless",
        "[tool.rheo.html]\ncss_stylesheet = \"src/pkg.css\"\n",
        &[("src/lib.typ", ""), ("src/pkg.css", "body { color: red; }")],
    );
    fixture_project(&project, &repo, "buildless");

    let build_dir = project.join("build");
    let output = compile(&project, &build_dir, &cache);
    assert!(
        output.status.success(),
        "compilation failed: {}",
        String::from_utf8_lossy(&output.stderr),
    );

    assert!(
        build_dir.join("html/fixture/buildless/pkg.css").exists(),
        "the package's stylesheet never reached the output — the build was green and the page \
         unstyled, which is the whole failure mode this test exists for",
    );
    let html = std::fs::read_to_string(build_dir.join("html/main.html")).unwrap();
    assert!(
        html.contains("fixture/buildless/pkg.css"),
        "the page does not link the package stylesheet:\n{html}",
    );
}

/// A ref carries no `dist/`, so a built package's source block names its
/// unbundled scripts, and those only run as ES modules.
#[test]
fn source_mode_serves_unbundled_modules() {
    let tmp = tempfile::tempdir().unwrap();
    let repo = tmp.path().join("repo");
    let project = tmp.path().join("project");
    let cache = tmp.path().join("cache");
    std::fs::create_dir_all(&project).unwrap();

    fixture_repo(
        &repo,
        "built",
        "[tool.rheo.html]\njs_scripts = \"dist/lib.js\"\ncss_stylesheet = \"src/pkg.css\"\n\n\
         [tool.rheo.source.html]\njs_scripts = [\"src/a.js\", \"src/b.js\"]\njs_module = true\n",
        &[
            ("src/lib.typ", ""),
            ("src/pkg.css", "body { color: green; }"),
            ("src/a.js", "import { b } from './b.js';\nb();\n"),
            ("src/b.js", "export function b() {}\n"),
        ],
    );
    fixture_project(&project, &repo, "built");

    let build_dir = project.join("build");
    let output = compile(&project, &build_dir, &cache);
    assert!(
        output.status.success(),
        "compilation failed: {}",
        String::from_utf8_lossy(&output.stderr),
    );

    // Every listed script lands, with its name intact, so the relative imports
    // between them still resolve in the browser.
    for script in ["a.js", "b.js"] {
        assert!(
            build_dir.join("html/fixture/built").join(script).exists(),
            "source-mode script {script} missing from the output",
        );
    }
    assert!(
        !build_dir.join("html/fixture/built/lib.js").exists(),
        "the release bundle must not appear: no ref carries one",
    );

    let html = std::fs::read_to_string(build_dir.join("html/main.html")).unwrap();
    assert!(
        html.contains(r#"type="module""#),
        "an unbundled script uses `import` and only runs as a module:\n{html}",
    );
    assert!(
        !html.contains("defer"),
        "a module is deferred by default; emitting defer as well would only mislead:\n{html}",
    );

    // The source block names only the SCRIPTS. A package declares its stylesheet
    // once, in the ordinary block, so a source block that replaced the whole
    // block rather than overriding key by key would drop it — leaving a page
    // with working JavaScript and no styling, and no error anywhere.
    assert!(
        build_dir.join("html/fixture/built/pkg.css").exists(),
        "the ordinary block's stylesheet must survive source mode",
    );
    assert!(
        html.contains("fixture/built/pkg.css"),
        "the page must still link the package stylesheet:\n{html}",
    );
}

/// A built package with no source block names a bundle the ref cannot carry.
/// Left alone that is a page with no behaviour and nothing explaining why, so it
/// has to be an error that names the file.
#[test]
fn built_package_without_build_output_is_an_error() {
    let tmp = tempfile::tempdir().unwrap();
    let repo = tmp.path().join("repo");
    let project = tmp.path().join("project");
    let cache = tmp.path().join("cache");
    std::fs::create_dir_all(&project).unwrap();

    fixture_repo(
        &repo,
        "nobuild",
        "[tool.rheo.html]\njs_scripts = \"dist/lib.js\"\n",
        &[("src/lib.typ", "")],
    );
    fixture_project(&project, &repo, "nobuild");

    let output = compile(&project, &project.join("build"), &cache);
    assert!(
        !output.status.success(),
        "a package whose declared bundle is absent must fail, not ship a silent no-op",
    );

    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("dist/lib.js") && stderr.contains("@fixture/nobuild:0.1.0"),
        "the error must name the package and the missing file:\n{stderr}",
    );
}
