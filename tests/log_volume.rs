//! Pins the volume of rheo's asset logging against the size of the build.
//!
//! Assets are resolved once per build and every page links the same set, so a
//! per-asset log line belongs to the build, not to the page. Emitting one from
//! a per-page hook multiplies it by the page count — a 345-page site with 7
//! stylesheets once produced 2415 lines saying the same seven things.
//!
//! The assertion here is deliberately about volume rather than wording: it
//! compares two builds that differ only in how many pages they contain, so it
//! catches a reintroduced per-page log however it is phrased.

use rheo_tests::helpers::project::TempProject;

const STYLESHEET: &str = "/* project default */";
const PAGE: &str = "= Hello\n\nTest document.\n";

/// Identical asset configuration must produce identical asset log volume no
/// matter how many pages are compiled.
#[test]
fn test_asset_logging_does_not_scale_with_page_count() {
    let one_page = TempProject::new(&["html"])
        .file("style.css", STYLESHEET)
        .file("a.typ", PAGE);
    let three_pages = TempProject::new(&["html"])
        .file("style.css", STYLESHEET)
        .file("a.typ", PAGE)
        .file("b.typ", PAGE)
        .file("c.typ", PAGE);

    let one_output = one_page.compile(&["--html"]);
    let one_stderr = String::from_utf8_lossy(&one_output.stderr);
    assert!(
        one_output.status.success(),
        "one-page compile failed: {one_stderr}"
    );

    let three_output = three_pages.compile(&["--html"]);
    let three_stderr = String::from_utf8_lossy(&three_output.stderr);
    assert!(
        three_output.status.success(),
        "three-page compile failed: {three_stderr}"
    );

    // Without differing page counts the comparison below would hold vacuously.
    for page in ["a.html", "b.html", "c.html"] {
        assert!(
            three_pages.build_dir().join("html").join(page).exists(),
            "three-page build should have produced {page}"
        );
    }
    for page in ["b.html", "c.html"] {
        assert!(
            !one_page.build_dir().join("html").join(page).exists(),
            "one-page build should not have produced {page}"
        );
    }

    let mentions = |stderr: &str| stderr.lines().filter(|l| l.contains("style.css")).count();
    assert_eq!(
        mentions(&one_stderr),
        mentions(&three_stderr),
        "asset log volume grew with the page count: {} line(s) for one page, {} for three\n\
         --- one page ---\n{one_stderr}\n--- three pages ---\n{three_stderr}",
        mentions(&one_stderr),
        mentions(&three_stderr)
    );

    // Silence must come from not logging, not from the asset failing to resolve.
    let html = three_pages.read_built("html/a.html");
    assert!(
        html.contains(r#"href="style.css""#),
        "each page should still link the stylesheet:\n{html}"
    );
}
