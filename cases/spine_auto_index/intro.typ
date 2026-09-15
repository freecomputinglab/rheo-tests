#set document(title: [Introduction])

= Introduction

Handle: #rheo-context().handle

// Explicit assertions on the `synthesized` flag: the minted guide/index.typ
// must be marked, the on-disk vertebrae must not be. Invisible (assert =>
// none), so the HTML reference stays byte-identical.
#{
  let ctx = rheo-context()

  assert(ctx.spine-flat.len() == 4, message: "expected 4 vertebrae, got " + str(ctx.spine-flat.len()))

  for v in ctx.spine-flat {
    assert(v.keys().sorted() == ("handle", "path", "synthesized", "title"), message: "spine-flat entry keys: " + repr(v.keys()))
  }

  let minted = ctx.spine-flat.filter(v => v.path == "guide/index.typ")
  assert(minted.len() == 1, message: "expected exactly one minted guide/index.typ entry, got " + str(minted.len()))
  assert(minted.first().synthesized == true, message: "minted guide/index.typ must have synthesized == true")

  for p in ("intro.typ", "guide/a.typ", "guide/b.typ") {
    let entries = ctx.spine-flat.filter(v => v.path == p)
    assert(entries.len() == 1, message: "expected exactly one entry for " + p + ", got " + str(entries.len()))
    assert(entries.first().synthesized == false, message: p + " must have synthesized == false")
  }

  let check-node(n) = {
    assert(n.keys().sorted() == ("children", "handle", "path", "synthesized", "title"), message: "spine node keys: " + repr(n.keys()))
    for c in n.children { check-node(c) }
  }
  for n in ctx.spine { check-node(n) }
}
