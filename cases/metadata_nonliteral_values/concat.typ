// Non-literal `title` RHS: string concatenation. Compiled title is "ab".
// rheo-context().spine-flat's title is always path-derived, never read from
// `#set document(...)` in any form -- so this vertebra's spine entry is
// "Concat" regardless. The real title is reachable via
// `rheo-metadata`/`metadata-of` instead (see cases/spine_document_metadata).
#set document(title: "a" + "b")

= Concat

Own compiled title: #context [#document.title]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title (via rheo-context): #entry.title]
}
