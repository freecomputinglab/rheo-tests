use ntest::test_case;
use rheo_core::{RheoConfig, config::manifest_version, config::project::ProjectConfig};
use rheo_tests::helpers::{
    cli::rheo_cli_command,
    comparison::{
        compare_or_update_text_asset, verify_epub_output, verify_html_output, verify_pdf_output,
    },
    compiled::{CompiledFixture, TestStore, patch_manifest_version},
    fixtures::TestCase,
    project::TempProject,
    reference::{update_epub_references, update_html_references, update_pdf_references},
    test_store::copy_project_to_test_store,
};
use std::env;
use std::path::{Path, PathBuf};

/// Asserts every pattern is a substring of `output`; `label` names the kind of
/// pattern (e.g. `"error"`, `"warning"`) for the failure message.
/// The single `.epub` a build produced, asserting there is exactly one.
fn sole_epub(built: &CompiledFixture) -> PathBuf {
    let epubs: Vec<PathBuf> = std::fs::read_dir(built.path("epub"))
        .expect("read build/epub")
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|p| p.extension().is_some_and(|x| x == "epub"))
        .collect();
    assert_eq!(epubs.len(), 1, "expected exactly one EPUB, got {epubs:?}");
    epubs.into_iter().next().expect("one epub")
}

fn assert_patterns_present(patterns: &[String], output: &str, label: &str) {
    for pattern in patterns {
        assert!(
            output.contains(pattern.as_str()),
            "Expected {} output to contain pattern '{}', but it was not found.\nFull output:\n{}",
            label,
            pattern,
            output
        );
    }
}

#[test_case("examples/blog_site")]
#[test_case("examples/blog_post")]
#[test_case("examples/cover-letter.typ")]
#[test_case("examples/blog_site/content/index.typ")]
#[test_case("examples/blog_site/content/severance-ep-1.typ")]
#[test_case("examples/blog_post/portable_epubs.typ")]
#[test_case("cases/code_blocks_with_links")]
#[test_case("cases/cross_directory_label_collision")]
#[test_case("cases/cross_directory_links")]
#[test_case("cases/nested_vertebra_href")]
#[test_case("cases/escape_form_nested")]
#[test_case("cases/deep_nested_href")]
#[test_case("cases/section_handle_nesting")]
#[test_case("cases/epub_nested_spine")]
#[test_case("cases/bundle_ref_cross_directory")]
#[test_case("cases/epub_inferred_spine")]
#[test_case("cases/link_path_edge_cases")]
#[test_case("cases/link_rule_static")]
#[test_case("cases/link_transformation")]
#[test_case("cases/links_with_fragments")]
#[test_case("cases/dead_link_error.typ")]
#[test_case("cases/multiple_links_inline")]
#[test_case("cases/pdf_individual")]
#[test_case("cases/pdf_merge_false")]
#[test_case("cases/pdf_spine_merge_false")]
#[test_case("cases/merged_pdf_cross_links")]
#[test_case("cases/script_injection")]
#[test_case("cases/script_injection_no_css")]
#[test_case("cases/relative_path_links")]
#[test_case("cases/target_function")]
#[test_case("cases/target_function_in_module")]
#[test_case("cases/target_function_in_package")]
#[test_case("cases/error_formatting/type_error.typ")]
#[test_case("cases/error_formatting/undefined_var.typ")]
#[test_case("cases/error_formatting/syntax_error.typ")]
#[test_case("cases/error_formatting/function_arg_error.typ")]
#[test_case("cases/error_formatting/import_error.typ")]
#[test_case("cases/error_formatting/unknown_function.typ")]
#[test_case("cases/error_formatting/invalid_method.typ")]
#[test_case("cases/error_formatting/invalid_field.typ")]
#[test_case("cases/error_formatting/multiple_errors.typ")]
#[test_case("cases/error_formatting/array_index_error.typ")]
#[test_case("cases/removed_rheo_target_helper.typ")]
#[test_case("cases/removed_is_rheo_helpers.typ")]
#[test_case("cases/no_rheo_vars")]
#[test_case("cases/merged_subdir_imports")]
#[test_case("cases/spine_field_level_merge")]
#[test_case("cases/rheo_package_slides")]
#[test_case("cases/math")]
#[test_case("cases/rheo_context_spine")]
#[test_case("cases/spine_scan_tree")]
#[test_case("cases/spine_exclude")]
#[test_case("cases/spine_sections")]
#[test_case("cases/spine_include")]
#[test_case("cases/spine_include_section_conflict")]
#[test_case("cases/spine_include_no_match")]
#[test_case("cases/spine_performat")]
#[test_case("cases/rheo_context_sys_inputs")]
#[test_case("cases/spine_document_metadata")]
#[test_case("cases/document_title_string_form")]
#[test_case("cases/rheo_context_all_formats")]
#[test_case("cases/rheo_context_escaping")]
#[test_case("cases/html_css_injection")]
#[test_case("cases/head_hoist")]
#[test_case("cases/head_control")]
#[test_case("cases/template_element")]
#[test_case("cases/footnote_reset_per_page")]
#[test_case("cases/footnote_no_reset")]
#[test_case("cases/bundle_multi_bibliography")]
#[test_case("cases/metadata_template_title")]
#[test_case("cases/metadata_show_and_code_block")]
#[test_case("cases/metadata_nonliteral_values")]
#[test_case("cases/metadata_multiple_set_rules")]
#[test_case("cases/metadata_handle_anchor_display_text")]
#[test_case("cases/document_date_incomplete.typ")]
#[test_case("cases/retired_key_merge_warns")]
#[test_case("cases/version_mismatch_migrate_warns")]
#[test_case("cases/retired_feed_keys_warn")]
#[test_case("cases/font_dirs_disables_autoscan")]
#[test_case("cases/transclude_missing_page")]
#[test_case("cases/transclude_attr_gt")]
#[test_case("store/compat/merged-imports")]
fn run_test_case(name: &str) {
    let test_case = TestCase::new(name);
    let update_mode = env::var("UPDATE_REFERENCES").is_ok();
    let test_name = test_case.name();
    let original_project_path = test_case.project_path();
    let is_single = test_case.is_single_file();

    let store = TestStore::fresh(test_name);

    // A single-file case is copied together with its parent directory, so a
    // sibling it imports comes along.
    let copy_from = if is_single {
        original_project_path
            .parent()
            .expect("single-file case has a parent directory")
    } else {
        original_project_path
    };
    copy_project_to_test_store(copy_from, store.path()).expect("copy project to test store");

    // `@rheo:keep-version` opts out, to exercise a deliberately stale version.
    if !test_case.metadata().is_some_and(|m| m.keep_version) {
        patch_manifest_version(&store.join("rheo.toml"));
    }

    let project_path = if is_single {
        store.join(
            original_project_path
                .file_name()
                .expect("single-file case has a file name"),
        )
    } else {
        store.path().to_path_buf()
    };

    let expects_error = test_case.metadata().and_then(|m| m.expect.as_deref()) == Some("error");

    // A rheo.toml rejected at config validation never reaches the compile below,
    // so for an error case the load failure itself is the expected error.
    let project = match ProjectConfig::from_path(&project_path, None) {
        Ok(project) => project,
        Err(e) if expects_error => {
            if let Some(metadata) = test_case.metadata() {
                assert_patterns_present(&metadata.error_patterns, &e.to_string(), "error");
            }
            return;
        }
        Err(e) => panic!("Failed to load project for {test_name}: {e}"),
    };
    let config = RheoConfig::load(&project.root);
    let declared_formats = test_case.formats();

    let env_html = env::var("RUN_HTML_TESTS").is_ok();
    let env_pdf = env::var("RUN_PDF_TESTS").is_ok();
    let env_epub = env::var("RUN_EPUB_TESTS").is_ok();
    let run_all = !env_html && !env_pdf && !env_epub;

    // A single-file case trusts its own markers; a directory case must also be
    // configured for the format.
    let enabled = |format: &str, env_selected: bool| {
        declared_formats.iter().any(|f| f == format)
            && (run_all || env_selected)
            && (is_single || config.as_ref().is_ok_and(|cfg| cfg.has_format(format)))
    };
    let (run_html, run_pdf, run_epub) = (
        enabled("html", env_html),
        enabled("pdf", env_pdf),
        enabled("epub", env_epub),
    );

    let build_dir = store.join("build");
    let mut compile_args = vec![
        "compile",
        project_path.to_str().expect("utf-8 project path"),
        "--build-dir",
        build_dir.to_str().expect("utf-8 build path"),
    ];
    // A directory case passes no format flags at all, leaving rheo's own
    // config/defaults to decide — which is what it is there to exercise.
    if is_single {
        for (flag, run) in [
            ("--html", run_html),
            ("--pdf", run_pdf),
            ("--epub", run_epub),
        ] {
            if run {
                compile_args.push(flag);
            }
        }
    }

    let output = rheo_cli_command()
        .args(&compile_args)
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");
    let stderr = String::from_utf8_lossy(&output.stderr);

    if expects_error {
        assert!(
            !output.status.success(),
            "Expected compilation to fail for {test_name}, but it succeeded"
        );
        if let Some(metadata) = test_case.metadata() {
            assert_patterns_present(&metadata.error_patterns, &stderr, "error");
        }
        return;
    }

    assert!(
        output.status.success(),
        "Compilation failed for {test_name}: {stderr}"
    );

    // A successful build may still be required to warn (e.g. retired-key or
    // version-mismatch notices).
    if let Some(metadata) = test_case.metadata() {
        assert_patterns_present(&metadata.warn_patterns, &stderr, "warning");
    }

    let check_html = |dir: &Path| {
        if update_mode {
            update_html_references(test_name, dir, &project_path).expect("update HTML references");
        } else {
            verify_html_output(test_name, dir, is_single);
        }
    };
    let check_pdf = |dir: &Path| {
        if update_mode {
            update_pdf_references(test_name, dir).expect("update PDF references");
        } else {
            verify_pdf_output(test_name, dir);
        }
    };
    let check_epub = |dir: &Path| {
        if update_mode {
            update_epub_references(test_name, dir).expect("update EPUB references");
        } else {
            verify_epub_output(test_name, dir);
        }
    };
    let checks: [(&str, bool, &dyn Fn(&Path)); 3] = [
        ("html", run_html, &check_html),
        ("pdf", run_pdf, &check_pdf),
        ("epub", run_epub, &check_epub),
    ];
    for (format, run, check) in checks {
        let dir = build_dir.join(format);
        if run && dir.exists() {
            check(&dir);
        }
    }
}

