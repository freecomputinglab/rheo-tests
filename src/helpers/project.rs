//! Throwaway projects and fake Typst packages, built file-by-file in a tempdir.
//!
//! For a test whose subject is a shape no checked-in fixture should carry — one
//! arbitrary asset name, one malformed manifest, one package that ships nothing.
//! A test that exercises real authored content belongs in `cases/` and goes
//! through [`super::compiled::CompiledFixture`] instead.

use super::cli::rheo_cli_command;
use rheo_core::config::manifest_version;
use std::path::{Path, PathBuf};
use std::process::Output;
use tempfile::TempDir;

/// A rheo project in a tempdir, removed when dropped.
pub struct TempProject {
    dir: TempDir,
}

impl TempProject {
    /// A project whose `rheo.toml` declares `formats` at the current rheo
    /// version. Extra `rheo.toml` body lines can be appended with
    /// [`Self::config`].
    pub fn new(formats: &[&str]) -> Self {
        let dir = tempfile::tempdir().expect("tempdir");
        let project = Self { dir };
        let formats = formats
            .iter()
            .map(|f| format!("\"{f}\""))
            .collect::<Vec<_>>()
            .join(", ");
        project.write(
            "rheo.toml",
            &format!(
                "version = \"{}\"\nformats = [{formats}]\n",
                manifest_version::CURRENT
            ),
        );
        project
    }

    /// Append lines to `rheo.toml`, for a project needing more than `formats`.
    pub fn config(self, extra: &str) -> Self {
        let existing = std::fs::read_to_string(self.path().join("rheo.toml")).expect("read config");
        self.write("rheo.toml", &format!("{existing}{extra}"));
        self
    }

    /// Write a file, creating its parent directories.
    pub fn file(self, rel: &str, contents: &str) -> Self {
        self.write(rel, contents);
        self
    }

    pub fn path(&self) -> &Path {
        self.dir.path()
    }

    pub fn build_dir(&self) -> PathBuf {
        self.path().join("build")
    }

    /// Run `rheo compile` for `formats` (e.g. `&["--html"]`), without asserting
    /// the outcome — a test wanting a deliberate failure reads the `Output`.
    pub fn compile(&self, formats: &[&str]) -> Output {
        self.compile_with_env(formats, &[])
    }

    /// [`Self::compile`] with extra environment, e.g. an `XDG_DATA_HOME`
    /// redirect so a fake package is found without touching the real Typst
    /// package cache.
    pub fn compile_with_env(&self, formats: &[&str], env: &[(&str, &Path)]) -> Output {
        let build_dir = self.build_dir();
        let mut cmd = rheo_cli_command();
        cmd.args(["compile", self.path().to_str().expect("utf-8 project path")])
            .args(formats)
            .args(["--build-dir", build_dir.to_str().expect("utf-8 build path")])
            .env("TYPST_IGNORE_SYSTEM_FONTS", "1");
        for (key, value) in env {
            cmd.env(key, value);
        }
        cmd.output().expect("run rheo compile")
    }

    /// Read a built file as text, naming it on failure.
    pub fn read_built(&self, rel: &str) -> String {
        let path = self.build_dir().join(rel);
        std::fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()))
    }

    fn write(&self, rel: &str, contents: &str) {
        let path = self.path().join(rel);
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).expect("create parent directory");
        }
        std::fs::write(&path, contents).unwrap_or_else(|e| panic!("write {rel}: {e}"));
    }
}

/// A Typst package staged on disk at `<search_root>/<ns>/<name>/<version>/`.
///
/// Kept separate from [`TempProject`]: a package and a project have different
/// layouts, and one type doing both is what makes such setup unreadable.
pub struct FakePackage {
    root: PathBuf,
    spec: String,
}

impl FakePackage {
    /// Stage the package `spec` names (`@ns/name:version`) under
    /// `search_root`, with a minimal `[package]` manifest and an empty
    /// `lib.typ` — what almost every caller wants before adding anything.
    ///
    /// `search_root` is a Typst package search directory: a bare tempdir for a
    /// [`PackageIndex`](rheo_core::plugins::PackageIndex) test, or
    /// `<xdg dir>/typst/packages` for an end-to-end compile.
    pub fn new(search_root: &Path, spec: &str) -> Self {
        let (namespace, name, version) = parse_spec(spec);
        let root = search_root.join(namespace).join(name).join(version);
        std::fs::create_dir_all(&root).expect("create package directory");
        let package = Self {
            root,
            spec: spec.to_string(),
        };
        package
            .manifest(&format!(
                "[package]\nname = \"{name}\"\nversion = \"{version}\"\nentrypoint = \"lib.typ\"\n"
            ))
            .file("lib.typ", "")
    }

    /// Replace `typst.toml` wholesale — for a `[tool.rheo]` block, or for
    /// deliberately malformed TOML.
    pub fn manifest(self, toml: &str) -> Self {
        self.file("typst.toml", toml)
    }

    /// Write a file inside the package, creating its parent directories.
    pub fn file(self, rel: &str, contents: &str) -> Self {
        let path = self.root.join(rel);
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent).expect("create parent directory");
        }
        std::fs::write(&path, contents).unwrap_or_else(|e| panic!("write {rel}: {e}"));
        self
    }

    /// The `@ns/name:version` string a project imports and an index resolves.
    pub fn spec(&self) -> String {
        self.spec.clone()
    }

    pub fn root(&self) -> &Path {
        &self.root
    }
}

/// Split `@ns/name:version` into its three parts, panicking on anything else —
/// a malformed spec in a test is a typo, not a case to handle.
fn parse_spec(spec: &str) -> (&str, &str, &str) {
    let rest = spec
        .strip_prefix('@')
        .unwrap_or_else(|| panic!("package spec must start with '@': {spec}"));
    let (namespace, rest) = rest
        .split_once('/')
        .unwrap_or_else(|| panic!("package spec must contain '/': {spec}"));
    let (name, version) = rest
        .split_once(':')
        .unwrap_or_else(|| panic!("package spec must contain ':': {spec}"));
    (namespace, name, version)
}
