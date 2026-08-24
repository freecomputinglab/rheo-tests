// RED case for the not-yet-implemented <rheo-head> hoist pass (rheo bead
// rheo-head-hoist-qz6). Two separate <rheo-head> wrappers, each with a
// different child, pin that hoisted children land in <head> in the same
// source order they appeared in the body.

= Page B

First paragraph.

#html.elem("rheo-head", html.elem("meta", attrs: (name: "b-first", content: "one")))

Middle paragraph.

#html.elem("rheo-head", html.elem("meta", attrs: (name: "b-second", content: "two")))

Last paragraph.
