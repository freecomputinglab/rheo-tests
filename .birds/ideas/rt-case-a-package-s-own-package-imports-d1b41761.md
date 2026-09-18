---
id: rt-case-a-package-s-own-package-imports-d1b41761
short-id: d1
title: 'Case: a package''s own package imports contribute assets'
priority: 2
labels:
- feat-rehydrate-optimization
deps: []
closed: false
---
`rheo` PR #179 adds `scan_transitive_package_imports` in
`crates/core/src/packages/manifest.rs`: asset collection now follows an
imported package's *own* package imports to a fixed point, so a package's
dependency contributes its CSS/JS without the consuming project importing it
directly. Order is specified — the project's own specs first, encounter order
otherwise, because asset injection order is script execution order on the page.

No integration coverage exists for this. The rheo-side tests are unit tests over
the scan function; nothing compiles a project whose package pulls in a second
package and checks the second package's assets actually land in the build.

## Steps

1. Add a test to `tests/manifest_packages.rs`, modelled on
   `e2e_auto_detected_manifest_package_assets` (line 76). Name it
   `e2e_transitive_package_assets_are_collected`.

2. Stage two packages in the one fake cache:
   - `@e2ens/leafpkg:0.1.0` — `typst.toml` with a `[tool.rheo.html]` block
     declaring `css_stylesheet = "leaf.css"` and `js_scripts = "leaf.js"`;
     a `lib.typ` that imports nothing.
   - `@e2ens/rootpkg:0.1.0` — its own `[tool.rheo.html]` assets
     (`root.css` / `root.js`), and a `lib.typ` whose first line is
     `#import "@e2ens/leafpkg:0.1.0": *`.

3. The project's `main.typ` imports **only** `@e2ens/rootpkg:0.1.0`.
   `rheo.toml` is the bare `version` + `formats = ["html"]` pair (auto-detect
   on by default).

4. Compile with `--html`, then assert:
   - `leaf.css` and `leaf.js` exist under `build/html/` — the transitive
     package's assets were collected even though the project never named it;
   - `build/html/main.html` references both the root and the leaf script;
   - **order**: the root package's `<script>` appears before the leaf's in the
     serialized HTML. The project's own specs come first and encounter order is
     preserved, so a transitively-reached package must not jump ahead of one the
     project imported directly. Find both `src` substrings and compare their
     byte offsets.

5. `cargo fmt`.

## Non-goals

- No cycle case (two packages importing each other) — rheo unit-tests the
  `seen` guard that terminates it; an integration case buys nothing.
- No case for a transitive spec that fails to resolve; that path only logs.

## VERIFY

```bash
RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 \
  cargo test --test manifest_packages e2e_transitive_package_assets
```

Passes against `rheo`'s `feat/rehydrate-optimization`, and fails against `rheo`
main (where `leaf.css`/`leaf.js` never reach the build) — check both.

## Landing

Branch `rheo/feat/rehydrate-optimization`, same as the rest of this label.