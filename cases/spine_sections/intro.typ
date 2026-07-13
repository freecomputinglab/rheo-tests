#set document(title: [Introduction])

= Introduction

// `[[spine.section]]` groups flat on-disk files under a virtual directory
// without moving them. `guide` claims intro.typ and setup.typ (handles
// `guide:intro` / `guide:setup`); its nested `[[spine.section.section]]`
// `advanced` claims tuning.typ (`guide:advanced:tuning`). other.typ matches
// no section, so it stays top-level (`other`).
//
// A section is *always* a non-clickable group node (vertebra/handle: none),
// exactly like a directory group — see
// reticulate/spine.rs SpineScan::build_section_nodes, which pushes the
// section's own PathNode with `file: None` unconditionally, whether or not
// `title` is set.

#let walk(nodes, depth) = {
  for node in nodes [
    - depth=#depth title=#node.title handle=#(if node.handle == none { "none" } else { node.handle }) path=#(if node.path == none { "none" } else { node.path })
    #walk(node.children, depth + 1)
  ]
}

#walk(rheo-context.spine, 0)

#{
  let root = rheo-context.spine
  let guide = root.find(n => n.title == "Getting Started")
  assert(guide != none, message: "guide section node not found")
  assert(guide.handle == none, message: "guide section should be a non-clickable group node (handle: none)")
  assert(guide.path == none, message: "guide section should have path: none")
  assert(guide.children.len() == 3, message: "guide should have 3 children: intro, setup, advanced")
  assert(guide.children.at(0).handle == "guide:intro", message: "guide child 0 should be guide:intro")
  assert(guide.children.at(1).handle == "guide:setup", message: "guide child 1 should be guide:setup")

  let advanced = guide.children.at(2)
  assert(advanced.handle == none, message: "advanced nested section should be a group node (handle: none)")
  assert(advanced.title == "Advanced", message: "advanced section title should default to prettified name 'Advanced'")
  assert(advanced.children.len() == 1, message: "advanced should have exactly one child (tuning)")
  assert(advanced.children.at(0).handle == "guide:advanced:tuning", message: "advanced child should be guide:advanced:tuning")

  let other = root.find(n => n.handle == "other")
  assert(other != none, message: "other.typ should remain top-level with handle 'other'")

  let handles = rheo-context.spine-flat.map(v => v.handle)
  assert(
    handles == ("guide:intro", "guide:setup", "guide:advanced:tuning", "other"),
    message: "unexpected spine-flat order: " + handles.join(", "),
  )
}

Spine-flat handles: #rheo-context.spine-flat.map(v => v.handle).join(", ")

Handle: #rheo-context.handle
