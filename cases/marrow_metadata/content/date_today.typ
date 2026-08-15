#set document(title: [Date Today], date: datetime.today())

= Date Today

`date: datetime.today()` -- case 4 of rheo-tests-date-matrix-vjw. This is a
DELIBERATE, ACCEPTED behavior change from the old (removed) pre-compile AST
scan, which rejected `datetime.today()` outright (couldn't resolve it
statically). The beacon mechanism reads `document.date` AFTER Typst evaluates
it, so it resolves to a REAL, build-day-varying date. `.marrow.typ` asserts
only the SHAPE of this vertebra's resolved date (present, and a real
`datetime`, not `none`/`auto`) -- never a literal value, and it is excluded
from the deterministic `meta.txt` asset compared against a committed
reference, since committing "today's date" would break on every future test
run on a different day. Authors needing a stable syndication timestamp should
use a literal `datetime(...)` instead of `datetime.today()`.