/// Test PDF merge functionality specifically
#[test]
fn test_pdf_merge() {
    use lopdf::Document;
    use rheo_tests::helpers::comparison::extract_pdf_metadata;

    let test_name = "pdf_merge";
    let test_case = TestCase::new(&format!("cases/{}", test_name));
    let original_project_path = test_case.project_path();

    // Create isolated test store
    let test_store = PathBuf::from("store").join(test_name);
    if test_store.exists() {
        std::fs::remove_dir_all(&test_store).expect("Failed to clean test store");
    }
    std::fs::create_dir_all(&test_store).expect("Failed to create test store");
    copy_project_to_test_store(original_project_path, &test_store)
        .expect("Failed to copy project to test store");

    let project_path = test_store.clone();
    let build_dir = test_store.join("build");

    // Compile with PDF merge
    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--pdf",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    if !output.status.success() {
        panic!(
            "Compilation failed: {}",
            String::from_utf8_lossy(&output.stderr)
        );
    }

    // Verify merged PDF created with correct name
    let pdf_path = build_dir.join("pdf/pdf_merge.pdf");
    assert!(pdf_path.exists(), "Merged PDF not created at expected path");

    // Verify valid PDF format and can be loaded
    let doc = Document::load(&pdf_path).expect("Failed to load merged PDF");
    let page_count = doc.get_pages().len();
    assert!(page_count > 0, "PDF has no pages");

    // Verify we have at least 1 page
    // Note: With minimal content, Typst may fit everything on one page
    assert!(
        page_count >= 1,
        "Expected at least 1 page, got {}",
        page_count
    );

    // Verify PDF metadata can be extracted
    let metadata = extract_pdf_metadata(&pdf_path).expect("Failed to extract PDF metadata");
    assert_eq!(
        metadata.page_count,
        Some(page_count as u32),
        "Page count mismatch"
    );

    // Clean up
    if test_store.exists() {
        std::fs::remove_dir_all(&test_store).ok();
    }
}

/// Test error case: link to file not in spine
#[test]
fn test_pdf_merge_link_not_in_spine() {
    // Create a test case with a file that links to a non-spine file
    let test_dir = PathBuf::from("tests/cases/pdf_merge_error_nonspine");
    std::fs::create_dir_all(&test_dir).expect("Failed to create test directory");

    // Create rheo.toml with only intro.typ in spine
    std::fs::write(
        test_dir.join("rheo.toml"),
        r#"[pdf.merge]
spine = ["intro.typ"]
title = "Test Error Case"
"#,
    )
    .expect("Failed to write rheo.toml");

    // Create intro.typ that links to chapter1.typ (not in spine)
    std::fs::write(
        test_dir.join("intro.typ"),
        r#"= Introduction <intro>

This links to #link(<chapter1>)[Chapter 1] which is not in the spine.
"#,
    )
    .expect("Failed to write intro.typ");

    // Create chapter1.typ (not in spine, but referenced)
    std::fs::write(
        test_dir.join("chapter1.typ"),
        r#"= Chapter 1 <chapter1>

Content here.
"#,
    )
    .expect("Failed to write chapter1.typ");

    // Try to compile - should fail or warn
    let output = rheo_cli_command()
        .args(["compile", test_dir.to_str().unwrap(), "--pdf"])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    // Clean up
    std::fs::remove_dir_all(&test_dir).ok();

    // Check if compilation failed with link error
    let stderr = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);
    let combined = format!("{}{}", stderr, stdout);

    // The compilation should fail because chapter1.typ is not in the spine
    // The transform_typ_links_to_labels function should detect this and return an error
    assert!(
        !output.status.success() || combined.contains("not found in spine"),
        "Expected error about link target not in spine, got:\nstderr: {}\nstdout: {}",
        stderr,
        stdout
    );
}

/// Test error case: duplicate filenames in spine
#[test]
fn test_pdf_merge_duplicate_filenames() {
    // Create a test case with duplicate filenames in different directories
    let test_dir = PathBuf::from("tests/cases/pdf_merge_error_duplicate");
    let dir1 = test_dir.join("dir1");
    let dir2 = test_dir.join("dir2");
    std::fs::create_dir_all(&dir1).expect("Failed to create dir1");
    std::fs::create_dir_all(&dir2).expect("Failed to create dir2");

    // Create rheo.toml with both files in spine
    std::fs::write(
        test_dir.join("rheo.toml"),
        r#"[pdf.merge]
spine = ["dir1/chapter.typ", "dir2/chapter.typ"]
title = "Test Duplicate Error"
"#,
    )
    .expect("Failed to write rheo.toml");

    // Create dir1/chapter.typ with a label
    std::fs::write(
        dir1.join("chapter.typ"),
        r#"= Chapter from Dir1 <chapter>

Content from dir1.
"#,
    )
    .expect("Failed to write dir1/chapter.typ");

    // Create dir2/chapter.typ with the same label
    std::fs::write(
        dir2.join("chapter.typ"),
        r#"= Chapter from Dir2 <chapter>

Content from dir2.
"#,
    )
    .expect("Failed to write dir2/chapter.typ");

    // Try to compile - should fail with duplicate label error
    let output = rheo_cli_command()
        .args(["compile", test_dir.to_str().unwrap(), "--pdf"])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    // Clean up
    std::fs::remove_dir_all(&test_dir).ok();

    // Typst will detect duplicate labels and fail
    // Check for error in output
    let stderr = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);
    let combined = format!("{}{}", stderr, stdout);

    // Typst should report duplicate label error
    assert!(
        !output.status.success() || combined.contains("duplicate") || combined.contains("label"),
        "Expected error about duplicate labels, got:\nstderr: {}\nstdout: {}",
        stderr,
        stdout
    );
}

/// Test warning formatting with codespan-reporting
#[test]
fn test_warning_formatting() {
    // Use blog_post which has a known warning (block in paragraph)
    let test_dir = PathBuf::from("examples/blog_post");

    // Clean first
    let _ = rheo_cli_command()
        .args(["clean", test_dir.to_str().unwrap()])
        .output();

    // Compile - should succeed with warnings
    let output = rheo_cli_command()
        .args(["compile", test_dir.to_str().unwrap(), "--pdf"])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    // Should succeed despite warnings
    assert!(
        output.status.success(),
        "Compilation should succeed with warnings"
    );

    let stderr = String::from_utf8_lossy(&output.stderr);

    // Verify warning formatting
    assert!(
        stderr.contains("warning"),
        "Output should contain warning marker"
    );

    // Check for codespan-reporting style formatting
    assert!(
        stderr.contains("│") || stderr.contains("|"),
        "Warning should use codespan-style formatting"
    );

    // Clean up
    let _ = rheo_cli_command()
        .args(["clean", test_dir.to_str().unwrap()])
        .output();
}

/// Test that global and per-plugin `asset` patterns in rheo.toml copy files into the build output.
#[test]
fn test_asset_patterns() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();

    // Source files to copy
    std::fs::write(project_path.join("readme.txt"), "hello world")
        .expect("Failed to write readme.txt");
    std::fs::create_dir_all(project_path.join("assets")).expect("Failed to create assets dir");
    std::fs::write(project_path.join("assets/logo.png"), b"\x89PNG\r\n\x1a\n")
        .expect("Failed to write assets/logo.png");

    // Typst source
    std::fs::write(project_path.join("main.typ"), "= Hello\n\nTest document.\n")
        .expect("Failed to write main.typ");

    // rheo.toml: global copies readme.txt; html-only copies assets/logo.png
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             copy = [\"readme.txt\"]\n\
             \n\
             [html.assets]\n\
             copy = [\"assets/logo.png\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

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
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // Global pattern: readme.txt should appear in html output dir
    let html_readme = build_dir.join("html/readme.txt");
    assert!(
        html_readme.exists(),
        "Global asset copy pattern: readme.txt not found in html output"
    );
    assert_eq!(
        std::fs::read_to_string(&html_readme).unwrap(),
        "hello world",
        "Copied readme.txt has wrong content"
    );

    // Per-plugin pattern: assets/logo.png should appear under html/assets/
    let html_logo = build_dir.join("html/assets/logo.png");
    assert!(
        html_logo.exists(),
        "Per-plugin asset copy pattern: assets/logo.png not found in html output"
    );
}

/// Test that copy globs across multiple [[html.assets]] blocks are all collected.
#[test]
fn test_asset_patterns_multiple_blocks() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();

    // Source files to copy from two different directories
    std::fs::create_dir_all(project_path.join("css")).expect("Failed to create css dir");
    std::fs::write(project_path.join("css/theme.css"), "body {}")
        .expect("Failed to write css/theme.css");
    std::fs::create_dir_all(project_path.join("js")).expect("Failed to create js dir");
    std::fs::write(project_path.join("js/app.js"), "console.log(1)")
        .expect("Failed to write js/app.js");

    // Typst source
    std::fs::write(project_path.join("main.typ"), "= Hello\n\nTest document.\n")
        .expect("Failed to write main.typ");

    // rheo.toml: two [[html.assets]] blocks each with their own copy patterns
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [[html.assets]]\n\
             copy = [\"css/**/*\"]\n\
             \n\
             [[html.assets]]\n\
             copy = [\"js/**/*\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

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
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // Both blocks' copy patterns should produce files in html output
    assert!(
        build_dir.join("html/css/theme.css").exists(),
        "css/theme.css not found in html output"
    );
    assert!(
        build_dir.join("html/js/app.js").exists(),
        "js/app.js not found in html output"
    );
}

