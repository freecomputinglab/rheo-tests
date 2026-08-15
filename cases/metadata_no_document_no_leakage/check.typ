// Invisible (assert => none), modeled on cases/spine_document_metadata/check.typ.
//
// (i) and (ii) below already hold true today via rheo's existing pre-compile
// static scan / filename-fallback logic (docs/limitations.md) -- if they ever
// regressed, the reported Typst error would be an assertion failure, not a
// "key not found" error. (iii) hard-fails the WHOLE compile today because
// `metadata-of` is not a real key on `rheo-context()` yet (see
// rheo/docs/spikes/typst-native-metadata.md). Since these run in one
// sequential code block, an error citing `metadata-of` (rather than an
// assertion message) is itself proof (i) and (ii) passed first.

#{
  let ctx = rheo-context()

  // (i) no `#set document(...)` at all -> title falls back to the
  // path-derived name.
  let bare = ctx.spine-flat.filter(v => v.handle == "bare").first()
  assert(bare.title == "Bare", message: "bare title fallback: " + repr(bare.title))

  // (ii) no leakage from the sibling vertebra's title.
  assert(bare.title != "Sibling Title", message: "bare title leaked sibling's: " + repr(bare.title))

  // (iii) NOT YET IMPLEMENTED: metadata-of should return an empty dict for a
  // handle with no authored metadata, mirroring spine-flat's own empty-dict
  // convention for a bare vertebra (see cases/spine_document_metadata/check.typ,
  // "bare must be empty"). This line hard-fails today's compile.
  assert((rheo-context().metadata-of)("bare") == (:), message: "expected empty dict for bare handle")
}

= Metadata check
