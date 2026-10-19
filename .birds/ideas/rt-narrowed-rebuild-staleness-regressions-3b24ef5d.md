---
id: rt-narrowed-rebuild-staleness-regressions-3b24ef5d
short-id: 3b
title: Narrowed-rebuild staleness regressions
priority: 3
labels:
- test-watch-narrow
deps:
- blocked-by:rt-narrowed-rebuild-harness-5c59db1c
closed: false
---
Touches: cases/watch_narrow_regressions/ (new), tests/watch_narrow_regressions.rs (new)

## Why

Code reading of rheo's narrowed-rebuild path (`[watch] narrow = true`) turned up
three ways a derived page can go stale. Each gets one test here, written to show
the bug: on today's rheo they should FAIL. They land marked
`#[ignore = "rheo bug: ..."]`, so the default suite stays green and a later rheo
fix flips them on. Every one compares the on-disk build after the edit against
a fresh full `rheo compile` of the edited project, the oracle for "changed files
are correct".

This bird uses helpers added by bird rt-narrowed-rebuild-harness-5c59db1c (the
dependency of this bird): `DevServer::edit_and_wait_for_rebuild(edit) -> String`
(returns the `narrowed: …`/`full rebuild: …` log line), `DevServer::rebuild_lines()`,
and in `src/helpers/narrow.rs`: `fresh_compile_html(project) -> TempDir` and
`assert_html_trees_equal(actual, expected)`. Find them with
`rg -n 'fn edit_and_wait_for_rebuild|fn assert_html_trees_equal' src`. If they
are missing, stop and report.

Rules carried over from that bird: read outputs from `<project>/build/html/` on
disk, never over HTTP (with `--open`, the dev server serves a separate full
compile). Never write `<rheo-ligament:…>` label syntax in a page; query it as
`label("rheo-ligament:attach")`. A page reading a ligament falls back to a live
`query` when `rheo-ligament-get(key)` returns `none`, i.e. on a full compile.
Imports: `#import "/typ/rheo.typ": rheo-ligament-attach, rheo-ligament-bind, rheo-ligament-get`.

## The three bugs (rheo side, verified in source at filing time)

1. **`rheo-metadata` does not bind.** `rheo-metadata-impl` in
   `../rheo/crates/core/src/typ/metadata.typ` (anchor:
   `rg -n 'let found = query\(label\("rheo-meta:"' ../rheo/crates` → one hit)
   reads another page's metadata but emits no `rheo-ligament-bind`. So a listing
   page that shows another page's title is never treated as dependent on it.
2. **Fed-in ligaments are never cleared.** `Build::compile_bundle_subset` calls
   `set_incoming_ligaments`, and nothing ever resets it to `None`
   (`rg -n 'incoming_ligaments' ../rheo/crates/core/src/build.rs`). So after one
   narrowed rebuild, every later FULL rebuild is still fed the old ligaments.
   A reader that merges live data with ligament-only entries (rookery's
   `_reg-final` does this) shows ghosts of entries that no longer exist.
3. **A bind cycle is not followed.** `Build::narrow_one_plugin` skips
   dependents already compiled this rebuild (anchor:
   `rg -n 'filter\(\|\(h, _\)\| !seen.contains' ../rheo/crates` → one hit). If A
   and B each bind what the other attaches, A's edit updates B, and B's changed
   attach never gets back to A.

## Steps

1. Fixture `cases/watch_narrow_regressions/` (no `version` line; it is injected),
   `rheo.toml`:

   ```toml
   formats = ["html"]
   [spine]
   exclude = ["_lib/**"]
   [watch]
   narrow = true
   ```

   Pages:
   - `post.typ`: `#set document(title: "First")` then `= Post`.
   - `list.typ`: `#context [Latest: #(rheo-context().metadata-of)("post").at("title", default: [none])]`.
   - `_lib/item.typ`: `#let item-id = "alpha"`.
   - `holder.typ`: `#import "/_lib/item.typ": item-id`, then `#rheo-ligament-attach("items", item-id)`.
   - `reader.typ`: binds `"items"` and prints the ids merged the way rookery does.
     LIVE ids come from `query(label("rheo-ligament:attach"))` filtered to key
     `"items"`. Then append each `rheo-ligament-get("items")` value that is not
     already live (skip when it returns `none`). Render `[Items: #ids.join(", ")]`.
   - `x.typ`: attaches `"kx"` = `"x1"`, binds `"ky"`, and renders `[X sees: …]`
     with the `"ky"` values (live fallback as above).
   - `y.typ`: binds `"kx"` and attaches `"ky"` = `"y-of-" + <first "kx" value, or "?" when there is none>`,
     reading `kx` via ligament-or-live the same way. The attach must sit inside
     the `#context` that reads `kx`.
   Before writing any test, compile a temp copy once with
   `cargo run --manifest-path ../rheo/Cargo.toml -p rheo -- compile <copy> --html`.
   Expected: list.html shows `Latest: First`, reader.html shows `Items: alpha`,
   x.html shows `X sees: y-of-x1`. If the x/y cycle does not converge on a full
   compile, delete that pair and its test, and say so in the report.

2. `tests/watch_narrow_regressions.rs`. Set up the same way as
   `tests/watch_narrow.rs` (copy the fixture to a tempdir, rewrite `rheo.toml`
   with `rheo_core::config::manifest_version::CURRENT` and keep its other
   tables, then `DevServer::start(project, &["--html"])`). Three tests, each
   `#[ignore = "rheo bug: <one line>"]`:
   - `metadata_listing_follows_title_edit`: change `"First"` to `"Second"` in
     post.typ, then `edit_and_wait_for_rebuild`. Assert `build/html/list.html`
     contains `Latest: Second`, then assert the trees equal a fresh compile.
   - `full_rebuild_after_narrowed_drops_stale_ligaments`: first append a line to
     holder.typ and wait (narrowed; this primes the fed-in ligaments). Then
     change `"alpha"` to `"gamma"` in `_lib/item.typ` and wait. The returned
     line must start `full rebuild:`. Assert reader.html contains `gamma` and
     does NOT contain `alpha`, then the trees-equal oracle.
   - `bind_cycle_reaches_fixpoint`: change `"x1"` to `"x2"` in x.typ and wait.
     Assert x.html contains `y-of-x2`, then the trees-equal oracle.

3. Run them with `--ignored` and confirm each fails on its first content
   assertion, i.e. the stale value. A failure for any other reason (fixture
   error, timeout) is a fixture bug: fix it. If a test unexpectedly PASSES,
   remove its `#[ignore]` and report that the suspected bug did not reproduce.

## Non-goals

- Do not fix rheo, and do not edit `../rheo`.
- Do not edit `tests/watch_narrow.rs` or the helpers. If a helper is missing
  something, report it.

## Verify

```bash
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_regressions -- --test-threads=1
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_regressions -- --ignored --test-threads=1
cargo fmt --check && cargo clippy --tests -- -D warnings
```

The first command reports 0 run, 3 ignored, and passes. The second fails each
test on its stale-content assertion; quote the three panic messages in your
report. If `../rheo` does not resolve inside the flight, this is blocked on rt-8e.