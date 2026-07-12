// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "error", "removed_is_rheo_helpers.typ", "is-rheo-epub", "│"
// @rheo:formats pdf
// The `is-rheo-epub()`/`is-rheo-html()`/`is-rheo-pdf()` helpers were removed
// (rheo PR #150). They were injected only into the synthetic main and were
// unreachable from authored vertebrae; format detection is now `target()`
// (e.g. `target() == "epub"`). One probe suffices — all three share the removal.
// Referencing it must now fail as an unknown identifier.

= Removed is-rheo helpers

#if is-rheo-epub() [EPUB] else [not EPUB]