/// Test that `**/*` glob patterns recursively copy nested files into the build output.
#[test]
fn test_asset_patterns_glob_recursive() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();

    // Create nested directory structure
    let icons_dir = project_path.join("images/icons");
    std::fs::create_dir_all(&icons_dir).expect("Failed to create images/icons dir");
    std::fs::write(project_path.join("images/hero.png"), b"\x89PNG\r\n\x1a\n")
        .expect("Failed to write images/hero.png");
    std::fs::write(icons_dir.join("arrow.svg"), "<svg>arrow</svg>")
        .expect("Failed to write images/icons/arrow.svg");

    // Typst source
    std::fs::write(project_path.join("main.typ"), "= Hello\n\nTest document.\n")
        .expect("Failed to write main.typ");

    // rheo.toml with recursive glob pattern
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [html.assets]\n\
             copy = [\"images/**/*\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

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
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // Both nested files should be copied, preserving directory structure
    let html_hero = build_dir.join("html/images/hero.png");
    assert!(
        html_hero.exists(),
        "Recursive glob: images/hero.png not found in html output"
    );

    let html_arrow = build_dir.join("html/images/icons/arrow.svg");
    assert!(
        html_arrow.exists(),
        "Recursive glob: images/icons/arrow.svg not found in html output"
    );
    assert_eq!(
        std::fs::read_to_string(&html_arrow).unwrap(),
        "<svg>arrow</svg>",
        "Copied arrow.svg has wrong content"
    );
}

/// Test that `dest` on a [[html.assets]] block prefixes copy-glob outputs while
/// preserving project-root-relative structure underneath.
#[test]
fn test_asset_patterns_dest_preserves_structure() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();

    // Single file + nested directory structure
    std::fs::write(project_path.join("image.png"), b"\x89PNG\r\n\x1a\n")
        .expect("Failed to write image.png");
    let icons_dir = project_path.join("images/icons");
    std::fs::create_dir_all(&icons_dir).expect("Failed to create images/icons dir");
    std::fs::write(icons_dir.join("arrow.svg"), "<svg>arrow</svg>")
        .expect("Failed to write images/icons/arrow.svg");

    // Typst source
    std::fs::write(project_path.join("main.typ"), "= Hello\n\nTest document.\n")
        .expect("Failed to write main.typ");

    // rheo.toml: one block with dest, one without
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [[html.assets]]\n\
             copy = [\"image.png\", \"images/**/*\"]\n\
             dest = \"allassets\"\n\
             \n\
             [[html.assets]]\n\
             copy = [\"main.typ\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

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
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // Block with dest = "allassets": structure preserved under dest prefix
    assert!(
        build_dir.join("html/allassets/image.png").exists(),
        "image.png not found at html/allassets/image.png"
    );
    assert!(
        build_dir
            .join("html/allassets/images/icons/arrow.svg")
            .exists(),
        "images/icons/arrow.svg not found at html/allassets/images/icons/arrow.svg"
    );

    // Block without dest: current behaviour (project-root-relative)
    assert!(
        build_dir.join("html/main.typ").exists(),
        "main.typ not found at html/main.typ (block without dest)"
    );
}

/// End-to-end test that `dest` works for both named assets and copy globs together.
#[test]
fn test_asset_dest_subdirectory() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();

    // Source files
    std::fs::write(project_path.join("index.typ"), "= Hello\n\nWorld.\n").unwrap();
    std::fs::write(project_path.join("image.png"), b"\x89PNG\r\n\x1a\n").unwrap();
    std::fs::write(project_path.join("index.css"), "body { color: red; }").unwrap();
    std::fs::create_dir_all(project_path.join("dist")).unwrap();
    std::fs::write(project_path.join("dist/index.js"), "console.log(\"hi\");").unwrap();

    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [[html.assets]]\n\
             dest = \"allassets\"\n\
             copy = [\"image.png\"]\n\
             js_scripts     = \"dist/index.js\"\n\
             css_stylesheet = \"index.css\"\n",
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
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // All assets land under allassets/
    assert!(
        build_dir.join("html/allassets/image.png").is_file(),
        "image.png not found at html/allassets/image.png"
    );
    assert!(
        build_dir.join("html/allassets/index.css").is_file(),
        "index.css not found at html/allassets/index.css"
    );
    assert!(
        build_dir.join("html/allassets/index.js").is_file(),
        "index.js not found at html/allassets/index.js (basename stripped from dist/index.js)"
    );

    // HTML output references the dest-prefixed paths
    let html = std::fs::read_to_string(build_dir.join("html/index.html")).unwrap();
    assert!(
        html.contains("allassets/index.css"),
        "html should link stylesheet at allassets/index.css:\n{}",
        html
    );
    assert!(
        html.contains("allassets/index.js"),
        "html should reference script at allassets/index.js:\n{}",
        html
    );
}

/// Test that `rheo init` creates a valid project that compiles successfully
#[test]
fn test_rheo_init_and_compile() {
    let test_dir = PathBuf::from("store/init_project");

    // Clean previous test artifacts
    if test_dir.exists() {
        std::fs::remove_dir_all(&test_dir).expect("Failed to clean test dir");
    }

    // Run `rheo init`
    let init_output = rheo_cli_command()
        .args(["init", test_dir.to_str().unwrap()])
        .output()
        .expect("Failed to run rheo init");

    assert!(
        init_output.status.success(),
        "rheo init failed: {}",
        String::from_utf8_lossy(&init_output.stderr)
    );

    // Verify expected files exist
    assert!(test_dir.join("rheo.toml").exists(), "Missing rheo.toml");

    let rheo_toml =
        std::fs::read_to_string(test_dir.join("rheo.toml")).expect("Failed to read rheo.toml");
    assert!(
        !rheo_toml.contains("vertebrae"),
        "rheo.toml should not contain the retired 'vertebrae' key:\n{}",
        rheo_toml
    );

    assert!(test_dir.join("style.css").exists(), "Missing style.css");
    assert!(test_dir.join("index.js").exists(), "Missing index.js");
    assert!(
        test_dir.join("content/index.typ").exists(),
        "Missing content/index.typ"
    );
    assert!(
        test_dir.join("content/about.typ").exists(),
        "Missing content/about.typ"
    );

    // Compile the initialized project
    let build_dir = test_dir.join("build");
    let compile_output = rheo_cli_command()
        .args([
            "compile",
            test_dir.to_str().unwrap(),
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        compile_output.status.success(),
        "Compilation of init project failed: {}",
        String::from_utf8_lossy(&compile_output.stderr)
    );

    // Verify outputs were created
    assert!(
        build_dir.join("html").exists(),
        "HTML output directory missing"
    );

    // Clean up
    if test_dir.exists() {
        std::fs::remove_dir_all(&test_dir).ok();
    }
}

/// Test that asset path overrides work end-to-end via rheo.toml
#[test]
fn test_asset_path_override() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();
    let build_dir = project_path.join("build");

    // Custom CSS at non-default path
    std::fs::write(project_path.join("custom.css"), "body { color: red; }")
        .expect("Failed to write custom.css");

    // Minimal Typst source
    std::fs::write(project_path.join("main.typ"), "= Hello\n\nTest document.\n")
        .expect("Failed to write main.typ");

    // rheo.toml with asset path override
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [html.assets]\n\
             css_stylesheet = \"custom.css\"\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // custom.css should be copied to output dir
    let copied_css = build_dir.join("html/custom.css");
    assert!(
        copied_css.exists(),
        "custom.css should be copied to html output"
    );
    assert_eq!(
        std::fs::read_to_string(&copied_css).unwrap(),
        "body { color: red; }",
        "Copied CSS has wrong content"
    );

    // HTML should link to custom.css
    let html_path = build_dir.join("html/main.html");
    let html = std::fs::read_to_string(&html_path).expect("Failed to read HTML");
    assert!(
        html.contains(r#"href="custom.css""#),
        "HTML should contain link to custom.css"
    );
}

/// Test that subdirectory path overrides work end-to-end
#[test]
fn test_asset_path_override_subdirectory() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();
    let build_dir = project_path.join("build");

    // Custom CSS in subdirectory
    let styles_dir = project_path.join("styles");
    std::fs::create_dir_all(&styles_dir).expect("Failed to create styles dir");
    std::fs::write(styles_dir.join("custom.css"), "body { color: blue; }")
        .expect("Failed to write styles/custom.css");

    // Minimal Typst source
    std::fs::write(project_path.join("main.typ"), "= Hello\n\nTest document.\n")
        .expect("Failed to write main.typ");

    // rheo.toml with subdirectory override
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [html.assets]\n\
             css_stylesheet = \"styles/custom.css\"\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // styles/custom.css should be copied to output dir preserving subdirectory
    let copied_css = build_dir.join("html/styles/custom.css");
    assert!(
        copied_css.exists(),
        "styles/custom.css should be copied to html output"
    );

    // HTML should link to styles/custom.css
    let html_path = build_dir.join("html/main.html");
    let html = std::fs::read_to_string(&html_path).expect("Failed to read HTML");
    assert!(
        html.contains(r#"href="styles/custom.css""#),
        "HTML should contain link to styles/custom.css"
    );
}

/// Test that multiple [[html.assets]] blocks produce multiple stylesheet/script links in HTML.
#[test]
fn test_asset_multiple_blocks_inject_all() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();

    std::fs::write(project_path.join("one.css"), "/* one */").unwrap();
    std::fs::write(project_path.join("two.css"), "/* two */").unwrap();
    std::fs::write(project_path.join("one.js"), "// one").unwrap();
    std::fs::write(project_path.join("two.js"), "// two").unwrap();
    std::fs::write(project_path.join("hello.typ"), "Hello").unwrap();

    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             [[html.assets]]\n\
             css_stylesheet = \"one.css\"\n\
             js_scripts     = \"one.js\"\n\
             [[html.assets]]\n\
             css_stylesheet = \"two.css\"\n\
             js_scripts     = \"two.js\"\n",
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
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    for f in ["one.css", "two.css", "one.js", "two.js"] {
        assert!(build_dir.join("html").join(f).exists(), "missing {}", f);
    }

    let html = std::fs::read_to_string(build_dir.join("html/hello.html")).unwrap();
    assert!(
        html.contains("one.css") && html.contains("two.css"),
        "html should link both stylesheets:\n{}",
        html
    );
    assert!(
        html.contains("one.js") && html.contains("two.js"),
        "html should reference both scripts:\n{}",
        html
    );
}

