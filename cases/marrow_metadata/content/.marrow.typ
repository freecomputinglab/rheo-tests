// Targets the NOT-YET-implemented rheo-marrow-meta-d5v companion bead (see
// ../rheo .beads/issues.jsonl): widen `rheo-metadata(handle)` -- real today, but
// only reachable from a vertebra's own per-vertebra PRELUDE (rheo-meta-beacons-2o5)
// -- plus a brand-new `rheo-metadata-all()`, so BOTH become callable from MARROW
// scope too. Marrow is the synthesized bundle root where `.marrow.typ` is inlined,
// AFTER every #document block and OUTSIDE all of them (see
// crates/core/src/reticulate/spine.rs `bundle_source()` and
// crates/core/src/reticulate/bundle_source.rs `BundleSource::fmt` in ../rheo).
// Confirmed by reading crates/core/src/util/typst_source.rs's `MetadataHelper`/
// `MetadataBeacon`/`ContextBinding`: today NEITHER `rheo-metadata` nor
// `rheo-metadata-all` is injected into marrow's scope at all (only into each
// vertebra's own per-file prelude), so this file is expected to hard-fail Typst
// compilation with an "unknown variable" error at the FIRST of the two names
// referenced below -- `rheo-metadata-all`, since `all-lines` is built before
// `single-line`. See tests/harness.rs's `test_marrow_metadata` for the exact
// asserted failure text.
//
// ASSUMED future shape of `rheo-metadata-all()`, per rheo-marrow-meta-d5v's own
// bead text: "returning a list of (handle, path, title, ...) for each entry of
// sys.inputs.rheo-context.spine-flat, resolved through rheo-metadata" -- so we
// assume an array of per-vertebra dicts, each keeping its own `handle` (and
// `path`) plus whatever `rheo-metadata(handle)` resolves for that vertebra
// (title/author/description/keywords/date, filtered exactly like the
// single-handle helper already does). Sketch of the assumed implementation:
//   #let rheo-metadata-all() = sys.inputs.rheo-context.spine-flat.map(e => (
//     handle: e.handle, path: e.path, ..rheo-metadata(e.handle),
//   ))
//
// ASSUMED string-vs-content shape (an open design question for whoever
// implements rheo-marrow-meta-d5v, NOT settled by this fixture): the
// per-vertebra prelude's `rheo-metadata` returns `title`/`description` as
// CONTENT, not plain strings (confirmed in cases/spine_document_metadata/check.typ
// -- `document.title` is content-typed, and Typst has no `+` between `str` and
// `content`). Marrow-scope artifacts are almost always plain-text/XML output --
// an Atom feed, a sitemap, a search index, the exact examples rheo-marrow-meta-d5v
// itself gives -- where content is the wrong shape for string-building. We
// assume the marrow-scope forms hand back plain STRINGS for `title`/`author`/
// `description`/`keywords` instead (dates stay real `datetime` values, same as
// today, since `.display(...)` is still the useful API for those). This
// assumption does not affect this test's outcome: the call never actually
// executes today, since compilation fails at the unknown-variable error above
// before any of this code runs.
//
// CONFIRMED (not assumed), from cases/spine_document_metadata: rheo ALWAYS
// resolves SOME title for every vertebra -- even one with NO `#set
// document(...)` at all still gets rheo's own path-derived fallback title
// baked into its synthesized `#document(..., title: [...])[...]` wrapper. So
// the "third" vertebra below (no `#set document(...)`) is NOT actually missing
// a title in practice -- only `date` (and `author`/`description`/`keywords`)
// are genuinely absent for it. The `"title" in m` branch below is kept anyway
// since -all's exact contract isn't settled by any landed code, and a future
// reader should not assume title is unconditionally present from -all alone
// without checking.

#let line(m) = {
  let title = if "title" in m { m.title } else { "-" }
  let date = if "date" in m { m.date.display("[year]-[month]-[day]") } else { "-" }
  m.handle + ": title=" + title + " date=" + date
}

#let all-lines = rheo-metadata-all().map(line).join("\n")

// Single-handle form, exercised separately so this case covers BOTH forms in
// scope for rheo-marrow-meta-d5v, not just -all(). "second" has a title but no
// date, so this also spot-checks that the single-handle helper's own
// absent-date filtering (rheo-meta-beacons-2o5's `MetadataHelper` drops
// none/auto/empty-array values) still reads correctly through the widened
// marrow-scope form.
#let second = rheo-metadata("second")
#let single-date = if "date" in second { second.date.display("[year]-[month]-[day]") } else { "-" }
#let single-line = "single:second: title=" + second.title + " date=" + single-date

#asset("meta.txt", all-lines + "\n" + single-line + "\n")
