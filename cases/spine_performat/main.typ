#set document(title: [Main])

= Main

// Per-format spine override: HTML has no `[html.spine]`, so it falls back
// to the global `[spine]` (title "All Formats", no exclude) and its scan
// includes web-only.typ. PDF's `[pdf.spine]` sets its own `title` AND
// `exclude`, so the PDF-only scan drops web-only.typ. Each spine field is
// resolved independently per plugin, falling back to the matching global
// `[spine]` field when unset on the per-format table (see
// crates/core/src/build.rs Build::compile_spine) — not the whole
// `[pdf.spine]` table replacing the global one wholesale.

#context {
  let handles = rheo-context().spine-flat.map(v => v.handle)
  if target() == "paged" {
    assert(
      handles == ("main",),
      message: "PDF spine should omit web-only.typ via [pdf.spine] exclude, got: " + handles.join(", "),
    )
  } else {
    assert(
      handles == ("main", "web-only"),
      message: "HTML spine should include web-only.typ (no [html.spine] exclude), got: " + handles.join(", "),
    )
  }
}

Spine-flat handles: #rheo-context().spine-flat.map(v => v.handle).join(", ")

Handle: #rheo-context().handle