/// Verify the output format is exposed on `sys.inputs.rheo-context.target`
/// (per-format value) and that the removed `sys.inputs.rheo-target` key is gone.
///
/// Companion to the `is-rheo-*` helper coverage; this asserts the raw context
/// field and the key removal directly.
#[test]
fn test_rheo_context_target_and_no_legacy_key() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();

    // A single vertebra renders the raw context target and probes the old key.
    std::fs::write(
        project_path.join("page.typ"),
        "ctxtarget=#sys.inputs.rheo-context.target\n\n\
         pretarget=#rheo-context().target\n\n\
         oldkey=#{ if \"rheo-target\" in sys.inputs { \"present\" } else { \"absent\" } }\n",
    )
    .unwrap();
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\", \"epub\"]\n",
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
            "--epub",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");
    assert!(
        output.status.success(),
        "Compilation failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // HTML build: target == "html", legacy key absent.
    let html = std::fs::read_to_string(build_dir.join("html/page.html")).unwrap();
    assert!(
        html.contains("ctxtarget=html"),
        "html should expose rheo-context.target == html:\n{html}"
    );
    // Per-vertebra `rheo-context()` composes the same target from sys.inputs.
    assert!(
        html.contains("pretarget=html"),
        "html prelude rheo-context.target must == html:\n{html}"
    );
    assert!(
        html.contains("oldkey=absent"),
        "sys.inputs.rheo-target must be absent (oldkey=absent) in html:\n{html}"
    );

    // EPUB build: same probes, target == "epub". EPUB packs into a .epub zip,
    // so extract its xhtml entries and search their combined text.
    let epub_file = std::fs::read_dir(build_dir.join("epub"))
        .unwrap()
        .filter_map(|e| e.ok().map(|e| e.path()))
        .find(|p| p.extension().and_then(|s| s.to_str()) == Some("epub"))
        .expect("no .epub produced");
    let xhtml: String = rheo_tests::helpers::comparison::extract_epub_xhtml(&epub_file)
        .expect("extract epub xhtml")
        .into_values()
        .collect();
    assert!(
        xhtml.contains("ctxtarget=epub"),
        "epub should expose rheo-context.target == epub:\n{xhtml}"
    );
    // Per-vertebra `rheo-context()` composes the same target from sys.inputs.
    assert!(
        xhtml.contains("pretarget=epub"),
        "epub prelude rheo-context.target must == epub:\n{xhtml}"
    );
    assert!(
        xhtml.contains("oldkey=absent"),
        "sys.inputs.rheo-target must be absent (oldkey=absent) in epub:\n{xhtml}"
    );
}

/// Test that a merged spine with a missing relative import produces a clear error
/// referencing the original source file path (not a temp path).
#[test]
fn test_merged_imports_missing_file() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();
    let content_dir = project_path.join("content");
    std::fs::create_dir_all(&content_dir).expect("Failed to create content dir");

    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"pdf\"]\n\
             \n\
             [pdf.spine]\n\
             title = \"Missing Import Test\"\n\
             vertebrae = [\"content/chapter.typ\"]\n\
             merge = true\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

    // chapter.typ imports a file that does not exist
    std::fs::write(
        content_dir.join("chapter.typ"),
        "#import \"../shared/nonexistent.typ\": *\n\n= Chapter\n\nContent.\n",
    )
    .expect("Failed to write chapter.typ");

    let build_dir = project_path.join("build");

    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--pdf",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        !output.status.success(),
        "Expected compilation to fail when import target is missing"
    );

    let stderr = String::from_utf8_lossy(&output.stderr);

    // The error should mention the source file name, not a temp/internal path
    assert!(
        stderr.contains("chapter.typ") || stderr.contains("nonexistent.typ"),
        "Expected error to reference source file, got:\n{}",
        stderr
    );
}

/// Error path: synthesized escape label collides with a user-authored label.
///
/// `content/a/file.typ` synthesizes escape `<a:file.typ>`. A second source
/// hand-authors the same label at markup level. rheo should error before
/// Typst compilation begins.
#[test]
fn test_escape_label_collision_error() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();
    let content_dir = project_path.join("content");
    let sub_dir = content_dir.join("a");
    std::fs::create_dir_all(&sub_dir).expect("Failed to create content/a");
    let build_dir = project_path.join("build");

    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             content_dir = \"content\"\n\
             \n\
             [html.spine]\n\
             title = \"Escape Collision Test\"\n\
             vertebrae = [\"root.typ\", \"a/file.typ\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

    // root.typ hand-authors <a:file.typ>, which is the escape alias rheo would
    // synthesize for content/a/file.typ.
    std::fs::write(
        content_dir.join("root.typ"),
        "= Root\n\nThis label conflicts with rheo's escape alias. <a:file.typ>\n",
    )
    .expect("Failed to write root.typ");

    std::fs::write(
        sub_dir.join("file.typ"),
        "= File\n\nContent in subdirectory.\n",
    )
    .expect("Failed to write a/file.typ");

    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        !output.status.success(),
        "Expected compilation to fail on escape label collision"
    );

    let combined = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        combined.contains("a:file.typ") && combined.contains("collides"),
        "Expected escape collision error, got:\n{}",
        combined
    );
}

/// Error path: a `[[spine.section]]` whose `include` glob matches no files
/// should fail the build, naming the offending section
/// (see reticulate/spine.rs SpineScan::build_section_nodes).
#[test]
fn test_spine_section_no_match_error() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path();
    let build_dir = project_path.join("build");

    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [[spine.section]]\n\
             name = \"ghost\"\n\
             include = [\"nope.typ\"]\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write rheo.toml");

    std::fs::write(project_path.join("intro.typ"), "= Intro\n\nContent.\n")
        .expect("Failed to write intro.typ");

    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        !output.status.success(),
        "Expected compilation to fail when a spine section's include matches no files"
    );

    let combined = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        combined.contains("ghost") && combined.contains("matched no files"),
        "Expected error naming the empty spine section, got:\n{}",
        combined
    );
}

/// `rheo migrate --apply` rewrites pre-0.4.0 cross-file link syntax
/// (`#link("./file.typ")`) to the handle form (`#link(<handle>)`), leaves
/// external URLs untouched, and bumps the project's `rheo.toml` version.
#[test]
fn migrate_rewrites_links() {
    let test_case = TestCase::new("cases/migrate_link_syntax");
    let original_project_path = test_case.project_path();

    // Migrate mutates the project in place, so operate on an isolated copy.
    let test_store = PathBuf::from("store").join("migrate_link_syntax");
    if test_store.exists() {
        std::fs::remove_dir_all(&test_store).expect("Failed to clean test store");
    }
    copy_project_to_test_store(original_project_path, &test_store)
        .expect("Failed to copy project to test store");

    let output = rheo_cli_command()
        .args(["migrate", test_store.to_str().unwrap(), "--apply"])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo migrate");
    assert!(
        output.status.success(),
        "migrate --apply failed:\nstderr: {}\nstdout: {}",
        String::from_utf8_lossy(&output.stderr),
        String::from_utf8_lossy(&output.stdout),
    );

    let a = std::fs::read_to_string(test_store.join("a.typ")).expect("read a.typ");
    let b = std::fs::read_to_string(test_store.join("b.typ")).expect("read b.typ");
    let toml = std::fs::read_to_string(test_store.join("rheo.toml")).expect("read rheo.toml");

    // Old path links rewritten to the canonical handle form.
    assert!(a.contains("#link(<b>)"), "a.typ link not rewritten:\n{a}");
    assert!(b.contains("#link(<a>)"), "b.typ link not rewritten:\n{b}");
    // External URL left untouched.
    assert!(
        a.contains("#link(\"https://example.com\")"),
        "external link should be untouched:\n{a}"
    );
    // Version bumped off the old 0.3.1 pin (target is the migrating binary's version).
    assert!(
        !toml.contains("0.3.1"),
        "rheo.toml version should have been bumped:\n{toml}"
    );
}

/// `rheo migrate --apply` rewrites the three removed-`rheo-target` reference
/// forms (rheo PR #150) onto the `rheo-context.target` surface, leaving no
/// residual `rheo-target` literal.
#[test]
fn migrate_rewrites_target() {
    let test_case = TestCase::new("cases/migrate_target_syntax");
    let original_project_path = test_case.project_path();

    // Migrate mutates the project in place, so operate on an isolated copy.
    let test_store = PathBuf::from("store").join("migrate_target_syntax");
    if test_store.exists() {
        std::fs::remove_dir_all(&test_store).expect("Failed to clean test store");
    }
    copy_project_to_test_store(original_project_path, &test_store)
        .expect("Failed to copy project to test store");

    let output = rheo_cli_command()
        .args(["migrate", test_store.to_str().unwrap(), "--apply"])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo migrate");
    assert!(
        output.status.success(),
        "migrate --apply failed:\nstderr: {}\nstdout: {}",
        String::from_utf8_lossy(&output.stderr),
        String::from_utf8_lossy(&output.stdout),
    );

    let page = std::fs::read_to_string(test_store.join("page.typ")).expect("read page.typ");

    // rheo-target()  ->  target()
    assert!(
        page.contains("#target()") && !page.contains("rheo-target()"),
        "rheo-target() call not rewritten to target():\n{page}"
    );
    // "rheo-target" in sys.inputs  ->  guarded rheo-context form
    assert!(
        page.contains("\"rheo-context\" in sys.inputs and \"target\" in sys.inputs.rheo-context"),
        "\"rheo-target\" in sys.inputs probe not rewritten:\n{page}"
    );
    // sys.inputs.rheo-target  ->  sys.inputs.rheo-context.target
    assert!(
        page.contains("sys.inputs.rheo-context.target"),
        "sys.inputs.rheo-target read not rewritten:\n{page}"
    );
    // No residual `rheo-target` literal anywhere.
    assert!(
        !page.contains("rheo-target"),
        "residual rheo-target literal remains:\n{page}"
    );
}

