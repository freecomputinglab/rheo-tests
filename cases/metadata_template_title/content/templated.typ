#import "/template.typ": book
#show: book

= Templated Chapter

Own compiled title (native Typst, read live via context): #context [#document.title]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title for this vertebra, as seen via rheo-context().spine-flat
  (always path-derived, never read from document metadata in any form):
  #entry.title]
}
