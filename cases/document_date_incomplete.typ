// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "date is incomplete", "day", "document_date_incomplete.typ"
// @rheo:formats html
// @rheo:description Case 5 of rheo-tests-date-matrix-vjw: a partial `datetime(...)` (year + month, no day) passed to `#set document(date: ...)` hard-errors at Typst's own `datetime()` constructor -- confirmed empirically (both via the standalone `typst` CLI and this fixture), not assumed. The error is generic to `datetime()` itself (reproduces even for a bare `#let d = datetime(year:, month:)` unrelated to `document(date:)`), so it fires before rheo's beacon mechanism is ever reached.

#set document(date: datetime(year: 2025, month: 3))

= Document Date Incomplete Test

Content.
