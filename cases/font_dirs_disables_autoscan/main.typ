// @rheo:test
// @rheo:warn-patterns "loading fonts from 1 additional directories"
// @rheo:description rheo-tests-5ag: a non-empty top-level `font_dirs` silently disables the `fonts/` autoscan (crates/core/src/build.rs resolve_font_dirs) -- this project has BOTH a `fonts/` dir and `font_dirs = ["other_fonts"]`, so only `other_fonts` should be loaded (count 1, not 2).

= Font Dirs Disables Autoscan

Content.
