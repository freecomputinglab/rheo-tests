use rheo_core::config::manifest_version;
use rheo_core::plugins::PackageIndex;
use rheo_tests::helpers::cli::rheo_cli_command;
use rheo_tests::helpers::project::FakePackage;

#[test]
fn detect_manifest_package_assets_reads_tool_rheo_section() {
    let search_root = tempfile::tempdir().unwrap();
    let pkg = FakePackage::new(search_root.path(), "@testns/testpkg:0.1.0");
    let pkg_dir = pkg.root().to_path_buf();
    std::fs::write(
        pkg_dir.join("typst.toml"),
        r#"
[package]
name = "testpkg"
version = "0.1.0"
entrypoint = "lib.typ"

[tool.rheo.html]
css_stylesheet = "style.css"
js_scripts = "main.js"
"#,
    )
    .unwrap();
    std::fs::write(pkg_dir.join("style.css"), "body { color: red; }").unwrap();
    std::fs::write(pkg_dir.join("main.js"), "console.log('hi');").unwrap();
    std::fs::write(pkg_dir.join("lib.typ"), "").unwrap();

    let imports = vec!["@testns/testpkg:0.1.0".to_string()];
    let blocks =
        PackageIndex::new(&imports, &[search_root.path().to_path_buf()]).manifest_assets("html");

    assert_eq!(blocks.len(), 1);
    assert_eq!(blocks[0].assets.dest.as_deref(), Some("testns/testpkg"));
    assert_eq!(
        blocks[0]
            .assets
            .extra
            .get("css_stylesheet")
            .and_then(|v| v.as_str()),
        Some("style.css")
    );
    assert_eq!(
        blocks[0]
            .assets
            .extra
            .get("js_scripts")
            .and_then(|v| v.as_str()),
        Some("main.js")
    );
}

#[test]
fn detect_manifest_skips_packages_without_tool_rheo() {
    let search_root = tempfile::tempdir().unwrap();
    let pkg = FakePackage::new(search_root.path(), "@otherns/pkg:1.0");
    let pkg_dir = pkg.root().to_path_buf();
    std::fs::write(
        pkg_dir.join("typst.toml"),
        "[package]\nname = \"pkg\"\nversion = \"1.0\"\n",
    )
    .unwrap();

    let imports = vec!["@otherns/pkg:1.0".to_string()];
    let blocks =
        PackageIndex::new(&imports, &[search_root.path().to_path_buf()]).manifest_assets("html");
    assert!(blocks.is_empty());
}

/// E2e test: compile a project that imports a package with [tool.rheo.html]
/// assets, verify CSS/JS appear in the output and are referenced in the HTML.
///
/// Uses XDG_CACHE_HOME to redirect `dirs::cache_dir()` to a tempdir so the
/// fake package is found without polluting the real Typst package cache.
#[test]
fn e2e_auto_detected_manifest_package_assets() {
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    // Set up fake package in cache
    let pkg = FakePackage::new(
        &cache_dir.path().join("typst/packages"),
        "@e2ens/e2epkg:0.1.0",
    );
    let pkg_dir = pkg.root().to_path_buf();
    std::fs::write(
        pkg_dir.join("typst.toml"),
        r#"
[package]
name = "e2epkg"
version = "0.1.0"
entrypoint = "lib.typ"

[tool.rheo.html]
css_stylesheet = "pkg-style.css"
js_scripts = "pkg-script.js"
"#,
    )
    .unwrap();
    std::fs::write(pkg_dir.join("pkg-style.css"), "body { color: blue; }").unwrap();
    std::fs::write(pkg_dir.join("pkg-script.js"), "console.log('e2e');").unwrap();
    std::fs::write(pkg_dir.join("lib.typ"), "").unwrap();

    // Set up project
    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@e2ens/e2epkg:0.1.0": *
= Hello
Test document.
"#,
    )
    .unwrap();

    // rheo.toml: no explicit packages, rely on auto-detect
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");

    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .env("XDG_CACHE_HOME", cache_dir.path())
        .env("XDG_DATA_HOME", cache_dir.path().join("data"))
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // CSS/JS assets should be in the output
    assert!(
        build_dir.join("html/e2ens/e2epkg/pkg-style.css").exists(),
        "auto-detected CSS not found at html/e2ens/e2epkg/pkg-style.css"
    );
    assert!(
        build_dir.join("html/e2ens/e2epkg/pkg-script.js").exists(),
        "auto-detected JS not found at html/e2ens/e2epkg/pkg-script.js"
    );

    // HTML output references the assets
    let html = std::fs::read_to_string(build_dir.join("html/main.html"))
        .expect("Failed to read HTML output");
    assert!(
        html.contains("e2ens/e2epkg/pkg-style.css"),
        "HTML should reference auto-detected CSS:\n{}",
        html
    );
    assert!(
        html.contains("e2ens/e2epkg/pkg-script.js"),
        "HTML should reference auto-detected JS:\n{}",
        html
    );
}

