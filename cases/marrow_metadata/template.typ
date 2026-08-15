// Shared template module living OUTSIDE content_dir (case 3 of
// rheo-tests-date-matrix-vjw, modeled on cases/metadata_template_title's
// `book`): sets `document(date: ...)` internally, so a vertebra applying it
// via `#show: book` never writes a literal `#set document(date: ...)` of its
// own. The beacon must still resolve the real templated date, the same way
// it already resolves templated titles.
#let book(doc) = {
  set document(
    title: [Templated Date],
    date: datetime(year: 2024, month: 11, day: 5),
  )
  doc
}
