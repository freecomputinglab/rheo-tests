// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "error", "removed_rheo_target_helper.typ", "rheo-target", "│"
// @rheo:formats pdf
// The `rheo-target()` helper was removed (rheo PR #150) — it was redundant with
// the injected `target()` polyfill. Authored files must use `target()` directly.
// Referencing it must now fail as an unknown identifier.

= Removed rheo-target() helper

Current format: #rheo-target()
