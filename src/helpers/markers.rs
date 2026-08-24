/// Test marker parser for .typ files
///
/// Parses comment-based test markers that declare files as test cases
/// and provide metadata for test execution.
///
/// Marker syntax:
/// ```typst
/// // @rheo:test
/// // @rheo:formats html,pdf
/// // @rheo:description Tests blog post rendering with footnotes
/// ```
use std::path::Path;

/// Metadata extracted from test markers in .typ files
#[derive(Debug, Clone, PartialEq)]
pub struct TestMetadata {
    /// Output formats to test (html, pdf, epub)
    pub formats: Vec<String>,
    /// Human-readable description of the test
    pub description: Option<String>,
    /// Expected compilation outcome ("error" or "success", None defaults to success)
    pub expect: Option<String>,
    /// Required error patterns to check in stderr (for error cases)
    pub error_patterns: Vec<String>,
    /// Required warning patterns to check (stdout+stderr) on a successful build
    pub warn_patterns: Vec<String>,
    /// Keep this case's `rheo.toml` `version` verbatim instead of the harness's
    /// usual patch to the current crate version (to exercise a stale version)
    pub keep_version: bool,
}

impl Default for TestMetadata {
    fn default() -> Self {
        Self {
            formats: vec!["html".to_string(), "pdf".to_string()],
            description: None,
            expect: None,
            error_patterns: vec![],
            warn_patterns: vec![],
            keep_version: false,
        }
    }
}

/// Splits a comma-separated list, dropping empty entries:
/// `html, pdf` -> `["html", "pdf"]`.
fn parse_list(s: &str) -> Vec<String> {
    s.split(',')
        .map(str::trim)
        .filter(|p| !p.is_empty())
        .map(str::to_string)
        .collect()
}

/// [`parse_list`], additionally stripping the surrounding quotes each entry
/// carries: `"a", "b c"` -> `["a", "b c"]`.
fn parse_quoted_list(s: &str) -> Vec<String> {
    parse_list(s)
        .iter()
        .map(|p| p.trim_matches('"').to_string())
        .collect()
}

/// Checks if a line contains the @rheo:test marker
pub fn is_test_marker(line: &str) -> bool {
    let trimmed = line.trim();
    trimmed.starts_with("//") && trimmed.contains("@rheo:test")
}

/// Parses test metadata from .typ file source.
///
/// Returns `Some(TestMetadata)` if the file carries the `@rheo:test` marker,
/// otherwise `None` — a `.typ` file with any other marker but not that one is
/// not a test case at all.
pub fn parse_test_metadata(source: &str) -> Option<TestMetadata> {
    let mut has_test_marker = false;
    let mut metadata = TestMetadata::default();

    for line in source.lines() {
        let trimmed = line.trim();
        if !trimmed.starts_with("//") {
            continue;
        }
        let comment = trimmed.trim_start_matches("//").trim();
        let Some(marker) = comment.strip_prefix("@rheo:") else {
            continue;
        };
        // A bare marker splits to an empty value, which the two valueless
        // markers below require — so `@rheo:test something` is not the marker.
        let (name, value) = marker
            .split_once(char::is_whitespace)
            .unwrap_or((marker, ""));
        let value = value.trim();

        match name {
            "test" if value.is_empty() => has_test_marker = true,
            "keep-version" if value.is_empty() => metadata.keep_version = true,
            "formats" => metadata.formats = parse_list(value),
            "description" => metadata.description = Some(value.to_string()),
            "expect" if !value.is_empty() => metadata.expect = Some(value.to_string()),
            "error-patterns" => metadata.error_patterns = parse_quoted_list(value),
            "warn-patterns" => metadata.warn_patterns = parse_quoted_list(value),
            _ => {}
        }
    }

    has_test_marker.then_some(metadata)
}

