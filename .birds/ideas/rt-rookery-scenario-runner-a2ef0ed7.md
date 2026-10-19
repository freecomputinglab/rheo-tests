---
id: rt-rookery-scenario-runner-a2ef0ed7
short-id: a2
title: Rookery scenario runner
priority: 3
labels:
- test-watch-narrow
deps:
- blocked-by:rt-narrowed-rebuild-harness-5c59db1c
closed: false
---
Touches: src/helpers/scenario.rs (new), src/helpers/narrow.rs, src/helpers/mod.rs, cases/watch_narrow_rookery/ (new), tests/watch_narrow_rookery_smoke.rs (new)

## Why

Bird rt-narrowed-rebuild-harness-5c59db1c tests rheo's `[watch] narrow = true`
with three hand-written pages. Real narrowed rebuilds run on rookery sites,
whose derived views (note pages, backlinks, tag outlines, the `ideas/index.html`
listing, the search index) are where stale output is being reported. This bird
adds two reusable pieces. First, a **rookery fixture** about 20 pages in size.
Second, a **scenario runner** that applies a scripted sequence of edits under
one `rheo watch` session and, after EVERY step, compares the on-disk build
against a fresh full `rheo compile`. Later birds write the scenarios themselves.

Depends on helpers from rt-narrowed-rebuild-harness-5c59db1c. Find them with
`rg -n 'fn edit_and_wait_for_rebuild|fn fresh_compile_html|fn assert_html_trees_equal' src`
(three hits: `DevServer` in `src/helpers/devserver.rs`, and `src/helpers/narrow.rs`).
If they are missing, stop and report.

Facts you need:
- Under `rheo watch --open`, which `DevServer` always passes, the files on disk
  under `<project>/build/html/` reflect the narrowed rebuild. HTTP responses come
  from a separate full compile. **Compare disk only.**
- rheo logs `narrowed: <N> vertebra(e) in <R> round(s) — <handles>` or
  `full rebuild: <reason>` once per rebuild, after disk writes.
- Rookery's packages live in the sibling checkout `/home/lox/code/_fcl/rookery`,
  laid out `<package>/<version>/` (e.g. `core/0.1.1/`). A project points at it
  with `[packages.rookery]` and `path = "<dir>"`. A relative `path` resolves
  against `rheo.toml`'s own directory, which breaks once the fixture is copied
  to a tempdir, so the test writes an ABSOLUTE path at copy time. Whatever is
  checked out in that rookery working tree is what gets tested.
- Rookery's core `.marrow.typ` mints a page per note (`ideas/<id>.html`) and,
  with `index-page: true`, `ideas/index.html`. It builds both from
  `_registry-final()`, the live registry only
  (`rg -n 'let registry = _registry-final\(\)' /home/lox/code/_fcl/rookery/core`
  → one hit), so these are the most likely pages to go stale on a narrowed
  rebuild. The fixture must exercise them.

## Steps

1. **Fixture `cases/watch_narrow_rookery/`.** Model it on rookery's own demo:
   `/home/lox/code/_fcl/rookery/core/0.1.1/demo/rheo/` (its `rheo.toml`,
   `content/lib.typ`, `content/relations.typ`) and, for search,
   `/home/lox/code/_fcl/rookery/search/0.1.1/demo/rheo/content/index.typ`
   (anchor `rg -n 'search-bar, search-ideas, search-index' /home/lox/code/_fcl/rookery/search`
   → one hit, the import line). Copy patterns from there; do not invent API.
   Layout:
   - `rheo.toml`: no `version` line (`copy_project_to_test_store` injects it),
     `content_dir = "content"`, `formats = ["html"]`, `[spine] exclude = ["lib.typ"]`,
     `[watch] narrow = true`, and a `[packages.rookery]` table with
     `path = "ROOKERY_DIR"`. That literal placeholder is replaced at test time.
   - `content/lib.typ`: the demo's `lib.typ` pattern. It binds `idea`, defines a
     named `idea-page` template, and a `demo(doc)` wrapper applying
     `rookery.with(idea-page-template: idea-page, index-page: true, ..)`.
   - `content/notes/n01.typ` … `n12.typ`: each `#show: demo`, then one or two
     `#idea("<id>", title: [..], tags: (..))[..]` notes. Use tags from
     `alpha`, `beta`, `gamma`. Use ids like `n01a`, `n01b`, so each id says
     which file owns it. At least 6 notes reference a note on ANOTHER page with
     `@idea:<id>` (install `#show ref: hyperlink`), giving backlinks; at least
     3 pages `#window("<id>")` a note from another page.
   - `content/outline-alpha.typ`: `#ideas-outline(tagged: "alpha")`.
     `content/everything.typ`: `#ideas-outline(title: [Everything])`.
   - `content/search.typ`: the search demo's `#search-index` plus `#search-bar`.
   - `content/posts/p1.typ` … `p3.typ`: plain pages with
     `#set document(title: "..")`. `content/posts-list.typ` shows each post's title
     via `#context (rheo-context().metadata-of)("posts:p1").at("title", default: [none])`.
   Check it once by hand: copy it to a temp dir, substitute the path, and run
   `cargo run --manifest-path ../rheo/Cargo.toml -p rheo -- compile <dir> --html`.
   It must compile, and `build/html/ideas/index.html` must exist.
