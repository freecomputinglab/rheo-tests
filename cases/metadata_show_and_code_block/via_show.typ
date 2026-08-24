// `set document(...)` inside a `#show: doc => { ... }` rule -- Typst applies
// document set rules regardless of nesting, so the compiled title is
// "FromShow". rheo-context().spine-flat's title is always path-derived,
// never read from `#set document(...)` in any form -- so this vertebra's
// spine entry is "Via Show" regardless. The real title is reachable via
// `rheo-metadata`/`metadata-of` instead (see cases/spine_document_metadata),
// unaffected by this authoring form -- unlike the code-block form next door
// (via_code_block.typ), a `#show:` rule has no closing brace of its own, so
// it stays in scope for rheo's metadata beacon too.
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
