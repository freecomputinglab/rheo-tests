// Invisible (assert => none), modeled on cases/spine_document_metadata/check.typ.
//
// (i) and (ii) below already hold true today via rheo's existing pre-compile
// static scan / filename-fallback logic (docs/limitations.md). (iii) calls
// `metadata-of`, which internally calls `query()` and so requires a
// `#context` scope to run at all (Typst hard-errors "can only be used when
// context is known" otherwise) -- hence the whole check runs inside
// `#context`.
//
// (iii)'s expectation is NOT an empty dict. rheo always passes a title
// argument to its synthesized `#document(..., title: [...])[...]` wrapper
// (the path-derived fallback when nothing overrides it), and `document.title`
// -- what the beacon captures -- reflects that wrapper default when no
// `#set document(...)` overrides it. So a bare vertebra's beacon legitimately
// carries rheo's own fallback title; only `author`/`description`/`keywords`
// (which rheo never defaults) are actually absent. See
// rheo-anchor-display-text-4rx's own notes on this same beacon behavior.

#context {
  let ctx = rheo-context()

  // (i) no `#set document(...)` at all -> title falls back to the
  // path-derived name.
  let bare = ctx.spine-flat.filter(v => v.handle == "bare").first()
  assert(bare.title == "Bare", message: "bare title fallback: " + repr(bare.title))

  // (ii) no leakage from the sibling vertebra's title.
  assert(bare.title != "Sibling Title", message: "bare title leaked sibling's: " + repr(bare.title))

  // (iii) metadata-of carries rheo's own path-derived fallback title (as
  // content, not a flattened string -- see cases/spine_document_metadata's
  // title-shape assertions for that distinction) and nothing else: no
  // author/description/keywords, since rheo never defaults those.
  assert(
    (rheo-context().metadata-of)("bare") == (title: [Bare]),
    message: "expected only rheo's fallback title for bare handle: " + repr((rheo-context().metadata-of)("bare")),
  )
}

= Metadata check
