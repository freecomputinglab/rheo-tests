// A marrow-minted page whose output path does NOT end in `.html`. It is a
// document, not an `asset()`, so it belongs in the transclusion source map --
// which the dev-server path used to filter by extension while the on-disk path
// did not.
#rheo-document("minted.xhtml", handle: "minted", title: [Minted])[
  #html.elem("main", [Transcluded from a non-html extension.])
]

#asset(
  "out.xml",
  "<?xml version=\"1.0\"?>\n<wrapper><rheo-content page=\"minted.xhtml\"/></wrapper>\n",
)