fn stage_package_in_data_dir(data_dir: &std::path::Path) {
    let pkg = FakePackage::new(&data_dir.join("typst/packages"), "@testns/testpkg:0.1.0");
    let pkg_dir = pkg.root().to_path_buf();
    std::fs::write(
        pkg_dir.join("typst.toml"),
        r#"
[package]
name = "testpkg"
version = "0.1.0"
entrypoint = "lib.typ"

[tool.rheo.html]
css_stylesheet = "style.css"
"#,
    )
    .unwrap();
    std::fs::write(pkg_dir.join("style.css"), "body { color: green; }").unwrap();
    std::fs::write(pkg_dir.join("lib.typ"), "").unwrap();
}

/// Compile `project_path` to HTML with extra environment — an `XDG_DATA_HOME`
/// or `XDG_CACHE_HOME` redirect, so a staged [`FakePackage`] is found without
/// touching the real Typst package cache.
fn run_rheo_compile(
    project_path: &std::path::Path,
    build_dir: &std::path::Path,
    env_extra: Vec<(&str, &std::path::Path)>,
) -> std::process::Output {
    let mut cmd = rheo_cli_command();
    cmd.args([
        "compile",
        project_path.to_str().unwrap(),
        "--html",
        "--build-dir",
        build_dir.to_str().unwrap(),
    ])
    .env("TYPST_IGNORE_SYSTEM_FONTS", "1");
    for (key, path) in &env_extra {
        cmd.env(key, path);
    }
    cmd.output().expect("Failed to run rheo compile")
}

/// Setting `auto_detect_packages = false` suppresses import-driven asset
/// injection, even when the .typ file imports the package.
#[test]
fn auto_detect_packages_false_skips_detection() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    stage_package_in_data_dir(data_dir.path());

    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@testns/testpkg:0.1.0": *
= Hello
Opt-out test.
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n\n[html]\nauto_detect_packages = false\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");

    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // The package assets should NOT be copied
    assert!(
        !build_dir.join("html/testns/testpkg/style.css").exists(),
        "auto-detect opted out but assets were still copied"
    );

    let html = std::fs::read_to_string(build_dir.join("html/main.html")).expect("read HTML output");
    assert!(
        !html.contains("testns/testpkg/style.css"),
        "HTML should not reference auto-detected CSS when opted out:\n{}",
        html
    );
}

/// Auto-detect works for non-preview namespaces: package is in XDG_DATA_HOME.
/// Pre-warm skips non-preview packages, so auto-detect scans the data dir directly.
#[test]
fn auto_detects_non_preview_package_assets_from_data_dir() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    stage_package_in_data_dir(data_dir.path());

    // No explicit packages in rheo.toml; auto_detect_packages defaults to true.
    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@testns/testpkg:0.1.0": *
= Hello
Non-preview auto-detect test.
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");

    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    assert!(
        build_dir.join("html/testns/testpkg/style.css").exists(),
        "auto-detected CSS not found at html/testns/testpkg/style.css"
    );

    let html = std::fs::read_to_string(build_dir.join("html/main.html")).expect("read HTML output");
    assert!(
        html.contains("testns/testpkg/style.css"),
        "HTML should reference auto-detected CSS:\n{}",
        html
    );
}

