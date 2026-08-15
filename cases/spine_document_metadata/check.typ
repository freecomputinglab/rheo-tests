// Verifies that `#set document(...)` metadata of *other* vertebrae — written
// in several different shapes — is readable via `rheo-context().metadata-of`
// (rheo-meta-beacons-2o5), the Typst-native replacement for the retired
// pre-compile AST scan this fixture originally pinned. This vertebra itself
// sets no document metadata, so its entry carries only rheo's own fallback
// title (see the "empty-metadata cases" section below for why that's not an
// empty dict).
//
// `metadata-of` calls `query()` internally, so every call below must run
// inside `#context`.
//
// `title`/`description` come back from `metadata-of` as Typst CONTENT, not a
// flattened string -- the beacon captures live `document.title`, and Typst's
// `document` element's `title` field is content-typed (a bare string argument
// gets coerced to content). This is intentional (see rheo-anchor-display-text-4rx's
// notes: rendering rich title content is a feature, not a flattening bug), so
// title/description assertions below compare against content literals, not
// strings. `author`/`keywords`/`date` are unaffected -- Typst's `document`
// element types those as plain strings/arrays/datetime already, matching what
// the retired AST scan used to produce.
//
// Invisible (assert => none): hard-fails the compile on any regression, without
// altering the byte-for-byte HTML reference.

= Metadata checks

#context {
  let ctx = rheo-context()

  let by-handle(h) = (ctx.metadata-of)(h)

  // ── title shapes (content, not string -- see note above) ───────────────────
  // string-form title: Typst coerces it to content.
  assert(by-handle("str_title").title == [String Title], message: "str_title: " + repr(by-handle("str_title")))
  // bracket-content title with markup stays rich content, markup and all --
  // unlike the retired AST scan, which flattened it to plain text.
  assert(by-handle("bracket_title").title == [Bracket #emph[Em] Title], message: "bracket_title: " + repr(by-handle("bracket_title")))

  // ── keywords shapes ─────────────────────────────────────────────────────────
  // combined post: multi-element keyword array + string author + bracket title.
  let post = by-handle("post")
  assert(post.keywords == ("DiH", "MiT"), message: "post keywords: " + repr(post))
  // author is always an array, even for a single string author -- Typst
  // normalizes `document.author` to array<str> regardless of how it was set.
  assert(post.author == ("Jane",), message: "post author: " + repr(post))
  assert(post.title == [My Post], message: "post title: " + repr(post))
  // date comes back as the exact Typst datetime value that was set -- a
  // date-only `datetime(year:, month:, day:)` here, not padded with a
  // zeroed time-of-day (a date-only and a full Y-M-D-H-M-S datetime are
  // distinct Typst datetime kinds and don't compare equal).
  assert(post.date == datetime(year: 2025, month: 1, day: 2), message: "post date: " + repr(post))
  assert(post.date.display("[year]-[month]-[day]") == "2025-01-02", message: "post date display: " + repr(post.date.display("[year]-[month]-[day]")))
  // keywords given as a bare string is also normalized to an array, same as
  // author -- Typst's `document.keywords` is always array<str>.
  assert(by-handle("kw_string").keywords == ("solo-tag",), message: "kw_string: " + repr(by-handle("kw_string")))

  // ── author as an array of strings ───────────────────────────────────────────
  assert(by-handle("author_array").author == ("Jane", "John"), message: "author_array: " + repr(by-handle("author_array")))

  // ── date-only page: date plus rheo's own fallback title ─────────────────────
  // A vertebra whose sole authored `#set document(...)` arg is the date still
  // carries rheo's own fallback title too (see the no-authored-metadata note
  // below) -- `date` is the only AUTHORED key, not the only key present.
  let date-only = by-handle("date_only")
  assert(
    date-only == (title: [Date Only], date: datetime(year: 2025, month: 6, day: 1)),
    message: "date_only: " + repr(date-only),
  )

  // ── no-authored-metadata cases ──────────────────────────────────────────────
  // no `#set document(...)` at all: rheo's own path-derived fallback title is
  // still what `document.title` resolves to (rheo always passes SOME title
  // to its synthesized `#document(..., title: ...)[...]` wrapper), so the
  // beacon carries that fallback -- but nothing else, since rheo never
  // defaults author/description/keywords the way it does title.
  assert(by-handle("bare") == (title: [Bare]), message: "bare: " + repr(by-handle("bare")))
  // this vertebra itself sets no document metadata: same story, its own
  // fallback title ("Metadata checks"'s handle is "check").
  assert(by-handle("check") == (title: [Check]), message: "check: " + repr(by-handle("check")))

  // Note: unlike the old spine-flat/spine-tree `metadata` field this fixture
  // used to pin, `metadata-of` is a single bundle-wide query with no
  // tree-vs-flat distinction, so there is no separate "spine tree carries the
  // same metadata as spine-flat" case to assert here.
}
