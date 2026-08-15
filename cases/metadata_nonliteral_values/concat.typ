// Non-literal `title` RHS: string concatenation. Compiled title is "ab", but
// rheo's scan drops non-literal argument values silently
// (docs/limitations.md:53, `title: "a" + "b"` is explicitly named as an
// example that yields no harvested value).
#set document(title: "a" + "b")

= Concat

Own compiled title: #context [#document.title]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title (via rheo-context): #entry.title]
}