/// Manifest `copy` patterns cause matched files to be copied into the output.
#[test]
fn manifest_copy_patterns_copied_to_output() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    // Set up package with copy patterns and some asset files
    let pkg_dir = data_dir.path().join("typst/packages/testns/copypkg/0.1.0");
    std::fs::create_dir_all(pkg_dir.join("img")).unwrap();
    std::fs::write(
        pkg_dir.join("typst.toml"),
        r#"[package]
name = "copypkg"
version = "0.1.0"
entrypoint = "lib.typ"

[tool.rheo.html]
copy = ["img/*.png"]
css_stylesheet = "pkg-style.css"
"#,
    )
    .unwrap();
    std::fs::write(pkg_dir.join("pkg-style.css"), "body { color: green; }").unwrap();
    std::fs::write(pkg_dir.join("img/logo.png"), "fake-png-data").unwrap();
    std::fs::write(pkg_dir.join("img/ignored.txt"), "not-matched").unwrap();
    std::fs::write(pkg_dir.join("lib.typ"), "").unwrap();

    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@testns/copypkg:0.1.0": *
= Hello
Copy pattern test.
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");

    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // The PNG matched by copy pattern should be in the output
    assert!(
        build_dir.join("html/testns/copypkg/img/logo.png").exists(),
        "copy-matched PNG not found at html/testns/copypkg/img/logo.png"
    );
    // The .txt file should NOT be copied (not matched by pattern)
    assert!(
        !build_dir
            .join("html/testns/copypkg/img/ignored.txt")
            .exists(),
        "non-matched file should not be copied"
    );
}

/// Stage a package that ships its own `.marrow.typ`: importing it is enough for
/// rheo to inline that text at the Typst bundle root, where `document()` is
/// legal, so the package mints a page no vertebra backs. The marrow reaches the
/// package's own code by package spec, since inlined text resolves against the
/// project root rather than the package directory.
fn stage_marrow_package(data_dir: &std::path::Path) {
    let pkg = FakePackage::new(&data_dir.join("typst/packages"), "@mns/mpkg:0.1.0");
    let pkg_dir = pkg.root().to_path_buf();
    std::fs::write(
        pkg_dir.join("typst.toml"),
        r#"[package]
name = "mpkg"
version = "0.1.0"
entrypoint = "lib.typ"
"#,
    )
    .unwrap();
    std::fs::write(
        pkg_dir.join("lib.typ"),
        r#"#let notes = state("mpkg-notes", ())
#let note(name, body) = { notes.update(v => v + ((name: name, body: body),)); body }
"#,
    )
    .unwrap();
    // Arbitrary top-level Typst — no named entry point rheo has to know about.
    std::fs::write(
        pkg_dir.join(".marrow.typ"),
        r#"#import "@mns/mpkg:0.1.0": notes
#document("notes/alpha.html", format: "html", title: [Alpha])[Minted by the package.]
#context {
  for n in notes.final() {
    document("notes/" + n.name + ".html", format: "html", title: [Note])[#n.body]
  }
}
"#,
    )
    .unwrap();
}

/// E2e: a package shipping its own `.marrow.typ` mints pages purely because the
/// project imports it — the project writes no marrow and no rheo.toml entry.
#[test]
fn e2e_package_declared_marrow_mints_a_page() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    stage_marrow_package(data_dir.path());

    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@mns/mpkg:0.1.0": note
= Hello
#note("beta")[Registered from a vertebra.]
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");
    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // The ordinary vertebra still builds.
    assert!(
        build_dir.join("html/main.html").exists(),
        "the project's own page is missing"
    );

    // The package's marrow ran at bundle root and minted its page.
    assert!(
        build_dir.join("html/notes/alpha.html").exists(),
        "package marrow did not mint notes/alpha.html; stderr:\n{}",
        String::from_utf8_lossy(&output.stderr)
    );

    // ...and it could introspect state the vertebra registered.
    assert!(
        build_dir.join("html/notes/beta.html").exists(),
        "package marrow did not see state registered by a vertebra"
    );

    // The combined PDF target skips marrow entirely, so it must still succeed.
    let pdf_build = project_path.join("build-pdf");
    let mut cmd = rheo_cli_command();
    cmd.args([
        "compile",
        project_path.to_str().unwrap(),
        "--pdf",
        "--build-dir",
        pdf_build.to_str().unwrap(),
    ])
    .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
    .env("XDG_DATA_HOME", data_dir.path())
    .env("XDG_CACHE_HOME", cache_dir.path());
    let pdf_output = cmd.output().expect("Failed to run rheo compile --pdf");
    assert!(
        pdf_output.status.success(),
        "pdf compile failed: {}",
        String::from_utf8_lossy(&pdf_output.stderr)
    );
}

