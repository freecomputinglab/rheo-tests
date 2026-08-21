// RED case for rheo bead rheo-onp: a <template>'s children are dropped by
// the head-injection DOM round-trip (parse/reserialize empties the separate
// document fragment html5ever stores template content in). Today this
// renders <template></template>; the committed reference instead encodes
// the CORRECT eventual output (children preserved).
//
// rheo always injects a default stylesheet, so every HTML build already
// takes the round-trip pass — there is no config that skips it, so this
// case covers only that (the reported) side.

= Template element

#html.elem("template", html.elem("div", [Cloneable content TEMPLATECONTENT.]))
