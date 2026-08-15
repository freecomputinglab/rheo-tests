// Non-literal `title` RHS: a function call. Typst evaluates it fine (compiled
// title is "X"), but rheo's scan drops any non-literal argument value
// silently rather than evaluating it (docs/limitations.md:53).
#set document(title: upper("x"))

= Upper call

Own compiled title: #context [#document.title]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title (via rheo-context): #entry.title]
}
