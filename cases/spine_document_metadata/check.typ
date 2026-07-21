// Verifies that `#set document(...)` metadata of *other* vertebrae — written in
// several different shapes — surfaces on the rheo-context spine. This vertebra
// itself sets no document metadata, so its own entry is `(:)`.
//
// Invisible (assert => none): hard-fails the compile on any regression, without
// altering the byte-for-byte HTML reference.

= Metadata checks

#{
  let ctx = rheo-context()

  let by-handle(h) = {
    let matches = ctx.spine-flat.filter(v => v.handle == h)
    assert(matches.len() == 1, message: "expected one '" + h + "' entry, got " + str(matches.len()))
    matches.first().metadata
  }

  // ── title shapes ──────────────────────────────────────────────────────────
  // string-form title.
  assert(by-handle("str_title").title == "String Title", message: "str_title: " + repr(by-handle("str_title")))
  // bracket-content title with markup flattens to plain text.
  assert(by-handle("bracket_title").title == "Bracket Em Title", message: "bracket_title: " + repr(by-handle("bracket_title")))

  // ── keywords shapes ─────────────────────────────────────────────────────────
  // combined post: multi-element keyword array + string author + bracket title.
  let post = by-handle("post")
  assert(post.keywords == ("DiH", "MiT"), message: "post keywords: " + repr(post))
  assert(post.author == "Jane", message: "post author: " + repr(post))
  assert(post.title == "My Post", message: "post title: " + repr(post))
  assert("date" not in post, message: "post date must not be harvested: " + repr(post.keys()))
  // keywords given as a bare string round-trips as a string, not an array.
  assert(by-handle("kw_string").keywords == "solo-tag", message: "kw_string: " + repr(by-handle("kw_string")))

  // ── author as an array of strings ───────────────────────────────────────────
  assert(by-handle("author_array").author == ("Jane", "John"), message: "author_array: " + repr(by-handle("author_array")))

  // ── empty-metadata cases ────────────────────────────────────────────────────
  // date-only: `datetime(...)` is a non-literal call, so nothing is harvested.
  assert(by-handle("date_only") == (:), message: "date_only must be empty: " + repr(by-handle("date_only")))
  // no `#set document(...)` at all.
  assert(by-handle("bare") == (:), message: "bare must be empty: " + repr(by-handle("bare")))
  // this vertebra itself sets no document metadata.
  assert(by-handle("check") == (:), message: "check must be empty: " + repr(by-handle("check")))

  // ── the recursive spine tree carries the same metadata as spine-flat ─────────
  let find-node(nodes, h) = {
    for n in nodes {
      if n.handle == h { return n }
      let sub = find-node(n.children, h)
      if sub != none { return sub }
    }
    none
  }
  let post-node = find-node(ctx.spine, "post")
  assert(post-node != none, message: "post node missing from spine tree")
  assert(post-node.metadata == post, message: "spine-tree post metadata must match spine-flat: " + repr(post-node.metadata))
}
