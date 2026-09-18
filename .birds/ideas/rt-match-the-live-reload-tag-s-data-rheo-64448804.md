---
id: rt-match-the-live-reload-tag-s-data-rheo-64448804
short-id: '64'
title: Match the live-reload tag's data-rheo-live attribute
priority: 4
labels:
- feat-rehydrate-optimization
deps: []
closed: true
---
`rheo` PR #179 (`feat/rehydrate-optimization`) fails CI on this repo's `tests/watch.rs`:

```
thread 'served_html_matches_compiled_html_for_rheo_head' panicked at tests/watch.rs:17:5:
live-reload script present
```

The dev server now marks its own injected tag with a bare `data-rheo-live`
attribute, so the client can survey the page's *other* scripts without counting
itself (`rheo/crates/html/src/server.rs`, `inject_live_reload_script`). The
emitted tag is now:

```html
<script src="/.rheo/live.js" data-rheo-live></script>
```

`strip_live_reload_script` in `tests/watch.rs` still matches the pre-#179 tag
(`<script src="/.rheo/live.js"></script>`), so `served.contains(TAG)` is false
and both parity tests that call it blow up on the assert.

## Steps

1. In `tests/watch.rs`, in `strip_live_reload_script` (around line 15-19),
   change the `TAG` constant to:

   ```rust
   const TAG: &str = r#"<script src="/.rheo/live.js" data-rheo-live></script>"#;
   ```

2. Update the doc comment above it: the tag is marked `data-rheo-live` so the
   client's morph-safety survey can skip rheo's own script. Keep it to the two
   or three lines it already is.

3. `cargo fmt`.

## Non-goals

- Do not change anything else in `tests/watch.rs`; the rest of both parity
  tests is unaffected.
- Do not add coverage for the morph/rehydrate behaviour itself — separate
  birds under the same label carry that.

## VERIFY

Against the rheo branch, not main:

```bash
cd ../rheo && jj edit feat/rehydrate-optimization   # or have that branch checked out
cd ../rheo-tests
RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 cargo test --test watch
```

All three tests in `tests/watch.rs` pass, including
`served_html_matches_compiled_html_for_rheo_head`.

## Landing

This has to be on a branch named `rheo/feat/rehydrate-optimization` for the
rheo PR's CI to pick it up — `rheo/.github/workflows/ci.yml` clones
`rheo-tests` at `rheo/<the rheo branch name>` when such a branch exists, else
`main`. Landing it on `rheo-tests` main alone would break main against rheo
main, which still emits the un-attributed tag until #179 merges.