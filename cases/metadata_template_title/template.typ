// Shared template module living OUTSIDE content_dir, so it is never scanned
// as its own vertebra. `book` sets document metadata internally via `set
// document(...)`; a vertebra that applies it with `#show: book` gets a real
// compiled title Typst can see, but rheo's pre-compile static AST scan
// (crates/core/src/parser/document_metadata.rs) only reads a literal
// top-level `#set document(...)` in the vertebra's OWN source text, so it
// cannot see this at all (docs/limitations.md:21, "In an imported module fn,
// applied via `#show: book`" -> "No").
#let book(doc) = {
  set document(title: [Templated Title From Book])
  doc
}
