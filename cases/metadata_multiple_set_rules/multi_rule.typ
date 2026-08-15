// Two separate `#set document(...)` rules, each setting a different key.
// Typst accumulates both (document set rules are independent per field), so
// the compiled title AND author are both correct. rheo's scan reads only the
// first `#set document(...)` rule it finds in source order
// (docs/limitations.md:50-52), so `author` (set by the second rule) never
// makes it into rheo-context().spine-flat's metadata dict at all.
#set document(title: [Multi Rule Title])
#set document(author: "Multi Author")

= Multi rule

Own compiled title: #context [#document.title]

Own compiled author: #context [#document.author]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine metadata (via rheo-context): #repr(entry.metadata)]
}
