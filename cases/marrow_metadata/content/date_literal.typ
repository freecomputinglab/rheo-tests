#set document(title: [Date Literal], date: datetime(year: 2025, month: 1, day: 15))

= Date Literal

Vertebra whose `#set document(...)` date is a literal `datetime(year:, month:,
day:)` -- regression guard for rheo-tests-date-matrix-vjw case 1: a literal
date must resolve to exactly that value, unchanged, via the beacon mechanism.
