---
id: rt-case-js-rehydrate-stamps-data-rheo-78ddda69
short-id: '78'
title: 'Case: js_rehydrate stamps data-rheo-rehydrate on a package script'
priority: 3
labels:
- feat-rehydrate-optimization
deps: []
closed: true
---
`rheo` PR #179 adds a package-manifest opt-in: a package that declares
`js_rehydrate = true` in its `[tool.rheo.<format>]` block gets its `<script>`
tags stamped with a bare `data-rheo-rehydrate` attribute, which is what the
dev-server client reads to decide a DOM morph is safe. rheo has unit coverage
for the DOM emission (`crates/core/src/html_dom.rs`) and for manifest parsing,
but nothing end-to-end: no test compiles a real project against a real package
and reads the attribute off the built HTML.

## Steps

1. Add a test to `tests/manifest_packages.rs`, modelled directly on the
   existing `e2e_auto_detected_manifest_package_assets` (line 76) — same
   `FakePackage` + `XDG_CACHE_HOME` + `rheo_cli_command` shape. Name it
   `e2e_js_rehydrate_stamps_the_script_tag`.

2. Stage two packages in the one cache so both branches are covered by one
   compile:
   - `@e2ens/rehydratepkg:0.1.0` — `typst.toml` with
     ```toml
     [tool.rheo.html]
     js_scripts = "pkg-script.js"
     js_rehydrate = true
     ```
   - `@e2ens/plainpkg:0.1.0` — same but with no `js_rehydrate` key at all.

   Give each a `lib.typ` and its own `pkg-script.js`.

3. The project's `main.typ` imports both; `rheo.toml` is the bare
   `version` + `formats = ["html"]` pair the neighbouring tests use (auto-detect
   is on by default).

4. Compile with `--html` and read `build/html/main.html`. Assert:
   - the `<script>` whose `src` ends in the rehydrate package's script carries
     `data-rheo-rehydrate`;
   - the plain package's `<script>` does not.

   Match on the tag, not on a bare `result.contains("data-rheo-rehydrate")` —
   the whole point is that the attribute lands on one tag and not the other.

5. `cargo fmt`.

## Non-goals

- No coverage of the client-side morph itself (`live-reload.js`,
  `window.__rheoRehydrate`) — that is browser behaviour this suite does not
  drive.
- No `js_module` interaction case; `module` and `rehydrate` are orthogonal and
  rheo unit-tests that orthogonality already.

## VERIFY

```bash
RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 \
  cargo test --test manifest_packages e2e_js_rehydrate
```

Passes against `rheo`'s `feat/rehydrate-optimization`, and fails against `rheo`
main (where no such attribute is emitted) — check both.

## Landing

Same branch as the rest of this label: `rheo/feat/rehydrate-optimization`, so
the rheo PR's CI pairs with it. It cannot go to `rheo-tests` main before #179
merges.