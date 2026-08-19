// `set document(...)` inside a top-level BOUNDED code block. The compiled
// document's title (DocumentInfo, what feeds the HTML <title>/PDF Info dict)
// is "FromCodeBlock" -- Typst's realize pass collects `set document(...)`
// wherever it occurs in the tree, and that collection is unscoped.
//
// Note the context read below is INSIDE the same `{ }` block on purpose: a
// standalone code block's `set` only extends its style to `#context` reads
// lexically nested within that same block (ordinary block scoping) -- a
// `#context document.title` read placed AFTER the closing brace would NOT
// see "FromCodeBlock", even though the final compiled DocumentInfo/<title>
// above is unaffected and still resolves correctly regardless of where the
// style is scoped. That's a real, permanent Typst subtlety, not a rheo gap --
// but it DOES have a real consequence for rheo: rheo's metadata beacon (what
// `rheo-metadata`/`metadata-of`/`@handle` anchors read) is exactly such an
// after-the-brace `#context document.title` read, appended once per vertebra
// after its own body. So a title set here, inside this bounded block, is
// invisible to any OTHER vertebra's `metadata-of` call on this one, and to
// any `@handle` anchor pointing at it -- see
// cases/metadata_handle_anchor_display_text/authored.typ and
// docs/limitations.md.
#{
  set document(title: [FromCodeBlock])
  context [Own compiled title (read inside the same code block): #document.title]
}

= Via code block

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  // rheo-context().spine-flat's title is always path-derived, never read
  // from `#set document(...)` in any form -- so this entry's title is "Via
  // Code Block" regardless of the compiled title above. The real title is
  // reachable via `rheo-metadata`/`metadata-of` instead (see
  // cases/spine_document_metadata), though not from a read inside this same
  // bounded block's own beacon, per the note above.
  [Spine title (via rheo-context): #entry.title]
}
