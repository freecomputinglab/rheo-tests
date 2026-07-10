// @rheo:test
// @rheo:expect error
// @rheo:error-patterns "rheo-bad must be a string"
// @rheo:formats html
// @rheo:description non-string rheo-* variable causes compilation failure

#let rheo-bad = 42

= Test

Content.
