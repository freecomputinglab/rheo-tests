//! Pins `parse_inputs` (rheo `crates/cli/src/lib.rs`) and its `[inputs]`
//! `rheo.toml` counterpart (`crates/core/src/config/mod.rs`,
//! `RESERVED_INPUT_KEY`): split-on-first-`=`, no-`=` is an error, empty key is
//! an error, and `rheo-context` is rejected from both the CLI flag and the
//! config table — confirmed by reading both sites before writing these.

use rheo_tests::helpers::project::TempProject;

fn project() -> TempProject {
    TempProject::new(&["html"]).file("main.typ", "= Hello\n\nTest document.\n")
}

/// `--input a=x=y` splits on the FIRST `=` only, so `a` reads back as `x=y`.
#[test]
fn test_input_splits_on_first_equals_only() {
    let project = project().file("main.typ", "Value: #sys.inputs.at(\"a\")\n");
    let output = project.compile(&["--html", "--input", "a=x=y"]);
    assert!(
        output.status.success(),
        "compile failed: {}",
        String::from_utf8_lossy(&output.stderr)
    );
    let html = project.read_built("html/main.html");
    assert!(
        html.contains("Value: x=y"),
        "expected sys.inputs.a to read back as 'x=y' (first '=' only):\n{html}"
    );
}

/// An `--input` argument with no `=` is an error naming the argument, never
/// silently ignored.
#[test]
fn test_input_without_equals_is_error() {
    let project = project();
    let output = project.compile(&["--html", "--input", "justkey"]);
    assert!(
        !output.status.success(),
        "compile should fail for --input with no '='"
    );
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("no `=`") && stderr.contains("`justkey`"),
        "stderr should name the offending argument:\n{stderr}"
    );
}

/// An empty key (`--input =value`) is an error.
#[test]
fn test_input_empty_key_is_error() {
    let project = project();
    let output = project.compile(&["--html", "--input", "=value"]);
    assert!(
        !output.status.success(),
        "compile should fail for --input with an empty key"
    );
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("non-empty key") && stderr.contains("`=value`"),
        "stderr should name the offending argument:\n{stderr}"
    );
}

/// `--input rheo-context=...` is rejected: rheo owns that key.
#[test]
fn test_input_reserved_rheo_context_key_is_error() {
    let project = project();
    let output = project.compile(&["--html", "--input", "rheo-context=forged"]);
    assert!(
        !output.status.success(),
        "compile should fail for --input rheo-context=..."
    );
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("is reserved") && stderr.contains("`rheo-context`"),
        "stderr should name the reserved key:\n{stderr}"
    );
}

/// The same reserved-key rule, enforced separately for `rheo.toml`'s
/// `[inputs]` table (`RESERVED_INPUT_KEY` in `crates/core/src/config/mod.rs`).
#[test]
fn test_config_inputs_reserved_rheo_context_key_is_error() {
    let project = TempProject::new(&["html"])
        .config("\n[inputs]\nrheo-context = \"forged\"\n")
        .file("main.typ", "= Hello\n\nTest document.\n");
    let output = project.compile(&["--html"]);
    assert!(
        !output.status.success(),
        "compile should fail when rheo.toml's [inputs] sets rheo-context"
    );
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stderr.contains("[inputs] may not set") && stderr.contains("`rheo-context`"),
        "stderr should name the reserved key:\n{stderr}"
    );
}
