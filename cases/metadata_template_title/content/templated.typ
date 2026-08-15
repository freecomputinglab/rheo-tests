#import "/template.typ": book
#show: book

= Templated Chapter

Own compiled title (native Typst, read live via context -- unaffected by
rheo's separate pre-compile scan): #context [#document.title]

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title for this vertebra, as seen via rheo-context().spine-flat
  (rheo's pre-compile static scan): #entry.title]
}
