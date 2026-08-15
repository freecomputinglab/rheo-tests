// `set document(...)` inside a `#show: doc => { ... }` rule -- Typst applies
// document set rules regardless of nesting, so the compiled title is
// "FromShow", but rheo's static scan only reads a literal top-level
// `#set document(...)` statement, so it never sees this one
// (docs/limitations.md:22, "Inside `#show: doc => { set document(...); doc }`"
// -> "No").
#show: doc => {
  set document(title: [FromShow])
  doc
}

= Via show rule

Own compiled title: #context [#document.title]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title (via rheo-context): #entry.title]
}
