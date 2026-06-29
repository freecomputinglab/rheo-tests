// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "label", "nonexistent", "does not exist"
// @rheo:formats html
// @rheo:description #link(<nonexistent>) errors at compile time (unlike old silent .typ links)

= Dead Link Error Test

#link(<nonexistent>)[click here]
