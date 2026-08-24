// RED case for the not-yet-implemented <rheo-head> hoist pass (rheo bead
// rheo-head-hoist-qz6). The <rheo-head> wrapper below sits in the middle of
// the body (not first, not last) to prove hoisting is position-independent.
// Today rheo does not implement this, so it renders untouched in the body;
// the committed reference instead encodes the CORRECT eventual output
// (child moved into <head>, wrapper removed).

= Page A

Intro paragraph before the hoist.

#html.elem("rheo-head", html.elem("link", attrs: (rel: "canonical", href: "https://example.com/a.html")))

Outro paragraph after the hoist.
