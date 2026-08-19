// Title set inside a bounded top-level code block. The `@authored` handle
// anchor's display text is a live query of this vertebra's metadata beacon
// (crates/core/src/util/typst_source.rs's `HandleAnchor`), appended as an
// epilogue AFTER this file's own body -- i.e. after the closing brace below.
// A `set document(...)` inside a bounded `#{ }` block only extends to
// `#context` reads lexically nested within that same block (ordinary Typst
// scoping; see cases/metadata_show_and_code_block/via_code_block.typ for the
// same subtlety on a single vertebra), so the beacon sees no title here and
// the anchor falls back to the path-derived name ("Authored") -- even though
// this page's own `<title>` (Typst's separate, unscoped document-info
// resolution) is unaffected and correctly "Authored Title". See
// docs/limitations.md.
#{
  set document(title: [Authored Title])
}

= Authored page

This page's own title is set via a code block. Its handle anchor still shows
the path-derived fallback title, since a bounded code block's title is
invisible to rheo's metadata beacon.
