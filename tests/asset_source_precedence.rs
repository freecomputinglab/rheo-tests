//! Pins asset-source precedence in `AssetResolver::resolve`
//! (rheo `crates/core/src/assets/mod.rs`) ahead of rheo-w8ph.9, which collapses
//! `AssetEntry { is_pkg: bool }` and the embedded-default branch into one
//! `AssetSource` enum. Two behaviours there are asserted only by comments
//! today:
//!
//! 1. (`assets/mod.rs:99-101`, current lines) the project-root convention
//!    default is pushed when `user_pairs.is_empty()`, NOT `all_pairs.is_empty()`
//!    — a package block is additive and must never satisfy the project's own
//!    emptiness test.
//! 2. (`assets/mod.rs:161-170`) a missing declared file warns only
//!    `if !is_pkg` — a package-declared file that's missing stays silent.
//!
//! Confirmed by reading `../rheo` before writing these: both match the code
//! exactly as described above.
//!
//! `nothing declared → embedded fallback appears` is already pinned by
//! `test_default_css_is_linked_asset` in `tests/harness.rs` (via
//! `cases/default_css_linked`), so it isn't repeated here.

use rheo_tests::helpers::project::{FakePackage, TempProject};

/// project-root convention default (`style.css`) wins over the embedded
/// fallback (`rheo-default.css`) when nothing overrides it.
#[test]
fn test_project_default_wins_over_embedded_fallback() {
    let project = TempProject::new(&["html"])
        .file("style.css", "/* project default */")
        .file("main.typ", "= Hello\n\nTest document.\n");
    let build_dir = project.build_dir();

    let output = project.compile(&["--html"]);
    assert!(
        output.status.success(),
        "compile failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    assert_eq!(
        std::fs::read_to_string(build_dir.join("html/style.css")).unwrap(),
        "/* project default */",
        "project-root style.css should be copied verbatim"
    );
    assert!(
        !build_dir.join("html/rheo-default.css").exists(),
        "embedded fallback must not fire when the project has its own style.css"
    );

    let html = std::fs::read_to_string(build_dir.join("html/main.html")).unwrap();
    assert!(
        html.contains(r#"href="style.css""#),
        "html should link the project's style.css:\n{html}"
    );
    assert!(
        !html.contains("rheo-default.css"),
        "html should not link the embedded default:\n{html}"
    );
}

/// A user override (`[html.assets] css_stylesheet`) wins over the project-root
/// convention default: the convention file, even though present on disk, is
/// never touched or linked once a user override exists.
#[test]
fn test_user_override_wins_over_project_default() {
    let project = TempProject::new(&["html"])
        .config("\n[html.assets]\ncss_stylesheet = \"custom.css\"\n")
        .file("style.css", "/* project default */")
        .file("custom.css", "/* user override */")
        .file("main.typ", "= Hello\n\nTest document.\n");
    let build_dir = project.build_dir();

    let output = project.compile(&["--html"]);
    assert!(
        output.status.success(),
        "compile failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    assert_eq!(
        std::fs::read_to_string(build_dir.join("html/custom.css")).unwrap(),
        "/* user override */",
        "user override should be copied verbatim"
    );
    assert!(
        !build_dir.join("html/style.css").exists(),
        "project-root default must not be copied once a user override exists"
    );

    let html = std::fs::read_to_string(build_dir.join("html/main.html")).unwrap();
    assert!(
        html.contains(r#"href="custom.css""#),
        "html should link the user override:\n{html}"
    );
    assert!(
        !html.contains(r#"href="style.css""#),
        "html should not link the project default:\n{html}"
    );
}

/// A package block contributing `css_stylesheet` is additive to an unrelated
/// project-root convention default — both resolve and both are linked, and
/// the embedded fallback is suppressed since a source was found for each.
#[test]
fn test_package_block_additive_with_project_default() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();

    FakePackage::new(
        &data_dir.path().join("typst/packages"),
        "@testns/testpkg:0.1.0",
    )
    .manifest(
        "[package]\nname = \"testpkg\"\nversion = \"0.1.0\"\nentrypoint = \"lib.typ\"\n\n\
             [tool.rheo.html]\ncss_stylesheet = \"index.css\"\n",
    )
    .file("index.css", "/* pkg */");

    let project = TempProject::new(&["html"])
        .file("style.css", "/* project default */")
        .file(
            "main.typ",
            "#import \"@testns/testpkg:0.1.0\": *\n= Hello\n\nTest document.\n",
        );
    let build_dir = project.build_dir();

    let output = project.compile_with_env(
        &["--html"],
        &[
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );
    assert!(
        output.status.success(),
        "compile failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    assert_eq!(
        std::fs::read_to_string(build_dir.join("html/style.css")).unwrap(),
        "/* project default */",
        "project's own default must survive an unrelated package block"
    );
    assert_eq!(
        std::fs::read_to_string(build_dir.join("html/testns/testpkg/index.css")).unwrap(),
        "/* pkg */",
        "package css must still be included"
    );
    assert!(
        !build_dir.join("html/rheo-default.css").exists(),
        "embedded fallback must not fire when either source resolved"
    );

    let html = std::fs::read_to_string(build_dir.join("html/main.html")).unwrap();
    assert!(
        html.contains(r#"href="style.css""#),
        "html should link the project default:\n{html}"
    );
    assert!(
        html.contains(r#"href="testns/testpkg/index.css""#),
        "html should link the package css:\n{html}"
    );
}

/// A package block declaring a file that does not exist on disk is silently
/// skipped: the build still succeeds and no warning is required for it (only
/// a *user*-declared missing override warns).
#[test]
fn test_package_block_missing_file_is_silent() {
    let data_dir = tempfile::tempdir().unwrap();
    let cache_dir = tempfile::tempdir().unwrap();

    // typst.toml declares css_stylesheet but "missing.css" is never written.
    FakePackage::new(
        &data_dir.path().join("typst/packages"),
        "@testns/testpkg:0.1.0",
    )
    .manifest(
        "[package]\nname = \"testpkg\"\nversion = \"0.1.0\"\nentrypoint = \"lib.typ\"\n\n\
         [tool.rheo.html]\ncss_stylesheet = \"missing.css\"\n",
    );

    let project = TempProject::new(&["html"])
        .file("style.css", "/* project default */")
        .file(
            "main.typ",
            "#import \"@testns/testpkg:0.1.0\": *\n= Hello\n\nTest document.\n",
        );
    let build_dir = project.build_dir();

    let output = project.compile_with_env(
        &["--html"],
        &[
            ("XDG_DATA_HOME", data_dir.path()),
            ("XDG_CACHE_HOME", cache_dir.path()),
        ],
    );
    assert!(
        output.status.success(),
        "compile should succeed despite a package's missing declared file: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    assert!(
        !build_dir.join("html/testns/testpkg/missing.css").exists(),
        "the missing package file should not appear in the output"
    );

    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        !stderr.contains("missing.css"),
        "a package's missing declared file must not warn:\n{stderr}"
    );
}
