// The one place the package is configured, applied by every vertebra (demo
// pattern from ../rookery/core/0.1.1/demo/rheo/content/lib.typ).
#import "@rookery/core:0.1.1": rookery

#let idea-page(id: none, note: (:), doc) = {
  let what = if id == none { [the rookery] } else { [#raw(id)] }
  html.elem("p", attrs: (class: "demo-minted-banner"), [Minted page for #what.])
  doc
}

#let demo(doc) = {
  show: rookery.with(
    idea-page-template: idea-page,
    index-page: true,
  )
  doc
}
