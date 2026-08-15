// Exercises rheo-marrow-meta-d5v (../rheo, landed): `rheo-metadata(handle)`
// (rheo-meta-beacons-2o5, originally per-vertebra-prelude-only) and a new
// `rheo-metadata-all()` companion are now BOTH also injected into the
// synthesized bundle root, where `.marrow.typ` is inlined -- verified against
// the real landed implementation in crates/core/src/world.rs and
// crates/core/src/util/typst_source.rs's `TypstStmt::MetadataAllHelper`.
//
// Both calls require `#context` at the call site, same requirement
// `rheo-metadata` already had per-vertebra (they call `query()` internally) --
// this bead only widened WHERE the reader is in scope, not what calling it
// requires. An earlier version of this fixture omitted the `#context` wrapper
// and hit "can only be used when context is known"; fixed below.
//
// CONFIRMED (not assumed, per a direct check of Typst's own `str()`): title
// comes back as CONTENT, not a plain string -- `document.title` is
// content-typed, and Typst's `str()` does not accept content at all (a hard
// compile error, "expected integer, float, decimal, version, bytes, label,
// type, or string, found content"). So a plain-text asset like this one CANNOT
// string-concatenate `.title` directly; `repr(m.title)` is used instead,
// which renders as bracket-notation source syntax (e.g. `[Second]`) -- fine
// for this test's purpose of proving the metadata IS resolvable and usable
// from marrow scope, not a claim about the ideal production format for a
// real feed/sitemap (which would need its own content-to-plain-text
// convention, an open question outside this bead's scope).
//
// CONFIRMED, from cases/spine_document_metadata: rheo ALWAYS resolves SOME
// title for every vertebra -- even one with NO `#set document(...)` at all
// still gets rheo's own path-derived fallback title baked into its
// synthesized `#document(..., title: [...])[...]` wrapper. So the "third"
// vertebra below (no `#set document(...)`) is NOT missing a title in
// practice -- only `date`/`author`/`description`/`keywords` are genuinely
// absent for it. The `"title" in m` branch is kept anyway since it's still
// correct and defensive.

#let line(m) = {
  let title = if "title" in m { repr(m.title) } else { "-" }
  let date = if "date" in m { m.date.display("[year]-[month]-[day]") } else { "-" }
  m.handle + ": title=" + title + " date=" + date
}

#context {
  let all-lines = rheo-metadata-all().map(line).join("\n")

  // Single-handle form, exercised separately so this case covers BOTH forms
  // in scope for rheo-marrow-meta-d5v, not just -all(). "second" has a title
  // but no date, so this also spot-checks that the single-handle helper's
  // own absent-date filtering (rheo-meta-beacons-2o5's `MetadataHelper` drops
  // none/auto/empty-array values) still reads correctly through the widened
  // marrow-scope form.
  let second = rheo-metadata("second")
  let single-date = if "date" in second { second.date.display("[year]-[month]-[day]") } else { "-" }
  let single-line = "single:second: title=" + repr(second.title) + " date=" + single-date

  asset("meta.txt", all-lines + "\n" + single-line + "\n")
}
