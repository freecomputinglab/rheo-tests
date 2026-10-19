---
id: rt-narrowed-rebuild-harness-5c59db1c
short-id: '5'
title: Narrowed-rebuild harness
priority: 3
labels:
- test-watch-narrow
deps:
- blocked-by:rt-make-a-bd-flight-able-to-build-against-8eacf3bf
closed: false
---
Touches: src/helpers/devserver.rs, src/helpers/narrow.rs (new), src/helpers/mod.rs, cases/watch_narrow/ (new: rheo.toml, a.typ, b.typ, c.typ), tests/watch_narrow.rs (new)

## Why

rheo (sibling checkout `../rheo`) has an opt-in `[watch] narrow = true` mode. Under
`rheo watch`, editing one content page ("vertebra") recompiles only that page, plus
any page that **binds** to a ligament key whose **attached** value changed, and
writes only those pages' outputs to disk. Nothing in this repo tests it, and
there are user reports that derived pages go stale. This bird adds the harness
plus the basic correctness tests. Two later birds build on it: one adds
regression cases, the other a speed test.

Facts about rheo you need (all verified at filing time, rheo `main` + local work):

- After every narrowed rebuild rheo logs one INFO line from target `rheo_core`:
  `narrowed: <N> vertebra(e) in <R> round(s) — <handle>, <handle>`
  and after a full rebuild: `full rebuild: <reason>`. Both prefixes are fixed
  (an external monitor greps them). The line is logged AFTER that rebuild's
  disk outputs are written. Find it in rheo with
  `rg -n 'narrowed: \{\} vertebra' ../rheo/crates` (one hit, `RebuildPath::log`
  in `crates/core/src/build.rs`).
- The very first build of a watch session is always full. Only later edits can
  narrow. An edit to any file that is not a spine page (e.g. an excluded
  `_lib/` file) always does a full rebuild.
- With `--open` (which `DevServer::start` always passes), every edit ALSO runs a
  separate FULL in-memory compile for the dev server. So **pages fetched over
  HTTP do not reflect the narrowed path. Only the files on disk under
  `<project>/build/html/` do.** Every assertion in this bird reads disk, not HTTP.
- A page reads attached values with `rheo-ligament-get(key)`. It returns `none`
  on an ordinary full compile, where no ligaments are fed in, and an array of
  `(page: <handle>, value: <v>)` dicts on a narrowed compile. A page that
  displays a ligament value must therefore fall back to a live query when it
  gets `none`. The fixture below does exactly that.
- Labels starting `rheo-ligament:` are reserved. Writing one as `<rheo-ligament:...>`
  label syntax in a page is a hard build error. Use `label("rheo-ligament:attach")`
  inside `query(...)`, never the angle-bracket form.

## Steps

1. **Fixture `cases/watch_narrow/`.** Omit any `version` line from its
   `rheo.toml`: `copy_project_to_test_store` (src/helpers/test_store.rs) injects
   the current one. Write `rheo.toml`:

   ```toml
   formats = ["html"]

   [watch]
   narrow = true
   ```

   `a.typ`, the attacher:

   ```typst
   #import "/typ/rheo.typ": rheo-ligament-attach
   = A
   #rheo-ligament-attach("greeting", "hello")
   ```

   `b.typ`, the binder, with a live fallback so a full compile renders the same bytes:

   ```typst
   #import "/typ/rheo.typ": rheo-ligament-bind, rheo-ligament-get
   = B
   #rheo-ligament-bind("greeting")
   #context {
     let pairs = rheo-ligament-get("greeting")
     let vals = if pairs == none {
       query(label("rheo-ligament:attach")).filter(m => m.value.key == "greeting").map(m => m.value.value)
     } else { pairs.map(p => p.value) }
     [Greeting: #vals.join(", ")]
   }
   ```

   `c.typ`, unrelated: `= C` plus one line of plain text.

   First run `cargo run --manifest-path ../rheo/Cargo.toml -p rheo -- compile <copy of fixture> --html`
   on a temp copy, and check that `build/html/b.html` contains `Greeting: hello`.
   If the import path `/typ/rheo.typ` does not resolve, stop and report it. Do not
   invent another path.

