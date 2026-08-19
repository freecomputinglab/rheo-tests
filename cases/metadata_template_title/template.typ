// Shared template module living OUTSIDE content_dir, so it is never scanned
// as its own vertebra. `book` sets document metadata internally via `set
// document(...)`; a vertebra that applies it with `#show: book` gets a real
// compiled title Typst can see, and (unlike a bounded `#{ }` code block --
// see cases/metadata_show_and_code_block/via_code_block.typ) this form has
// no closing brace of its own, so it stays in scope for rheo's metadata
// beacon too: `rheo-metadata`/`metadata-of` correctly read it. What it is
// NOT visible to is `rheo-context().spine-flat`'s title, which is always
// path-derived regardless of authoring form.
#let book(doc) = {
  set document(title: [Templated Title From Book])
  doc
}
