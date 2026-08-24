= A

// Reads chapters:b's metadata from a DIFFERENT vertebra via the NOT-YET
// implemented `metadata-of` closure on rheo-context() (see
// rheo/docs/spikes/typst-native-metadata.md Q1 for the bundle-wide query
// design this is meant to expose). `metadata-of` is not a real key on
// `rheo-context()` today, so this is expected to hard-fail Typst compilation
// with a "dictionary does not contain key" style error.
Reading b's title via metadata-of: #context (rheo-context().metadata-of)("chapters:b").title