/// `rheo migrate --apply` converts a retired `vertebrae` inclusion-filter into
/// an equivalent `[spine] exclude`, so a helper-only `.typ` file that the old
/// glob list deliberately never named doesn't silently start getting published
/// as a spine page under the new directory-scan-by-default model (rheo-9vl.1 /
/// rheo-9vl.3).
#[test]
fn migrate_converts_vertebrae_to_exclude() {
    let test_case = TestCase::new("cases/migrate_vertebrae_exclude");
    let original_project_path = test_case.project_path();

    let test_store = PathBuf::from("store").join("migrate_vertebrae_exclude");
    if test_store.exists() {
        std::fs::remove_dir_all(&test_store).expect("Failed to clean test store");
    }
    copy_project_to_test_store(original_project_path, &test_store)
        .expect("Failed to copy project to test store");

    // Dry run first: must not write anything, but should mention the
    // vertebrae -> exclude conversion it would make.
    let dry_run_output = rheo_cli_command()
        .args(["migrate", test_store.to_str().unwrap()])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo migrate (dry run)");
    assert!(
        dry_run_output.status.success(),
        "migrate dry run failed:\nstderr: {}\nstdout: {}",
        String::from_utf8_lossy(&dry_run_output.stderr),
        String::from_utf8_lossy(&dry_run_output.stdout),
    );
    let dry_run_stdout = String::from_utf8_lossy(&dry_run_output.stdout);
    assert!(
        dry_run_stdout.contains("vertebrae") && dry_run_stdout.contains("exclude"),
        "dry run did not describe the vertebrae -> exclude conversion:\n{dry_run_stdout}"
    );
    let toml_before =
        std::fs::read_to_string(test_store.join("rheo.toml")).expect("read rheo.toml");
    assert!(
        toml_before.contains("vertebrae"),
        "dry run must not write; rheo.toml already missing vertebrae:\n{toml_before}"
    );

    let output = rheo_cli_command()
        .args(["migrate", test_store.to_str().unwrap(), "--apply"])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo migrate --apply");
    assert!(
        output.status.success(),
        "migrate --apply failed:\nstderr: {}\nstdout: {}",
        String::from_utf8_lossy(&output.stderr),
        String::from_utf8_lossy(&output.stdout),
    );

    let toml_after = std::fs::read_to_string(test_store.join("rheo.toml")).expect("read rheo.toml");
    assert!(
        !toml_after.contains("vertebrae"),
        "vertebrae key not removed by migration:\n{toml_after}"
    );
    assert!(
        toml_after.contains("exclude") && toml_after.contains("lib"),
        "no equivalent [spine] exclude for the lib/ helper added:\n{toml_after}"
    );
}

/// `rheo migrate` REPORTS (never rewrites) the removed `[html] feed_*`
/// rheo.toml keys and the removed `rheo-*` `.typ` variable bindings, since
/// feed configuration does not map one-to-one onto `@rheo/feeds`'s Typst
/// API.
#[test]
fn migrate_reports_removed_feed_surface() {
    let test_case = TestCase::new("cases/migrate_feed_removal");
    let original_project_path = test_case.project_path();

    let test_store = PathBuf::from("store").join("migrate_feed_removal");
    if test_store.exists() {
        std::fs::remove_dir_all(&test_store).expect("Failed to clean test store");
    }
    copy_project_to_test_store(original_project_path, &test_store)
        .expect("Failed to copy project to test store");

    let toml_before =
        std::fs::read_to_string(test_store.join("rheo.toml")).expect("read rheo.toml");
    let a_before = std::fs::read_to_string(test_store.join("a.typ")).expect("read a.typ");
    let b_before = std::fs::read_to_string(test_store.join("b.typ")).expect("read b.typ");

    // No --apply: this pass is report-only, so there is nothing to apply anyway.
    let output = rheo_cli_command()
        .args(["migrate", test_store.to_str().unwrap()])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo migrate");
    assert!(
        output.status.success(),
        "migrate failed:\nstderr: {}\nstdout: {}",
        String::from_utf8_lossy(&output.stderr),
        String::from_utf8_lossy(&output.stdout),
    );
    let stdout = String::from_utf8_lossy(&output.stdout);

    // All three retired [html] keys named.
    assert!(
        stdout.contains("feed_base_url"),
        "feed_base_url finding missing:\n{stdout}"
    );
    assert!(
        stdout.contains("feed_author"),
        "feed_author finding missing:\n{stdout}"
    );
    assert!(
        stdout.contains("feed_include"),
        "feed_include finding missing:\n{stdout}"
    );

    // Both removed `.typ` bindings named, each with its file:line location.
    assert!(
        stdout.contains("a.typ:1") && stdout.contains("rheo-feed-exclude"),
        "rheo-feed-exclude finding missing its location:\n{stdout}"
    );
    assert!(
        stdout.contains("b.typ:1") && stdout.contains("rheo-author"),
        "rheo-author finding missing its location:\n{stdout}"
    );

    // rheo-author is reported separately from the rheo-feed-* group, with
    // its own real-rewrite replacement, not a "moved to a package" pointer.
    let author_line = stdout
        .lines()
        .find(|l| l.contains("rheo-author"))
        .unwrap_or_else(|| panic!("no line reports rheo-author:\n{stdout}"));
    assert!(
        author_line.contains("#set document(author:"),
        "rheo-author finding should point at #set document(author:):\n{author_line}"
    );
    assert!(
        !author_line.contains("@rheo/feeds"),
        "rheo-author finding should not be grouped with the @rheo/feeds pointer:\n{author_line}"
    );

    // Every rheo-feed-*/feed_* finding points at the replacement package.
    assert!(
        stdout.contains("@rheo/feeds"),
        "no finding mentions @rheo/feeds:\n{stdout}"
    );

    // Report-only: both files are byte-identical after the run.
    let toml_after = std::fs::read_to_string(test_store.join("rheo.toml")).expect("read rheo.toml");
    let a_after = std::fs::read_to_string(test_store.join("a.typ")).expect("read a.typ");
    let b_after = std::fs::read_to_string(test_store.join("b.typ")).expect("read b.typ");
    assert_eq!(toml_before, toml_after, "rheo.toml must be untouched");
    assert_eq!(a_before, a_after, "a.typ must be untouched");
    assert_eq!(b_before, b_after, "b.typ must be untouched");
}

