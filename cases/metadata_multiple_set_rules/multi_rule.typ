// Two separate `#set document(...)` rules, each setting a different key.
// Typst accumulates both (document set rules are independent per field), so
// the compiled title AND author are both correct. rheo's own metadata-of
// beacon reads resolved DocumentInfo (via a #context query), so it also sees
// both — unlike the retired pre-compile AST scan, which read only the first
// `#set document(...)` rule it found in source order (docs/limitations.md:50-52)
// and so never surfaced `author` (set by the second rule) at all.
#set document(title: [Multi Rule Title])
#set document(author: "Multi Author")

= Multi rule

Own compiled title: #context [#document.title]

Own compiled author: #context [#document.author]

#context [Metadata via rheo-context().metadata-of: #repr((rheo-context().metadata-of)(rheo-context().handle))]
