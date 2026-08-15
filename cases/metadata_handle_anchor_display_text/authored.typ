// Title set via a top-level code block -- invisible to rheo's pre-compile
// static scan (docs/limitations.md:24), same mechanism as
// cases/metadata_show_and_code_block/via_code_block.typ. The synthesized
// `@authored` handle anchor is a literal `#figure([<rheo's scanned title>],
// kind: "rheo-handle", ...)` baked in Rust at bundle-source-synthesis time
// (crates/core/src/util/typst_source.rs's `HandleAnchor`), so today it shows
// the filename-derived fallback ("Authored") instead of "Authored Title".
#{
  set document(title: [Authored Title])
}

= Authored page

This page's title is set via a code block, invisible to rheo's pre-compile
scan.
