// Originally a regression guard against a specific historical bug: the old
// pre-compile raw-text scan could grab a link body ("RiffRaff") as a
// vertebra's title instead of its real `#set document(title: ...)` value.
// Since rheo-delete-metadata-scan-t4f, that whole scan is gone -- spine
// title (`rheo-context().spine-flat[].title`) is now purely path-derived
// (`Vertebra.title` never reads `#set document(...)` at all, string-form or
// otherwise), so the old bug class is categorically impossible: nothing
// reads document body content, link or otherwise, when computing spine
// title. `post`'s title below is therefore its OWN path-derived name
// ("Post"), not the literal "My Post" it authors via `#set document(...)` --
// a real per-vertebra title (rich content, not string) is available via
// `rheo-metadata`/`metadata-of` instead (see cases/spine_document_metadata).
//
// Invisible (assert => none): hard-fails the compile without altering the
// byte-for-byte HTML reference.

= Title checks

#{
  let ctx = rheo-context()

  let entry(h) = {
    let matches = ctx.spine-flat.filter(v => v.handle == h)
    assert(matches.len() == 1, message: "expected one '" + h + "' entry, got " + str(matches.len()))
    matches.first()
  }

  // Path-derived, not the authored "My Post" -- see comment above.
  let post = entry("post")
  assert(post.title == "Post", message: "post spine title: " + repr(post.title))

  // A vertebra with no `#set document(...)` also falls back to the filename,
  // title-cased -- same code path, so this is unaffected either way.
  assert(entry("plain_file").title == "Plain File", message: "plain_file title: " + repr(entry("plain_file").title))
}
