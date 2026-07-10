// A title with a double quote must round-trip through rheo-context.spine —
// the injected `#let rheo-context` literal has to escape it (util::typst_literal).
#set document(title: [She said "hello"])

= Quoted
