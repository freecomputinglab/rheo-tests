// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "label", "nonexistent", "does not exist"
// @rheo:formats html
// @rheo:description #link(<nonexistent>) errors at compile time (unlike old silent .typ links)

// The patterns above are Typst's own message text, which the CLI prints
// verbatim; moving diagnostic rendering out of rheo-core does not touch them.

= Dead Link Error Test

#link(<nonexistent>)[click here]