2. **Rebuild-wait helper on `DevServer`** (`src/helpers/devserver.rs`). Anchor:
   `rg -n 'pub fn wait_for_edit' src` → one hit, `impl DevServer`. Add, next to it:
   - `pub fn rebuild_lines(&self) -> Vec<String>`: every line of `self.log()`
     containing `narrowed: ` or `full rebuild: `.
   - `pub fn edit_and_wait_for_rebuild(&self, edit: impl Fn()) -> String`: record
     `rebuild_lines().len()`, apply `edit`, and re-apply it every `REEDIT_INTERVAL`
     until the count grows. Keep the reason from `wait_for_edit`'s doc comment:
     the watcher registers late. Then keep polling until the count has stayed
     unchanged for 2.5 s, because a re-applied edit can trigger one extra rebuild
     that must not leak into the next call. Return the LAST rebuild line. Add a
     `REBUILD_TIMEOUT` const of 60 s, since debug-built rheo is slow. Panic with
     the full log on timeout.
   - If no `narrowed: `/`full rebuild: ` line ever appears, `RUST_LOG` is probably
     not reaching target `rheo_core`. Anchor: `rg -n 'RUST_LOG", "rheo=info' src`
     → one hit in `DevServer::start`. Change that value to
     `rheo=info,rheo_core=info,rheo_html=info` and change nothing else in `start`.

3. **`src/helpers/narrow.rs`** (register `pub mod narrow;` in `src/helpers/mod.rs`, alphabetical):
   - `pub fn fresh_compile_html(project: &Path) -> tempfile::TempDir`: copy
     `project` into a new tempdir with `copy_project_to_test_store` (it skips
     `build/`), run `rheo_cli_command().arg("compile").arg(<copy>).arg("--html")`
     (`src/helpers/cli.rs`) with env `TYPST_IGNORE_SYSTEM_FONTS=1`, and assert success.
   - `pub fn assert_html_trees_equal(actual: &Path, expected: &Path)`: walk both
     trees with `walkdir`, assert they hold the same set of relative file paths,
     and compare each file's bytes. On the first mismatch, panic with the
     relative path and a unified diff from the `similar` crate (already a
     dependency). If the ONLY differences turn out to be the tempdir path
     embedded in output, normalise that path to a placeholder before
     comparing, and note it in a comment.

4. **`tests/watch_narrow.rs`**, three `#[test]`s. Each copies the fixture into a
   fresh tempdir, the same way `served_html_matches_compiled_html_for_rheo_head`
   in `tests/watch.rs` does (copy it, then rewrite `rheo.toml` with
   `rheo_core::config::manifest_version::CURRENT`, KEEPING the `[watch]` table),
   then starts `DevServer::start(project, &["--html"])`:
   - `attach_edit_recompiles_binder`: replace `"hello"` with `"howdy"` in a.typ.
     The returned line starts `narrowed: 2 vertebra(e) in 2 round(s)` and names
     both `a` and `b`. `build/html/b.html` contains `Greeting: howdy`.
     `build/html/c.html`'s mtime is unchanged from before the edit. And
     `assert_html_trees_equal(project/build/html, fresh_compile_html(project)/build/html)`.
   - `unrelated_edit_narrows_to_one_page`: append a line to c.typ. The line starts
     `narrowed: 1 vertebra(e) in 1 round(s)` and names `c`. b.html's mtime is
     unchanged. Trees equal to a fresh compile.
   - `bind_only_edit_propagates_nothing`: append plain text to b.typ. The line
     starts `narrowed: 1 vertebra(e)` and names `b`. Trees equal to a fresh compile.
   Take mtimes with `std::fs::metadata(..).modified()` before the edit.

## Non-goals

- Do not change rheo. If a test fails because rheo is wrong, leave the
  assertion as is, mark only that test `#[ignore = "rheo: <one-line reason>"]`,
  and say so in your report.
- No timing assertions here: speed is a separate bird.
- Do not touch `tests/watch.rs` or `wait_for_edit`.

## Verify

Run from this repo's root (the flight path):

```bash
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow -- --test-threads=1
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch -- --test-threads=1
cargo fmt --check && cargo clippy --tests -- -D warnings
```

The first command passes all three tests, or the report explains each one
marked ignored. The second still passes. If `../rheo` does not resolve inside
the flight, this bird is blocked on rt-8e. Report it; do not work around it.