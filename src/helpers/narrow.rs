//! Shared helpers for narrowed-rebuild tests (`tests/watch_narrow.rs`): a
//! fresh full compile to diff a watch session's disk output against, and a
//! recursive tree-equality assertion with a readable failure.

use super::cli::rheo_cli_command;
use super::test_store::copy_project_to_test_store;
use similar::TextDiff;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

/// Copies `project` into a fresh tempdir and runs `rheo compile --html`
/// against the copy. The returned `TempDir` holds a `build/html/` to compare
/// a watch session's own disk output against.
pub fn fresh_compile_html(project: &Path) -> tempfile::TempDir {
    let dir = tempfile::tempdir().expect("tempdir");
    copy_project_to_test_store(project, dir.path()).expect("copy project for fresh compile");

    let output = rheo_cli_command()
        .arg("compile")
        .arg(dir.path())
        .arg("--html")
        .env("TYPST_IGNORE_SYSTEM_FONTS", "1")
        .output()
        .expect("run rheo compile");
    assert!(
        output.status.success(),
        "fresh compile of {} failed: {}",
        project.display(),
        String::from_utf8_lossy(&output.stderr)
    );

    dir
}

/// Asserts two directory trees hold the same set of relative paths and that
/// every file's bytes match, modulo each tree's own tempdir path embedded in
/// its output (normalised to a placeholder before comparing, since the two
/// trees necessarily live at different tempdir paths).
pub fn assert_html_trees_equal(actual: &Path, expected: &Path) {
    let actual_paths = relative_file_paths(actual);
    let expected_paths = relative_file_paths(expected);
    assert_eq!(
        actual_paths,
        expected_paths,
        "{} and {} do not hold the same set of files",
        actual.display(),
        expected.display()
    );

    for rel in &actual_paths {
        let actual_bytes = fs::read(actual.join(rel))
            .unwrap_or_else(|e| panic!("read {}: {e}", actual.join(rel).display()));
        let expected_bytes = fs::read(expected.join(rel))
            .unwrap_or_else(|e| panic!("read {}: {e}", expected.join(rel).display()));

        let actual_text = normalize_tempdir_path(&String::from_utf8_lossy(&actual_bytes), actual);
        let expected_text =
            normalize_tempdir_path(&String::from_utf8_lossy(&expected_bytes), expected);

        if actual_text != expected_text {
            let diff = TextDiff::from_lines(&expected_text, &actual_text)
                .unified_diff()
                .header("expected", "actual")
                .to_string();
            panic!(
                "{rel} differs between a watch session's disk output and a fresh compile:\n{diff}"
            );
        }
    }
}

/// Every relative file path under `root`, sorted for a stable comparison.
fn relative_file_paths(root: &Path) -> Vec<String> {
    let mut paths: Vec<String> = WalkDir::new(root)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|e| e.file_type().is_file())
        .map(|e| {
            e.path()
                .strip_prefix(root)
                .expect("walked entry under root")
                .to_string_lossy()
                .into_owned()
        })
        .collect();
    paths.sort();
    paths
}

/// Replaces every occurrence of `tree`'s own absolute path with a fixed
/// placeholder, so two trees living at different tempdir paths can still
/// compare equal when their only difference is that embedded path.
fn normalize_tempdir_path(text: &str, tree: &Path) -> String {
    text.replace(&*tree.to_string_lossy(), "<TEMPDIR>")
}