2. **`src/helpers/narrow.rs`**: add `pub fn html_tree_diffs(actual: &Path, expected: &Path) -> Vec<String>`,
   one human-readable entry per differing, missing, or extra file (relative
   path plus a short unified diff, capped at 40 lines each). Re-implement
   `assert_html_trees_equal` as "panic if `html_tree_diffs` is non-empty" so the
   comparison logic exists once.
3. **`src/helpers/scenario.rs`** (register in `src/helpers/mod.rs`). Data first:
   - `pub enum Expect { Narrowed(Vec<&'static str>), AnyNarrowed, Full, Any }`.
     The `Vec` holds handles that must ALL appear in the log line.
   - `pub struct Step { pub name: &'static str, pub edit: Box<dyn Fn(&Path)>, pub expect: Expect }`,
     plus `Step::new(name, expect, edit)`. Add a few edit constructors as
     associated fns, all keyed off the project root: `Step::replace(name, expect, rel, from, to)`
     (panic if `from` is absent), `Step::append(..)`, `Step::write(..)` (create or
     overwrite), and `Step::remove(..)`. A step may touch several files.
   - `pub struct Scenario { name, steps }` and
     `pub fn run(&self, fixture: &str, setup: impl Fn(&Path)) -> ScenarioReport`.
     `run` copies the fixture to a tempdir, rewrites the `rheo.toml` `version`
     the way `tests/watch.rs` does while keeping every other table, runs
     `setup`, then starts `DevServer::start(project, &["--html"])`. For each
     step: call `edit_and_wait_for_rebuild`, timing it; check `expect` against
     the line; then `html_tree_diffs(build/html, fresh_compile_html(project)/build/html)`.
     Do NOT stop at the first failing step: record it and continue.
   - `ScenarioReport` holds one row per step: name, log line, ms, expect ok, and
     the diffs. `report.assert_clean()` prints a table (one row per step) to
     stderr, then panics if any step had an expect mismatch or a diff, naming
     every failing step and its first diff.
   - `pub fn rookery_dir() -> Option<PathBuf>`: env `ROOKERY_DIR`, else
     `<CARGO_MANIFEST_DIR>/../rookery`, returning `Some` only if
     `core/0.1.1/typst.toml` exists under it. Also `pub fn rookery_setup(project: &Path)`:
     replace `ROOKERY_DIR` in `rheo.toml` with that absolute path, panicking
     with a clear message when `rookery_dir()` is `None`.
4. **`tests/watch_narrow_rookery_smoke.rs`**: one test,
   `#[ignore = "needs ../rookery checkout"]`, `rookery_smoke`. Two steps: (a)
   change one word in a note body in `notes/n03.typ`, `Expect::AnyNarrowed`;
   (b) append a sentence to `posts/p1.typ`, `Expect::AnyNarrowed`. End with
   `report.assert_clean()`.

## Non-goals

- Do not edit rheo or rookery. If the smoke test fails because of real stale
  output, keep it failing, and paste the report table plus the first diff into
  your report. That is the point of this work.
- No todos, pinboard, or slipshow packages in the fixture. Keep it to core and
  search.
- Do not change `DevServer` or the earlier `tests/watch_narrow*.rs` files,
  except to re-use `html_tree_diffs`.

## Verify

```bash
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow -- --test-threads=1
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_smoke -- --ignored --nocapture
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_smoke
cargo fmt --check && cargo clippy --tests -- -D warnings
```

1. Still passes, apart from tests that bird already marked ignored.
2. Prints the step table. Report whether it passed; if it failed, include the
   failing steps.
3. Reports 1 ignored.

`../rheo` must resolve inside the flight (bird rt-8e). If it does not, stop and report.