/// `auto_detect_packages = false` is one switch for all manifest-driven
/// behaviour: it suppresses package-declared marrow just as it suppresses
/// package assets.
#[test]
fn package_marrow_respects_auto_detect_opt_out() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    stage_marrow_package(data_dir.path());

    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@mns/mpkg:0.1.0": note
= Hello
#note("beta")[Registered from a vertebra.]
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n\n[html]\nauto_detect_packages = false\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");
    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        build_dir.join("html/main.html").exists(),
        "the project's own page is missing"
    );
    assert!(
        !build_dir.join("html/notes/alpha.html").exists(),
        "opted out of auto-detect but package marrow still ran"
    );
    assert!(
        !build_dir.join("html/notes/beta.html").exists(),
        "opted out of auto-detect but package marrow still ran"
    );
}

/// Stage a package that ships the given marrow text, or none at all, and return
/// the search root to hand the detector.
fn stage_package_with_marrow(marrow: Option<&str>) -> tempfile::TempDir {
    let search_root = tempfile::tempdir().unwrap();
    let pkg = FakePackage::new(search_root.path(), "@mns/mpkg:0.1.0");
    let pkg_dir = pkg.root().to_path_buf();
    std::fs::write(
        pkg_dir.join("typst.toml"),
        "[package]\nname = \"mpkg\"\nversion = \"0.1.0\"\nentrypoint = \"lib.typ\"\n",
    )
    .unwrap();
    std::fs::write(pkg_dir.join("lib.typ"), "").unwrap();
    if let Some(text) = marrow {
        std::fs::write(pkg_dir.join(".marrow.typ"), text).unwrap();
    }
    search_root
}

/// A package's marrow is inlined verbatim — rheo neither parses nor rewrites it.
#[test]
fn detect_package_marrow_returns_the_file_verbatim() {
    let text = "#import \"@mns/mpkg:0.1.0\": notes\n#context { }\n";
    let root = stage_package_with_marrow(Some(text));

    let imports = vec!["@mns/mpkg:0.1.0".to_string()];
    let found = PackageIndex::new(&imports, &[root.path().to_path_buf()]).marrow();

    assert_eq!(found, vec![text.to_string()]);
}

#[test]
fn detect_package_marrow_skips_packages_without_one() {
    let root = stage_package_with_marrow(None);

    let imports = vec!["@mns/mpkg:0.1.0".to_string()];
    let found = PackageIndex::new(&imports, &[root.path().to_path_buf()]).marrow();

    assert!(found.is_empty());
}

/// Every imported package contributes, in import order, so several packages can
/// each extend the bundle independently.
#[test]
fn detect_package_marrow_collects_every_package_in_import_order() {
    let search_root = tempfile::tempdir().unwrap();
    for (name, text) in [("apkg", "#let a = 1\n"), ("bpkg", "#let b = 2\n")] {
        FakePackage::new(search_root.path(), &format!("@mns/{name}:0.1.0"))
            .file(".marrow.typ", text);
    }

    let imports = vec!["@mns/bpkg:0.1.0".to_string(), "@mns/apkg:0.1.0".to_string()];
    let found = PackageIndex::new(&imports, &[search_root.path().to_path_buf()]).marrow();

    assert_eq!(
        found,
        vec!["#let b = 2\n".to_string(), "#let a = 1\n".to_string()]
    );
}

/// A project's own marrow and an imported package's are both inlined — neither
/// suppresses the other — and the project's filename is configurable while a
/// package always ships `.marrow.typ`.
#[test]
fn e2e_project_and_package_marrow_both_inline() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    stage_marrow_package(data_dir.path());

    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@mns/mpkg:0.1.0": note
= Hello
#note("beta")[Registered from a vertebra.]
"#,
    )
    .unwrap();
    // The project names its marrow something other than the default.
    std::fs::write(
        project_path.join("bundle-root.typ"),
        r#"#document("site/extra.html", format: "html", title: [Extra])[From the project marrow.]
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\nmarrow = \"bundle-root.typ\"\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");
    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // The package's marrow ran...
    assert!(
        build_dir.join("html/notes/alpha.html").exists(),
        "package marrow did not run"
    );
    assert!(
        build_dir.join("html/notes/beta.html").exists(),
        "package marrow did not see vertebra-registered state"
    );
    // ...and so did the project's, under its configured name.
    assert!(
        build_dir.join("html/site/extra.html").exists(),
        "project marrow under a configured filename did not run"
    );
    // The renamed marrow is not a vertebra.
    assert!(
        !build_dir.join("html/bundle-root.html").exists(),
        "the configured marrow file was compiled as a vertebra"
    );
    assert!(
        build_dir.join("html/main.html").exists(),
        "the project's own page is missing"
    );
}

