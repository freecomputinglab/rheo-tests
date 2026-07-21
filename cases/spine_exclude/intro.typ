#set document(title: [Introduction])

= Introduction

// `[spine] exclude = ["drafts/**", "TODO.typ"]` drops TODO.typ (root file)
// and the whole drafts/ subtree from the directory scan (globs matched
// content_dir-relative, forward-slash separated — see
// reticulate/spine.rs SpineScan::is_excluded / build_exclude_set). Only
// intro.typ (this file) and guide/a.typ survive: guide/ has no landing
// page (no index.typ or guide.typ), so it becomes a non-clickable group
// node titled "Guide" nesting `a`.

#let walk(nodes, depth) = {
  for node in nodes [
    - depth=#depth title=#node.title handle=#(if node.handle == none { "none" } else { node.handle }) path=#(if node.path == none { "none" } else { node.path })
    #walk(node.children, depth + 1)
  ]
}

#walk(rheo-context().spine, 0)

#{
  let handles = rheo-context().spine-flat.map(v => v.handle)
  assert(
    handles == ("guide:a", "intro"),
    message: "expected spine-flat (guide:a, intro) with TODO.typ and drafts/wip.typ excluded, got: " + handles.join(", "),
  )
}

Spine-flat handles: #rheo-context().spine-flat.map(v => v.handle).join(", ")

Handle: #rheo-context().handle