/// Reads test metadata from a .typ file
pub fn read_test_metadata(path: &Path) -> Option<TestMetadata> {
    let source = std::fs::read_to_string(path).ok()?;
    parse_test_metadata(&source)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_is_test_marker() {
        assert!(is_test_marker("// @rheo:test"));
        assert!(is_test_marker("  // @rheo:test  "));
        assert!(!is_test_marker("@rheo:test"));
        assert!(!is_test_marker("// some other comment"));
    }

    #[test]
    fn test_parse_test_metadata_minimal() {
        let source = "// @rheo:test\n= Content";
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.formats, vec!["html", "pdf"]);
        assert_eq!(metadata.description, None);
    }

    #[test]
    fn test_parse_test_metadata_with_formats() {
        let source = "// @rheo:test\n// @rheo:formats html\n= Content";
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.formats, vec!["html"]);
    }

    #[test]
    fn test_parse_test_metadata_with_multiple_formats() {
        let source = "// @rheo:test\n// @rheo:formats html,pdf,epub\n= Content";
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.formats, vec!["html", "pdf", "epub"]);
    }

    #[test]
    fn test_parse_test_metadata_with_description() {
        let source = "// @rheo:test\n// @rheo:description Tests blog post with images\n= Content";
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(
            metadata.description,
            Some("Tests blog post with images".to_string())
        );
    }

    #[test]
    fn test_parse_test_metadata_complete() {
        let source = r#"// @rheo:test
// @rheo:formats html,pdf
// @rheo:description Main blog index page with post listings

= Blog Index
"#;
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.formats, vec!["html", "pdf"]);
        assert_eq!(
            metadata.description,
            Some("Main blog index page with post listings".to_string())
        );
    }

    #[test]
    fn test_parse_test_metadata_no_marker() {
        let source = "= Content without markers";
        assert!(parse_test_metadata(source).is_none());
    }

    #[test]
    fn test_parse_test_metadata_ignores_non_comment_lines() {
        let source = r#"// @rheo:test
@rheo:formats html,pdf
// @rheo:formats epub
= Content
"#;
        let metadata = parse_test_metadata(source).unwrap();
        // Should only parse the comment line, not the non-comment @rheo:formats
        assert_eq!(metadata.formats, vec!["epub"]);
    }

    #[test]
    fn test_read_test_metadata_from_file() {
        // Test reading markers from an actual example file
        let manifest_dir = option_env!("CARGO_MANIFEST_DIR").unwrap_or(".");
        let path = Path::new(manifest_dir).join("examples/blog_site/content/index.typ");
        let metadata = read_test_metadata(&path).unwrap();
        assert_eq!(metadata.formats, vec!["html", "pdf"]);
        assert_eq!(
            metadata.description,
            Some("Main blog index page with post listings".to_string())
        );
    }

    #[test]
    fn test_read_test_metadata_pdf_only() {
        // Test reading PDF-only markers
        let manifest_dir = option_env!("CARGO_MANIFEST_DIR").unwrap_or(".");
        let path = Path::new(manifest_dir).join("examples/cover-letter.typ");
        let metadata = read_test_metadata(&path).unwrap();
        assert_eq!(metadata.formats, vec!["pdf"]);
        assert_eq!(
            metadata.description,
            Some("Job application cover letter with custom formatting".to_string())
        );
    }

    #[test]
    fn test_parse_test_metadata_with_expect_error() {
        let source = "// @rheo:test\n// @rheo:expect error\n= Content";
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.expect, Some("error".to_string()));
    }

    #[test]
    fn test_parse_test_metadata_with_error_patterns() {
        let source = r#"// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "error", "cannot add", "│"
= Content"#;
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.expect, Some("error".to_string()));
        assert_eq!(metadata.error_patterns, vec!["error", "cannot add", "│"]);
    }

    #[test]
    fn test_parse_test_metadata_error_patterns_with_spaces() {
        let source = r#"// @rheo:test
// @rheo:error-patterns "pattern one", "pattern two"
= Content"#;
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.error_patterns, vec!["pattern one", "pattern two"]);
    }

    #[test]
    fn test_parse_test_metadata_with_warn_patterns() {
        let source = r#"// @rheo:test
// @rheo:warn-patterns "retired", "`merge`"
= Content"#;
        let metadata = parse_test_metadata(source).unwrap();
        assert_eq!(metadata.warn_patterns, vec!["retired", "`merge`"]);
        assert!(metadata.error_patterns.is_empty());
    }

    #[test]
    fn test_parse_test_metadata_with_keep_version() {
        let source = "// @rheo:test\n// @rheo:keep-version\n= Content";
        let metadata = parse_test_metadata(source).unwrap();
        assert!(metadata.keep_version);
    }

    #[test]
    fn test_parse_test_metadata_keep_version_defaults_false() {
        let source = "// @rheo:test\n= Content";
        let metadata = parse_test_metadata(source).unwrap();
        assert!(!metadata.keep_version);
    }
}