/// Stage a package at `mns/<name>/0.1.0` shipping the given marrow text.
fn stage_named_marrow_package(data_dir: &std::path::Path, name: &str, marrow: &str) {
    FakePackage::new(
        &data_dir.join("typst/packages"),
        &format!("@mns/{name}:0.1.0"),
    )
    .file("lib.typ", "#let marker = \"present\"\n")
    .file(".marrow.typ", marrow);
}

/// Several imported packages may each ship a `.marrow.typ`, and every one is
/// inlined — a package's contribution never displaces another's.
#[test]
fn e2e_multiple_packages_each_contribute_marrow() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    stage_named_marrow_package(
        data_dir.path(),
        "onepkg",
        r#"#document("one/page.html", format: "html", title: [One])[From package one.]
#asset("one/data.json", "{\"pkg\":1}")
"#,
    );
    stage_named_marrow_package(
        data_dir.path(),
        "twopkg",
        r#"#document("two/page.html", format: "html", title: [Two])[From package two.]
"#,
    );
    // A third package ships marrow but is never imported: it must contribute nothing.
    stage_named_marrow_package(
        data_dir.path(),
        "unusedpkg",
        r#"#document("unused/page.html", format: "html", title: [Unused])[Never imported.]
"#,
    );

    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@mns/onepkg:0.1.0": marker
#import "@mns/twopkg:0.1.0": marker as marker2
= Hello
Two packages imported.
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");
    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );
    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    assert!(
        build_dir.join("html/one/page.html").exists(),
        "first package's marrow did not run"
    );
    assert!(
        build_dir.join("html/two/page.html").exists(),
        "second package's marrow did not run"
    );
    // Marrow mints assets as well as documents, written verbatim.
    let asset = std::fs::read_to_string(build_dir.join("html/one/data.json"))
        .expect("package marrow asset missing");
    assert_eq!(asset, "{\"pkg\":1}");
    // An unimported package contributes nothing, even though it ships marrow.
    assert!(
        !build_dir.join("html/unused/page.html").exists(),
        "marrow ran for a package the project never imported"
    );
}

/// Every marrow is inlined into ONE top-level scope, packages first and the
/// project last: the project's marrow can use a binding that a package's marrow
/// imported, without importing it itself.
#[test]
fn e2e_marrow_shares_one_top_level_scope_packages_first() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    // The package's marrow imports a binding and mints nothing itself.
    stage_named_marrow_package(
        data_dir.path(),
        "scopepkg",
        "#import \"@mns/scopepkg:0.1.0\": marker\n",
    );

    std::fs::write(
        project_path.join("main.typ"),
        r#"#import "@mns/scopepkg:0.1.0": marker
= Hello
Scope test.
"#,
    )
    .unwrap();
    // The project's marrow uses `marker` without importing it — only possible
    // if the package's marrow was inlined into the same scope, ahead of it.
    std::fs::write(
        project_path.join(".marrow.typ"),
        r#"#document("scope/page.html", format: "html", title: [Scope])[marker is #marker]
"#,
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");
    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );
    assert!(
        output.status.success(),
        "project marrow could not see a package marrow's binding: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    let page = std::fs::read_to_string(build_dir.join("html/scope/page.html"))
        .expect("scope/page.html missing");
    assert!(
        page.contains("marker is present"),
        "binding did not resolve in the project's marrow:\n{page}"
    );
}

