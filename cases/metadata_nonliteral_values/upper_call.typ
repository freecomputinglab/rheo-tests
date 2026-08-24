// Non-literal `title` RHS: a function call. Typst evaluates it fine (compiled
// title is "X"). rheo-context().spine-flat's title is always path-derived,
// never read from `#set document(...)` in any form -- so this vertebra's
// spine entry is "Upper Call" regardless. The real title is reachable via
// `rheo-metadata`/`metadata-of` instead (see cases/spine_document_metadata).
#set document(title: upper("x"))

= Upper call

Own compiled title: #context [#document.title]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title (via rheo-context): #entry.title]
}
