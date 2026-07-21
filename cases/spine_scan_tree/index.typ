#set document(title: [Home])

= Spine Tree

// Recursive walk of the full spine TREE (rheo-context().spine, not spine-flat),
// printing depth/title/handle/path/clickable for every node so the rendered
// HTML pins the exact tree shape produced by the zero-config directory scan.
#let walk(nodes, depth) = {
  for node in nodes [
    - depth=#depth title=#node.title handle=#(if node.handle == none { "none" } else { node.handle }) path=#(if node.path == none { "none" } else { node.path }) clickable=#(if node.handle == none { "false" } else { "true" })
    #walk(node.children, depth + 1)
  ]
}

#walk(rheo-context().spine, 0)

== Assertions

These hard-fail the build (rather than silently baking a wrong shape into the
reference) if the zero-config directory-scan spine ever changes shape.

#{
  let root = rheo-context().spine

  // `guide/` has a landing page (guide/index.typ) => clickable node whose own
  // handle/path are the directory's, not a separate "index" child.
  let guide = root.find(n => n.handle == "guide")
  assert(guide != none, message: "guide node not found at top level")
  assert(guide.path == "guide/index.typ", message: "guide landing path mismatch")
  assert(guide.children.len() == 3, message: "guide should have 3 children: a, b, deep")
  assert(guide.children.at(0).handle == "guide:a", message: "guide child 0 should be guide:a")
  assert(guide.children.at(1).handle == "guide:b", message: "guide child 1 should be guide:b")

  // `guide/deep/` has no landing page => non-clickable group node.
  let deep = guide.children.at(2)
  assert(deep.handle == none, message: "guide/deep should be a group node (handle: none)")
  assert(deep.path == none, message: "guide/deep should be a group node (path: none)")
  assert(deep.title == "Deep", message: "guide/deep group title should be 'Deep'")
  assert(deep.children.len() == 1, message: "guide/deep should have exactly one child (x)")
  assert(deep.children.at(0).handle == "guide:deep:x", message: "guide/deep child should be guide:deep:x")

  // `01-basics/` has no landing page => non-clickable group node whose title
  // strips the numeric prefix and Title Cases the rest, but whose children's
  // handles keep the numeric prefix (it's only stripped from the DISPLAYED title).
  let basics = root.find(n => n.handle == none and n.title == "Basics")
  assert(basics != none, message: "01-basics group node not found (title should prettify to 'Basics')")
  assert(basics.path == none, message: "01-basics should be a group node (path: none)")
  assert(basics.children.len() == 1, message: "01-basics should have exactly one child (setup)")
  assert(basics.children.at(0).handle == "01-basics:setup", message: "01-basics child should keep numeric prefix in its handle")

  // spine-flat lists only clickable vertebrae: 01-basics:setup, guide,
  // guide:a, guide:b, guide:deep:x, index, intro = 7. Groups (guide/deep,
  // 01-basics) are excluded.
  assert(rheo-context().spine-flat.len() == 7, message: "expected 7 clickable vertebrae in spine-flat")

  // Pin the exact pre-order SEQUENCE, not just the count. Pre-order means a
  // directory's own landing page (e.g. `guide`) is emitted BEFORE its
  // children (`guide:a`, `guide:b`, `guide:deep:x`) — group nodes (01-basics,
  // guide/deep) contribute no entry of their own but still recurse into their
  // children in place. This differs from a flat full-path lexicographic sort,
  // which would put `guide` after all of its children.
  assert(
    rheo-context().spine-flat.map(v => v.handle) == (
      "01-basics:setup",
      "guide",
      "guide:a",
      "guide:b",
      "guide:deep:x",
      "index",
      "intro",
    ),
    message: "spine-flat pre-order sequence changed: " + rheo-context().spine-flat.map(v => v.handle).join(", "),
  )
}

Spine-flat count: #rheo-context().spine-flat.len()

Spine-flat handles: #rheo-context().spine-flat.map(v => v.handle).join(", ")

Handle: #rheo-context().handle