/// An empty marrow file is a no-op, not a compile error.
#[test]
fn e2e_empty_package_marrow_is_a_no_op() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();
    let project_dir = tempfile::tempdir().unwrap();
    let project_path = project_dir.path();

    stage_named_marrow_package(data_dir.path(), "emptypkg", "");

    std::fs::write(
        project_path.join("main.typ"),
        "#import \"@mns/emptypkg:0.1.0\": marker\n= Hello\n",
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .unwrap();

    let build_dir = project_path.join("build");
    let output = run_rheo_compile(
        project_path,
        &build_dir,
        vec![
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );
    assert!(
        output.status.success(),
        "empty marrow broke the build: {}",
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(build_dir.join("html/main.html").exists());
}

/// Stage a package under `search_root` whose `typst.toml` is exactly `body` —
/// for a manifest whose own contents are the subject.
fn stage_manifest(search_root: &std::path::Path, ns: &str, name: &str, version: &str, body: &str) {
    FakePackage::new(search_root, &format!("@{ns}/{name}:{version}")).manifest(body);
}

#[test]
fn min_version_below_current_is_accepted() {
    let search_root = tempfile::tempdir().unwrap();
    stage_manifest(
        search_root.path(),
        "testns",
        "testpkg",
        "0.1.0",
        "[tool.rheo]\nmin_version = \"0.1.0\"\n",
    );
    assert!(
        PackageIndex::new(
            &["@testns/testpkg:0.1.0".to_string()],
            &[search_root.path().to_path_buf()]
        )
        .check_min_versions()
        .is_ok()
    );
}

#[test]
fn min_version_above_current_is_rejected() {
    let search_root = tempfile::tempdir().unwrap();
    stage_manifest(
        search_root.path(),
        "testns",
        "testpkg",
        "0.1.0",
        "[tool.rheo]\nmin_version = \"99.0.0\"\n",
    );
    let err = PackageIndex::new(
        &["@testns/testpkg:0.1.0".to_string()],
        &[search_root.path().to_path_buf()],
    )
    .check_min_versions()
    .unwrap_err();
    let message = err.to_string();
    assert!(message.contains("@testns/testpkg:0.1.0"));
    assert!(message.contains("99.0.0"));
    // Compared against rheo-core's own build-time version, not this test
    // binary's — rheo-tests and rheo are versioned independently.
    assert!(message.contains(manifest_version::CURRENT));
}

#[test]
fn no_min_version_is_accepted() {
    let search_root = tempfile::tempdir().unwrap();
    stage_manifest(
        search_root.path(),
        "testns",
        "testpkg",
        "0.1.0",
        "[tool.rheo.html]\ncss_stylesheet = \"style.css\"\n",
    );
    assert!(
        PackageIndex::new(
            &["@testns/testpkg:0.1.0".to_string()],
            &[search_root.path().to_path_buf()]
        )
        .check_min_versions()
        .is_ok()
    );
}

/// One build reports every stale package, not just the first, one line each.
#[test]
fn min_version_names_every_offender_in_one_build() {
    let search_root = tempfile::tempdir().unwrap();
    stage_manifest(
        search_root.path(),
        "ns",
        "a",
        "1.0",
        "[tool.rheo]\nmin_version = \"99.0.0\"\n",
    );
    stage_manifest(
        search_root.path(),
        "ns",
        "b",
        "1.0",
        "[tool.rheo]\nmin_version = \"98.0.0\"\n",
    );
    stage_manifest(
        search_root.path(),
        "ns",
        "c",
        "1.0",
        "[tool.rheo]\nmin_version = \"0.1.0\"\n",
    );

    let err = PackageIndex::new(
        &[
            "@ns/a:1.0".to_string(),
            "@ns/b:1.0".to_string(),
            "@ns/c:1.0".to_string(),
        ],
        &[search_root.path().to_path_buf()],
    )
    .check_min_versions()
    .unwrap_err();
    let message = err.to_string();
    assert!(message.contains("@ns/a:1.0") && message.contains("99.0.0"));
    assert!(message.contains("@ns/b:1.0") && message.contains("98.0.0"));
    assert!(
        !message.contains("@ns/c:1.0"),
        "satisfied package named as an offender"
    );
}

/// The documented trap: a bare `min_version` key after `[tool.rheo.<format>]`,
/// with no `[tool.rheo]` header of its own, is scoped by TOML to the last
/// header seen — it lands inside that subtable, not `[tool.rheo]`, so the
/// floor is silently never read rather than enforced.
#[test]
fn min_version_misplaced_under_format_subtable_is_not_read() {
    let search_root = tempfile::tempdir().unwrap();
    stage_manifest(
        search_root.path(),
        "testns",
        "testpkg",
        "0.1.0",
        "[tool.rheo.html]\ncss_stylesheet = \"style.css\"\nmin_version = \"99.0.0\"\n",
    );
    assert!(
        PackageIndex::new(
            &["@testns/testpkg:0.1.0".to_string()],
            &[search_root.path().to_path_buf()]
        )
        .check_min_versions()
        .is_ok(),
        "misplaced min_version should be silently ignored, not enforced"
    );
}