/// The built-in default stylesheet ships as a real linked `.css` asset (not an
/// inline `<style>` block), with a depth-relative `<link href>` on nested pages.
/// See rheo-u7i.
#[test]
fn test_default_css_is_linked_asset() {
    let project = "cases/default_css_linked";
    let build_dir = PathBuf::from("store").join("default_css_linked_build");
    let _ = std::fs::remove_dir_all(&build_dir);

    let output = rheo_cli_command()
        .args([
            "compile",
            project,
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");
    let combined = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(output.status.success(), "compile failed:\n{combined}");

    let html_dir = build_dir.join("html");

    // The default stylesheet is emitted as a real file, byte-identical to source.
    let css = html_dir.join("rheo-default.css");
    assert!(css.exists(), "expected default css at {}", css.display());
    let built = std::fs::read(&css).unwrap();
    let src = std::fs::read("../rheo/crates/html/src/templates/style.css")
        .expect("read source default stylesheet");
    assert_eq!(
        built, src,
        "default css must be byte-identical to the source"
    );

    // Root page links it (root depth, no `../`) and has NO inline default <style>.
    let index = std::fs::read_to_string(html_dir.join("index.html")).unwrap();
    assert!(
        index.contains(r#"<link rel="stylesheet" href="rheo-default.css""#),
        "root page must link the default css:\n{index}"
    );
    assert!(
        !index.contains("<style"),
        "default css must not be inlined as <style>:\n{index}"
    );

    // Nested page links it depth-relative.
    let nested = std::fs::read_to_string(html_dir.join("chapters/ch1.html")).unwrap();
    assert!(
        nested.contains(r#"href="../rheo-default.css""#),
        "nested page must link the default css depth-relative:\n{nested}"
    );

    let _ = std::fs::remove_dir_all(&build_dir);
}

/// The `--config <PATH>` flag points rheo at a `rheo.toml` that lives *outside*
/// the project root. The project directory here has NO `rheo.toml` of its own, so
/// a successful html build with the external config's asset override proves the
/// flag was honoured: the project root stays the compiled directory (assets
/// resolve relative to it) while settings come from the external file. See
/// rheo/crates/cli/src/lib.rs `--config` and ProjectConfig::from_path.
#[test]
fn test_external_config_flag() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path().join("project");
    let config_dir = dir.path().join("elsewhere");
    std::fs::create_dir_all(&project_path).expect("Failed to create project dir");
    std::fs::create_dir_all(&config_dir).expect("Failed to create config dir");

    // Project source + an asset the external config will reference. NOTE: the
    // project directory deliberately contains NO rheo.toml.
    std::fs::write(
        project_path.join("main.typ"),
        "= Hello\n\nExternal config.\n",
    )
    .expect("Failed to write main.typ");
    std::fs::write(project_path.join("custom.css"), "body { color: green; }")
        .expect("Failed to write custom.css");

    // rheo.toml lives outside the project root. It declares the html format and
    // an asset override that only exists here — if the build honours it, the flag
    // works. Asset paths resolve relative to the project root (custom.css above).
    let config_file = config_dir.join("external.toml");
    std::fs::write(
        &config_file,
        format!(
            "version = \"{}\"\n\
             formats = [\"html\"]\n\
             \n\
             [html.assets]\n\
             css_stylesheet = \"custom.css\"\n",
            manifest_version::CURRENT,
        ),
    )
    .expect("Failed to write external.toml");

    let build_dir = dir.path().join("build");
    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--config",
            config_file.to_str().unwrap(),
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation with external --config failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // The external config's asset override took effect: custom.css copied and linked.
    let copied_css = build_dir.join("html/custom.css");
    assert!(
        copied_css.exists(),
        "external config's css_stylesheet not applied: custom.css missing from html output"
    );
    assert_eq!(
        std::fs::read_to_string(&copied_css).unwrap(),
        "body { color: green; }",
        "Copied custom.css has wrong content"
    );

    let html = std::fs::read_to_string(build_dir.join("html/main.html"))
        .expect("Failed to read main.html");
    assert!(
        html.contains(r#"href="custom.css""#),
        "HTML should link the external config's custom.css:\n{html}"
    );
}

/// Hand-rolls an Atom feed from `content/.marrow.typ` using only the three
/// primitives a marrow can reach — `<rheo-content>` transclusion,
/// `rheo-metadata-all()`, and `sys.inputs.rheo-context.spine-flat` — proving
/// they suffice in place of the deleted Rust feed generator. Uses no `@rheo`
/// package, so the fixture never depends on the Typst package cache.
///
/// `docs/feed-parity.md` records how this feed differs from the one that
/// generator produced, since its own fixture and reference were deleted with
/// it.
#[test]
fn test_marrow_atom_feed() {
    let built = CompiledFixture::compile("cases/marrow_atom_feed", "marrow_atom_feed", &["--html"])
        .expect_success();

    let actual_feed = built.path("html/feed.xml");
    assert!(actual_feed.exists(), "feed.xml not generated");

    compare_or_update_text_asset(
        &PathBuf::from("ref/cases/marrow_atom_feed/feed.xml"),
        &actual_feed,
        "test_marrow_atom_feed",
    );
}

/// Marrow contributions: `content/.marrow.typ` is emitted at the Typst bundle
/// root, OUTSIDE every `#document` block rheo synthesizes, so its `document()`
/// and `asset()` calls mint extra output files. Marrow sits inside the spine
/// without being part of it: it is not a vertebra and must not produce
/// `.marrow.html`. A bespoke test rather than a `#[test_case]` because this
/// asserts on a non-HTML asset, on a file that must NOT exist, and on a second
/// format run — none of which `verify_html_output` can do. Regenerate the
/// reference with `UPDATE_REFERENCES=1`.
#[test]
fn test_marrow() {
    let built = CompiledFixture::compile("cases/marrow", "marrow", &["--html"]).expect_success();

    // The marrow `document()` mints a page outside the spine.
    let actual_page = built.path("html/extra/hello.html");
    assert!(
        actual_page.exists(),
        "marrow document() did not emit extra/hello.html"
    );

    // The marrow `asset()` lands verbatim, not routed through the HTML plugin.
    let actual_asset = built.path("html/extra/hello.txt");
    assert!(
        actual_asset.exists(),
        "marrow asset() did not emit extra/hello.txt"
    );
    let asset_bytes = std::fs::read(&actual_asset).expect("read hello.txt");
    assert_eq!(
        asset_bytes, b"root-level asset",
        "marrow asset bytes differ"
    );

    // `.marrow.typ` is a contribution, not a vertebra: it gets no page of its own.
    assert!(
        !built.path("html/.marrow.html").exists(),
        ".marrow.typ was compiled as an ordinary vertebra"
    );

    compare_or_update_text_asset(
        &PathBuf::from("ref/cases/marrow/extra/hello.html"),
        &actual_page,
        "test_marrow",
    );

    // The marrow is skipped for the combined PDF target: the build still
    // succeeds and no extra PDF appears.
    let pdf_output = built.recompile(&["--pdf"]);
    assert!(
        pdf_output.status.success(),
        "pdf compile failed: {}",
        String::from_utf8_lossy(&pdf_output.stderr)
    );
    let pdfs: Vec<PathBuf> = std::fs::read_dir(built.path("pdf"))
        .expect("read build/pdf")
        .filter_map(|e| e.ok().map(|e| e.path()))
        .filter(|p| p.extension().is_some_and(|x| x == "pdf"))
        .collect();
    assert_eq!(pdfs.len(), 1, "expected exactly one PDF, got {pdfs:?}");
}

/// `rheo-metadata(handle)` and `rheo-metadata-all()` are both reachable from
/// marrow scope — the synthesized bundle root where `.marrow.typ` is inlined,
/// outside every `#document` block. The fixture calls both while building a
/// `meta.txt` asset, which this content-compares.
///
/// Both calls are wrapped in `#context`, which every `query()`-backed helper
/// requires, and the fixture uses `repr(m.title)` rather than `str(m.title)`:
/// `document.title` is content, and Typst's `str()` rejects content outright.
#[test]
fn test_marrow_metadata() {
    let built = CompiledFixture::compile("cases/marrow_metadata", "marrow_metadata", &["--html"])
        .expect_success();

    let actual_asset = built.path("html/meta.txt");
    assert!(actual_asset.exists(), "meta.txt not generated");

    compare_or_update_text_asset(
        &PathBuf::from("ref/cases/marrow_metadata/meta.txt"),
        &actual_asset,
        "test_marrow_metadata",
    );
}

/// A page minted at the bundle root via `rheo-document()` must get the same
/// per-document init a spine vertebra gets for free from `rheo-page-init`:
/// `state("rheo-handle")` set to its own handle (not the last spine page's),
/// and the footnote counter reset to 0 for per-page formats. Bespoke rather
/// than `#[test_case]` because it asserts on substrings of the rendered HTML,
/// which the generic snapshot-diff runner does not do.
#[test]
fn test_marrow_page_init() {
    let built = CompiledFixture::compile("cases/marrow_page_init", "marrow_page_init", &["--html"])
        .expect_success();

    assert!(
        built.path("html/extra/x.html").exists(),
        "rheo-document() did not emit extra/x.html"
    );
    let page_html = built.read("html/extra/x.html");

    // state("rheo-handle") must read this page's own handle, not index's.
    assert!(
        page_html.contains("Handle seen here: extra:x"),
        "marrow page did not see its own handle via state(\"rheo-handle\"):\n{page_html}"
    );

    // The footnote counter must reset to 0 for this page, not continue from
    // index's two footnotes. `loc-N` ids are global bundle-wide location
    // counters and incidental; only the visible noteref number matters.
    fn first_footnote_number(html: &str) -> Option<String> {
        let marker = "role=\"doc-noteref\">";
        let start = html.find(marker)? + marker.len();
        let after_a_open = html[start..].find('>')? + start + 1;
        let end = html[after_a_open..].find('<')? + after_a_open;
        Some(html[after_a_open..end].to_string())
    }
    assert_eq!(
        first_footnote_number(&page_html).as_deref(),
        Some("1"),
        "marrow page footnote was not reset to 1:\n{page_html}"
    );
}

/// A marrow-contributed page stays in the EPUB container (manifest + physical
/// XHTML file) but must not enter the reading order (package.opf spine) or the
/// nav.xhtml table of contents, since it is not a vertebra. Bespoke rather than
/// `#[test_case]` because it opens the EPUB zip directly.
#[test]
fn test_marrow_excluded_from_epub_reading_order() {
    use rheo_tests::helpers::comparison::{extract_epub_metadata, extract_epub_xhtml};

    let built = CompiledFixture::compile(
        "cases/marrow_epub_reading_order",
        "marrow_epub_reading_order",
        &["--epub"],
    )
    .expect_success();

    let epub_path = &sole_epub(&built);

    let metadata = extract_epub_metadata(epub_path).expect("extract EPUB metadata");
    assert!(
        !metadata
            .spine_files
            .contains(&"extra/hello.xhtml".to_string()),
        "marrow page entered the EPUB reading order: {:?}",
        metadata.spine_files
    );
    assert!(
        metadata.spine_files.iter().any(|f| f == "index.xhtml"),
        "index vertebra missing from EPUB reading order: {:?}",
        metadata.spine_files
    );

    let xhtml_files = extract_epub_xhtml(epub_path).expect("extract EPUB xhtml files");
    assert!(
        xhtml_files.contains_key("extra/hello.xhtml"),
        "marrow page was dropped from the EPUB container entirely, not just the reading order: {:?}",
        xhtml_files.keys().collect::<Vec<_>>()
    );

    let nav_xhtml = {
        use std::io::Read;
        let file = std::fs::File::open(epub_path).expect("open epub");
        let mut archive = zip::ZipArchive::new(file).expect("read epub archive");
        let mut nav_file = archive
            .by_name("EPUB/nav.xhtml")
            .expect("find EPUB/nav.xhtml");
        let mut contents = String::new();
        nav_file
            .read_to_string(&mut contents)
            .expect("read nav.xhtml");
        contents
    };
    assert!(
        !nav_xhtml.contains("href=\"extra/hello.xhtml\""),
        "marrow page got a top-level nav entry:\n{nav_xhtml}"
    );
}

/// A marrow-emitted `asset()` must be embedded IN the EPUB container (manifest
/// item + physical bytes in the zip), not written as a loose file beside the
/// .epub the way it is for HTML. Bespoke rather than `#[test_case]` because it
/// opens the EPUB zip and parses package.opf directly.
#[test]
fn test_marrow_asset_embedded_in_epub() {
    use rheo_epub::package::Package;
    use std::io::Read;

    let built =
        CompiledFixture::compile("cases/marrow_epub_asset", "marrow_epub_asset", &["--epub"])
            .expect_success();

    assert!(
        !built.path("epub/extra/hello.txt").exists(),
        "marrow asset was written as a loose file next to the EPUB; it should be embedded in the container instead"
    );

    let epub_path = &sole_epub(&built);

    let file = std::fs::File::open(epub_path).expect("open epub");
    let mut archive = zip::ZipArchive::new(file).expect("read epub archive");

    let asset_bytes = {
        let mut asset_file = archive
            .by_name("EPUB/extra/hello.txt")
            .expect("find EPUB/extra/hello.txt in container");
        let mut bytes = Vec::new();
        asset_file
            .read_to_end(&mut bytes)
            .expect("read asset bytes");
        bytes
    };
    assert_eq!(
        asset_bytes, b"root-level asset",
        "marrow asset bytes differ inside the EPUB container"
    );

    let opf_contents = {
        let mut opf_file = archive
            .by_name("EPUB/package.opf")
            .expect("find EPUB/package.opf");
        let mut contents = String::new();
        opf_file
            .read_to_string(&mut contents)
            .expect("read package.opf");
        contents
    };
    let package: Package = serde_xml_rs::from_str(&opf_contents).expect("parse package.opf");

    let asset_item = package
        .manifest
        .items
        .iter()
        .find(|item| item.href.to_string() == "extra/hello.txt")
        .unwrap_or_else(|| {
            panic!(
                "no manifest item for extra/hello.txt: {:?}",
                package.manifest.items
            )
        });
    assert_eq!(
        asset_item.media_type, "text/plain",
        "wrong media-type for extra/hello.txt: {:?}",
        asset_item
    );

    assert!(
        !package
            .spine
            .itemref
            .iter()
            .any(|itemref| itemref.idref == asset_item.id),
        "marrow asset entered the EPUB reading order"
    );
}

/// `--emit-bundle-source` writes the synthesized Typst bundle main to
/// `<build_dir>/<plugin>/.rheo-bundle.typ` — a read-only debug artifact for
/// diagnosing marrow/spine authoring errors. Off by default, and must not
/// change compiled output. Bespoke rather than `#[test_case]` because it
/// compiles the same store twice to compare flag-on/flag-off output. See rheo
/// bead rheo-4n3.
#[test]
fn test_emit_bundle_source_flag() {
    // Step 1: no flag — no debug artifact, capture baseline output.
    let built = CompiledFixture::compile(
        "cases/emit_bundle_source",
        "emit_bundle_source",
        &["--html"],
    )
    .expect_success();
    let debug_path = built.path("html/.rheo-bundle.typ");
    assert!(
        !debug_path.exists(),
        "bundle debug source written without --emit-bundle-source"
    );
    let baseline_index = built.read("html/index.html");

    // Step 2: with flag — debug artifact appears, output unchanged.
    let flagged = built.recompile(&["--html", "--emit-bundle-source"]);
    assert!(
        flagged.status.success(),
        "compile --emit-bundle-source failed: {}",
        String::from_utf8_lossy(&flagged.stderr)
    );

    let bundle_source = std::fs::read_to_string(&debug_path).expect("read .rheo-bundle.typ");
    assert!(
        bundle_source.contains("#document("),
        "bundle debug source missing #document( block:\n{bundle_source}"
    );
    assert!(
        bundle_source.contains("Marrow body marker."),
        "bundle debug source missing inlined marrow body:\n{bundle_source}"
    );

    assert_eq!(
        baseline_index,
        built.read("html/index.html"),
        "--emit-bundle-source changed compiled output"
    );
}

/// Marrow is read only from the top level of the content directory. A
/// same-named file deeper in the tree becomes an ordinary vertebra — its
/// leading dot sanitized into a page called `_marrow` — which looks like marrow
/// that silently did nothing, so rheo warns and names the file.
#[test]
fn test_nested_marrow_file_warns() {
    let project = TempProject::new(&["html"])
        .config("content_dir = \"content\"\n")
        .file("content/alpha.typ", "= Alpha\n")
        .file("content/sub/.marrow.typ", "Nested marrow-named file.\n");
    let build_dir = project.build_dir();
    let output = project.compile(&["--html"]);
    assert!(
        output.status.success(),
        "compile failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    let logs = String::from_utf8_lossy(&output.stderr);
    assert!(
        logs.contains("marrow is only read from the top level"),
        "expected a warning about the nested marrow file:\n{logs}"
    );
    assert!(
        logs.contains("sub/.marrow.typ"),
        "the warning must name the offending file:\n{logs}"
    );

    // It really is compiled as an ordinary page, not silently dropped.
    assert!(
        build_dir.join("html/sub/_marrow.html").exists(),
        "the nested file should still build as a vertebra"
    );
}

/// CSS/JS that enters rheo through a package (auto-detected from the package's
/// manifest) must also get depth-relative `<link>`/`<script>` hrefs on nested
/// pages, exactly like user and default assets. Network: downloads/caches
/// `@rheo/slides:0.1.0` (same as `rheo_package_slides`). See rheo-u7i.
#[test]
fn test_package_assets_depth_relative_on_nested_pages() {
    let project = "cases/package_asset_nested";
    let build_dir = PathBuf::from("store").join("package_asset_nested_build");
    let _ = std::fs::remove_dir_all(&build_dir);

    let output = rheo_cli_command()
        .args([
            "compile",
            project,
            "--html",
            "--build-dir",
            build_dir.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");
    let combined = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(output.status.success(), "compile failed:\n{combined}");

    let html_dir = build_dir.join("html");

    // Root page links the package assets at depth 0 (no `../`).
    let index = std::fs::read_to_string(html_dir.join("index.html")).unwrap();
    assert!(
        index.contains(r#"href="rheo/slides/index.css""#),
        "root page must link package css:\n{index}"
    );
    assert!(
        index.contains(r#"src="rheo/slides/lib.js""#),
        "root page must link package js:\n{index}"
    );

    // Nested page links the same package assets depth-relative.
    let nested = std::fs::read_to_string(html_dir.join("chapters/deep.html")).unwrap();
    assert!(
        nested.contains(r#"href="../rheo/slides/index.css""#),
        "nested page must link package css depth-relative:\n{nested}"
    );
    assert!(
        nested.contains(r#"src="../rheo/slides/lib.js""#),
        "nested page must link package js depth-relative:\n{nested}"
    );

    let _ = std::fs::remove_dir_all(&build_dir);
}

/// `content/.marrow.typ` mints `transcluded.xml` containing four
/// `<rheo-content page="..." select="..." as="escaped|raw"/>` placeholders
/// against two compiled pages:
///
/// - `wrapped.html` wraps its article in `<main>`, with distinct chrome text
///   (`WRAPPEDCHROME`) in a `<nav>`/`<footer>` outside it, so scoping to
///   `<main>` must exclude the chrome.
/// - `plain.html` has neither a `<main>` nor a `.rheo-content` element,
///   so its content region falls through to the whole `<body>` (which does
///   include a copy of the `WRAPPEDCHROME` text, as ordinary body prose this
///   time, proving the two pages' entries are exclusive: chrome text should
///   appear ONLY in the `plain.html`-sourced entry).
///
/// The reference encodes the substituted output, so a regression that left a
/// placeholder verbatim in the asset would fail here. Regenerate it with
/// `UPDATE_REFERENCES=1`.
#[test]
fn test_transclude_content() {
    let built = CompiledFixture::compile(
        "cases/transclude_content",
        "transclude_content",
        &["--html"],
    )
    .expect_success();

    let actual_asset = built.path("html/transcluded.xml");
    assert!(actual_asset.exists(), "transcluded.xml not generated");

    compare_or_update_text_asset(
        &PathBuf::from("ref/cases/transclude_content/transcluded.xml"),
        &actual_asset,
        "test_transclude_content",
    );
}

/// Error path for `<rheo-content>` transclusion: a placeholder naming a `page`
/// that has no matching compiled output must be a HARD compile error naming
/// the missing page, not a silently-emitted blank substitution.
#[test]
fn test_transclude_content_missing_page_error() {
    let project = TempProject::new(&["html"])
        .file("index.typ", "= Index\n\nContent.\n")
        // References a page that will never exist in this project's output.
        .file(
            ".marrow.typ",
            "#asset(\"bad.xml\", \"<rheo-content page=\\\"nope.html\\\"/>\")\n",
        );
    let output = project.compile(&["--html"]);

    let combined = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );

    assert!(
        !output.status.success(),
        "Expected compilation to fail when a <rheo-content> placeholder names \
         an unresolvable page, but it succeeded:\n{combined}"
    );
    assert!(
        combined.contains("nope.html"),
        "Expected error output to name the missing page 'nope.html', got:\n{combined}"
    );
}

/// `.rheo/` is the reserved bundle-output prefix for control assets that rheo
/// consumes internally and NEVER writes to the actual build output.
/// `cases/head_control` mints a
/// `.rheo/head.html` control asset alongside an ordinary `extra/hello.txt`
/// asset via `content/.marrow.typ`. This asserts on the OUTPUT TREE directly
/// (not just page contents, which `run_test_case`'s snapshot diff already
/// covers) because a stray `.rheo/head.html` left on disk is exactly the kind
/// of regression a content-only diff can't catch: the reserved prefix must be
/// stripped from the build output while ordinary assets are unaffected.
///
/// HTML only: `cases/head_control` declares `formats = ["html"]`, and a
/// second EPUB-enabled fixture would be unrelated scaffolding for one absence
/// check.
#[test]
fn test_head_control_excludes_reserved_prefix() {
    let built = CompiledFixture::compile("cases/head_control", "head_control_tree", &["--html"])
        .expect_success();

    // The reserved control-asset prefix must never appear in the build output,
    // neither as a directory nor as the `head.html` file inside it.
    assert!(
        !built.path("html/.rheo").exists(),
        "build/html/.rheo/ should not exist, but it does: {} is a control-asset \
         prefix that rheo must consume internally, never write to output",
        built.path("html/.rheo").display()
    );
    assert!(
        !built.path("html/.rheo/head.html").exists(),
        "build/html/.rheo/head.html should not exist on disk"
    );

    // Ordinary assets alongside the control asset are unaffected.
    assert!(
        built.path("html/extra/hello.txt").exists(),
        "build/html/extra/hello.txt should exist (ordinary asset, unrelated to \
         the reserved .rheo/ prefix)"
    );
    assert_eq!(
        built.read("html/extra/hello.txt"),
        "hi",
        "extra/hello.txt should contain its minted content verbatim"
    );
}

/// An UNRECOGNISED control asset under `.rheo/` (i.e. one rheo doesn't know
/// how to consume, unlike `.rheo/head.html`) must still be excluded from the
/// build output, and the compile must still succeed rather than hard-error:
/// rheo warns instead, so a newer package against an older rheo degrades
/// gracefully. Built inline rather than as a checked-in fixture, since this is
/// a single arbitrary asset name.
#[test]
fn test_head_control_unrecognized_asset_excluded_and_warns() {
    let project = TempProject::new(&["html"])
        .file("index.typ", "= Index\n\nContent.\n")
        // An unrecognised control-asset name under the reserved `.rheo/` prefix.
        .file(
            ".marrow.typ",
            "#asset(\".rheo/future-thing.json\", \"{\\\"arbitrary\\\": true}\")\n",
        );
    let build_dir = project.build_dir();
    let output = project.compile(&["--html"]);

    // An unrecognised control asset must not hard-fail the build.
    assert!(
        output.status.success(),
        "compile should succeed even for an unrecognized .rheo/* control asset: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    assert!(
        !build_dir.join("html/.rheo/future-thing.json").exists(),
        "build/html/.rheo/future-thing.json should not exist on disk, even for \
         an unrecognized control asset name"
    );

    // A tracing `WARN` line prints that short tag rather than the spelled-out
    // "warning" of the codespan-reporting diagnostics `test_warning_formatting`
    // checks, so this asserts on the message content instead.
    let logs = String::from_utf8_lossy(&output.stderr);
    assert!(
        logs.contains("WARN") && logs.contains("unrecognized control asset"),
        "Expected a warning about the unrecognized .rheo/future-thing.json \
         control asset, got:\n{logs}"
    );
}

/// A vertebra reads another vertebra's metadata via
/// `(rheo-context().metadata-of)("chapters:b")`, and gets that vertebra's real
/// resolved title rather than its own or a path-derived guess.
#[test]
fn test_metadata_of_cross_vertebra_query() {
    let built = CompiledFixture::compile(
        "cases/metadata_cross_vertebra_query",
        "metadata_cross_vertebra_query",
        &["--html"],
    )
    .expect_success();

    let a_html = built.read("html/a.html");
    assert!(
        a_html.contains("B Title"),
        "expected a.html to contain chapters:b's title (\"B Title\") read via \
         metadata-of, got:\n{a_html}"
    );
}

/// A vertebra with no `#set document(...)` at all falls back to its
/// path-derived title, with no leakage from a sibling's, and `metadata-of`
/// returns an empty dict for it — mirroring spine-flat's own empty-dict
/// convention.
///
/// The assertions live inline in the fixture's `check.typ` (assert-only, so it
/// renders nothing), which is why this test only checks that the build
/// succeeded: a failed assert panics the Typst compile.
#[test]
fn test_metadata_no_document_no_leakage() {
    let built = CompiledFixture::compile(
        "cases/metadata_no_document_no_leakage",
        "metadata_no_document_no_leakage",
        &["--html"],
    );
    assert!(
        built.output().status.success(),
        "compile failed (check.typ's inline asserts panic Typst compilation on failure): {}",
        built.stderr()
    );
}

/// A combined `--pdf` build (the default `SingleCombined` layout) calling
/// `metadata-of` for its own handle must not error. Beacons are emitted only
/// for `OnePerVertebra` layouts, since under one shared `#document` a beacon
/// would report the preceding vertebra's `set document(...)` state, so
/// `metadata-of` returns an empty dict here instead.
///
/// The empty-dict gating itself is unit-tested in `../rheo/crates/core`; this
/// case's job is only to prove the combined-PDF build does not fall over.
#[test]
fn test_metadata_of_combined_pdf_no_crash() {
    let built = CompiledFixture::compile(
        "cases/metadata_combined_pdf_metadata_of",
        "metadata_combined_pdf_metadata_of",
        &["--pdf"],
    )
    .expect_success();

    let pdf_files: Vec<_> = std::fs::read_dir(built.path("pdf"))
        .expect("read build/pdf dir")
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().is_some_and(|ext| ext == "pdf"))
        .collect();
    assert!(
        !pdf_files.is_empty(),
        "expected a combined PDF to be written to build/pdf/"
    );
}

/// `cases/metadata_two_pass_bounded_title/bounded.typ` sets its title inside
/// a bounded `#{ }` code block — correct for its own compiled `<title>`
/// (unscoped `DocumentInfo`), but invisible to the ordinary single-pass
/// metadata beacon's `#context` read (`docs/limitations.md`,
/// `cases/metadata_show_and_code_block/`). `--metadata-two-pass` opts into a
/// gated second compile pass that resolves it from Rust's already-correct
/// `DocumentInfo` instead. Without the flag, `index.typ`'s `@bounded` anchor
/// and `metadata-of("bounded").title` must still show the path-derived
/// fallback ("Bounded"); with it, both must show the real "Two Pass Title".
#[test]
fn test_metadata_two_pass_resolves_bounded_code_block_title() {
    let built = CompiledFixture::compile(
        "cases/metadata_two_pass_bounded_title",
        "metadata_two_pass_bounded_title",
        &["--html", "--metadata-two-pass"],
    )
    .expect_success();

    let index_html = built.read("html/index.html");
    assert!(
        index_html.contains("Two Pass Title"),
        "expected index.html to show bounded.typ's real title (\"Two Pass \
         Title\"), resolved via --metadata-two-pass through both the \
         @bounded handle anchor and metadata-of, got:\n{index_html}"
    );
    assert!(
        !index_html.contains(">Bounded<"),
        "expected the @bounded handle anchor to show the real title, not \
         the path-derived fallback (\"Bounded\"), got:\n{index_html}"
    );
}

/// EPUB's `<dc:creator>` comes from Typst's own `#set document(author: ...)`,
/// read off the resolved `DocumentInfo` — not from an HTML `<meta
/// name="author">` scrape, and not from the removed `rheo-author` variable.
/// The fixture sets only the Typst document author.
///
/// Bespoke rather than `#[test_case]` because it opens the EPUB zip and reads
/// `package.opf` for a field `EpubMetadata` does not model.
#[test]
fn test_epub_author_from_typst_document_author() {
    use rheo_tests::helpers::comparison::extract_epub_creator;

    let built = CompiledFixture::compile(
        "cases/epub_author_metadata",
        "epub_author_metadata",
        &["--epub"],
    )
    .expect_success();

    let creator = extract_epub_creator(&sole_epub(&built)).expect("extract EPUB dc:creator");
    assert_eq!(
        creator.as_deref(),
        Some("Ada Lovelace"),
        "expected dc:creator to reflect Typst's #set document(author:), got {creator:?}"
    );
}

/// A vertebra with no author anywhere (no `#set document(author:)`, no
/// `rheo-author`) must still build successfully — a missing author is never
/// a hard error, only ever an absent/empty `dc:creator`. Bespoke for the same
/// reason as `test_epub_author_from_typst_document_author` above, and kept as
/// its own fixture/test since author extraction only ever looks at the
/// *first* vertebra's output, so it cannot share a fixture with the
/// has-a-Typst-author case above.
#[test]
fn test_epub_author_absent_build_succeeds() {
    let built = CompiledFixture::compile(
        "cases/epub_author_metadata_absent",
        "epub_author_metadata_absent",
        &["--epub"],
    );
    assert!(
        built.output().status.success(),
        "expected EPUB build with no author at all to succeed, but it failed: {}",
        built.stderr()
    );
}

/// `--font-dir` is `ArgAction::Append` and, per `resolve_font_dirs`, is added
/// on top of whatever the autoscan/config branch already produced. This project
/// has no `font_dirs` in rheo.toml, so `fonts/` autoscans and two repeated
/// flags bring the total to 3.
///
/// No real font file is needed: `resolve_font_dirs` only checks that a
/// directory exists, and the merged count is observable from the CLI's own
/// `loading fonts from N additional directories` line — so this asserts
/// resolution rather than shipping a binary font into the repo.
/// `cases/font_dirs_disables_autoscan` pins the config side.
#[test]
fn test_font_dir_cli_flag_appends_and_repeats() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path().join("project");
    let fonts_dir = project_path.join("fonts"); // autoscan candidate
    let extra_a = dir.path().join("extra_fonts_a");
    let extra_b = dir.path().join("extra_fonts_b");
    std::fs::create_dir_all(&fonts_dir).expect("Failed to create fonts dir");
    std::fs::create_dir_all(&extra_a).expect("Failed to create extra_a dir");
    std::fs::create_dir_all(&extra_b).expect("Failed to create extra_b dir");

    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT
        ),
    )
    .expect("Failed to write rheo.toml");
    std::fs::write(
        project_path.join("main.typ"),
        "= Hello\n\n--font-dir probe.\n",
    )
    .expect("Failed to write main.typ");

    let build_dir = dir.path().join("build");
    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--build-dir",
            build_dir.to_str().unwrap(),
            "--html",
            "--font-dir",
            extra_a.to_str().unwrap(),
            "--font-dir",
            extra_b.to_str().unwrap(),
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        output.status.success(),
        "Compilation with --font-dir failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    let combined = format!(
        "{}{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
    assert!(
        combined.contains("loading fonts from 3 additional directories"),
        "expected autoscanned fonts/ + 2 repeated --font-dir flags = 3 dirs, got:\n{combined}"
    );
    assert!(
        combined.contains(fonts_dir.to_str().unwrap()),
        "autoscanned fonts/ dir should still be listed:\n{combined}"
    );
    assert!(
        combined.contains(extra_a.to_str().unwrap())
            && combined.contains(extra_b.to_str().unwrap()),
        "both repeated --font-dir values should be listed:\n{combined}"
    );
}

/// `--open` needs no end-to-end test of its own, for two reasons pinned here:
///
/// 1. The flag only exists on `watch` -- `build_compile_command` in
///    ../rheo/crates/cli/src/lib.rs registers no "open" Arg at all, only
///    `build_watch_command` does. `compile --open` is a clap parse error
///    (asserted below), so the doc audit's premise of testing it via
///    `compile` doesn't even apply.
/// 2. On `watch`, `--open` is already exercised end-to-end by every
///    `DevServer`-based test: `src/helpers/devserver.rs`'s `DevServer::start`
///    unconditionally passes `.arg("--open")` to every `rheo watch` it
///    spawns (see tests/watch.rs's `dev_server_serves_and_rebuilds_on_change`),
///    and starting the HTML dev server at all only happens through the
///    `--open` code path (`run_watch`'s `if open { ... plugin.open() ... }`).
///    A failed best-effort browser-open (no GUI in CI) is caught and
///    warned, never propagated (../rheo/crates/html/src/lib.rs), so that
///    path is already headless-safe. A dedicated `--open` test would just
///    re-spawn another slow watch subprocess to duplicate coverage that
///    already exists.
///
/// So this is a deliberate, documented non-duplication -- the only actual
/// gap was the compile/watch split itself, which this test pins.
#[test]
fn test_open_flag_only_exists_on_watch_not_compile() {
    let dir = tempfile::tempdir().expect("Failed to create temp dir");
    let project_path = dir.path().join("project");
    std::fs::create_dir_all(&project_path).expect("Failed to create project dir");
    std::fs::write(
        project_path.join("rheo.toml"),
        format!(
            "version = \"{}\"\nformats = [\"html\"]\n",
            manifest_version::CURRENT
        ),
    )
    .expect("Failed to write rheo.toml");
    std::fs::write(project_path.join("main.typ"), "= Hello\n").expect("Failed to write main.typ");

    let build_dir = dir.path().join("build");
    let output = rheo_cli_command()
        .args([
            "compile",
            project_path.to_str().unwrap(),
            "--build-dir",
            build_dir.to_str().unwrap(),
            "--html",
            "--open",
        ])
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("Failed to run rheo compile");

    assert!(
        !output.status.success(),
        "expected `compile --open` to be rejected by clap (the flag is watch-only), but it succeeded"
    );
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("--open"),
        "expected clap's error to name the unrecognized --open flag, got:\n{stderr}"
    );
}
