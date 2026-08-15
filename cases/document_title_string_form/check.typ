// Regression guard: a string-form document-title set rule must drive the spine
// title, not the first link body found by the old raw-text scan.
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

  // The bug: the old scan returned the link text ("RiffRaff") as the title.
  // Correct behaviour sources the spine title from the harvested metadata.
  let post = entry("post")
  assert(post.title == "My Post", message: "post spine title: " + repr(post.title))

  // A vertebra with no `#set document(...)` still falls back to the filename,
  // title-cased.
  assert(entry("plain_file").title == "Plain File", message: "plain_file title: " + repr(entry("plain_file").title))
}
