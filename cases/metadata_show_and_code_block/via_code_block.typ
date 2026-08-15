// `set document(...)` inside a top-level code block. The compiled document's
// title (DocumentInfo, what feeds the HTML <title>/PDF Info dict) is
// "FromCodeBlock" -- Typst's realize pass collects a `set document(...)`
// style node wherever it occurs in the tree. rheo's scan, however, is gated
// to a literal top-level `#set document(...)` statement and misses a code
// block entirely (docs/limitations.md:24, "In a code block --
// `#{ set document(...) }`" -> "No").
//
// Note the context read below is INSIDE the same `{ }` block on purpose: a
// standalone code block's `set` only extends its style to content lexically
// nested within that same block (ordinary block scoping) -- an ` #context
// document.title` placed AFTER the closing brace sees the outer,
// rheo-injected fallback title instead, even though the final compiled
// DocumentInfo/<title> is still "FromCodeBlock" regardless of where the
// style is scoped. That's a real Typst subtlety, not a rheo gap.
#{
  set document(title: [FromCodeBlock])
  context [Own compiled title (read inside the same code block): #document.title]
}

= Via code block

#{
  let ctx = rheo-context()
  let entry = ctx.spine-flat.filter(v => v.handle == ctx.handle).first()
  [Spine title (via rheo-context): #entry.title]
}
