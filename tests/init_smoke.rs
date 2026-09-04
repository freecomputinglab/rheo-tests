//! Pins what `rheo init` writes and that the result compiles, ahead of
//! rheo-faqm.9 (`crates/cli/src/lib.rs`'s `prefix_toml_headers` replaced by
//! `toml_edit`). Nothing asserted this before: the template file set, that
//! each plugin's `options_toml` snippet lands nested under its own plugin
//! table, and that the generated `rheo.toml` is valid against the version it
//! declares.

use rheo_core::RheoConfig;
use rheo_tests::helpers::cli::rheo_cli_command;
use std::path::Path;
use std::process::Output;

fn run_init(target: &Path) -> Output {
    rheo_cli_command()
        .args(["init", target.to_str().expect("utf-8 path")])
        .output()
        .expect("run rheo init")
}

fn run_compile(target: &Path, build_dir: &Path) -> Output {
    rheo_cli_command()
        .args([
            "compile",
            target.to_str().expect("utf-8 path"),
            "--build-dir",
            build_dir.to_str().expect("utf-8 path"),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("run rheo compile")
}

fn has_entries(dir: &Path) -> bool {
    std::fs::read_dir(dir).is_ok_and(|mut d| d.next().is_some())
}

#[test]
fn test_init_produces_a_compiling_project() {
    let tmp = tempfile::tempdir().expect("tempdir");
    let project = tmp.path().join("proj");

    let init_output = run_init(&project);
    assert!(
        init_output.status.success(),
        "rheo init failed: {}",
        String::from_utf8_lossy(&init_output.stderr)
    );

    // Template set: rheo.toml, the four content files, and each plugin's own
    // template files (only the html plugin contributes any: style.css, index.js).
    for rel in [
        "rheo.toml",
        "content/index.typ",
        "content/about.typ",
        "content/references.bib",
        "content/img/header.svg",
        "style.css",
        "index.js",
    ] {
        assert!(project.join(rel).exists(), "rheo init should write {rel}");
    }

    // The generated rheo.toml parses against the version it declares, and each
    // plugin's `options_toml` snippet landed nested under its own plugin table
    // rather than colliding at the top level (`[spine]` -> `[pdf.spine]` /
    // `[epub.spine]`).
    let config = RheoConfig::load(&project).expect("generated rheo.toml should parse");
    assert_eq!(
        config
            .spine_for_plugin("pdf")
            .and_then(|s| s.title.as_deref()),
        Some("rheo_project"),
        "pdf plugin's spine.title should land under [pdf.spine]"
    );
    assert_eq!(
        config
            .spine_for_plugin("epub")
            .and_then(|s| s.title.as_deref()),
        Some("rheo_project"),
        "epub plugin's spine.title should land under [epub.spine]"
    );

    let build_dir = tmp.path().join("build");
    let compile_output = run_compile(&project, &build_dir);
    assert!(
        compile_output.status.success(),
        "compiling an init'd project failed: {}",
        String::from_utf8_lossy(&compile_output.stderr)
    );

    // No `formats` in rheo.toml and no format flags on the CLI => every
    // default format compiles.
    for format in ["html", "pdf", "epub"] {
        assert!(
            has_entries(&build_dir.join(format)),
            "expected {format} output in {}",
            build_dir.join(format).display()
        );
    }
}
