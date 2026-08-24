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

// rheo-tests-date-matrix-vjw: date-resolution regression guards, cases 1-4.
// Cases 1 (literal), 2 (none/auto), and 3 (templated) are fully deterministic
// -- their vertebrae (date_literal, date_none, date_auto, date_templated) are
// folded into the same `rheo-metadata-all()` sweep as the pre-existing
// first/second/third vertebrae, and their resolved dates are pinned in
// meta.txt below like any other case here.
//
// Case 4 (date_today, `datetime.today()`) is NOT deterministic -- its
// resolved date is today's real date, which varies by build day. It is
// EXCLUDED from the `rheo-metadata-all()` sweep that feeds meta.txt (a
// ref-compared file), and instead only SHAPE-asserted below (present, and a
// real `datetime`, not `none`/`auto`) -- asserting a literal value, or
// writing one into a committed reference, would break on every future test
// run on a different day. `assert()` hard-fails the whole compile on a
// regression, so a passing compile IS this case's pass signal.
#context {
  let all-metadata = rheo-metadata-all()

  let today-entry = all-metadata.find(m => m.handle == "date_today")
  assert(today-entry != none, message: "date_today entry missing from rheo-metadata-all()")
  assert("date" in today-entry, message: "date_today: no date key: " + repr(today-entry))
  assert(
    type(today-entry.date) == datetime,
    message: "date_today: date not a datetime: " + repr(today-entry),
  )

  // Case 2 belt-and-suspenders: date_none and date_auto must be
  // indistinguishable -- both have no `date` key at all, and (since neither
  // authors anything else) the same full set of keys as each other.
  let none-entry = all-metadata.find(m => m.handle == "date_none")
  let auto-entry = all-metadata.find(m => m.handle == "date_auto")
  assert("date" not in none-entry, message: "date_none: date key present: " + repr(none-entry))
  assert("date" not in auto-entry, message: "date_auto: date key present: " + repr(auto-entry))
  assert(
    none-entry.keys() == auto-entry.keys(),
    message: "date_none vs date_auto: differing keys: " + repr(none-entry) + " vs " + repr(auto-entry),
  )

  // Case 1: literal date resolves to exactly the value that was set.
  let literal-entry = all-metadata.find(m => m.handle == "date_literal")
  assert(
    literal-entry.date == datetime(year: 2025, month: 1, day: 15),
    message: "date_literal: " + repr(literal-entry),
  )

  // Case 3: date set only inside `#show: book` (template.typ) still resolves
  // to the real templated value.
  let templated-entry = all-metadata.find(m => m.handle == "date_templated")
  assert(
    templated-entry.date == datetime(year: 2024, month: 11, day: 5),
    message: "date_templated: " + repr(templated-entry),
  )

  // Deterministic lines only -- excludes date_today (see comment above).
  let all-lines = all-metadata.filter(m => m.handle != "date_today").map(line).join("\n")

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
