// Overrides the default `rheo-index()`. Prepended inside every vertebra
// after rheo's own injection, so this `#let` shadows rheo's built-in one —
// only the synthesized directory landing page actually calls `rheo-index()`,
// so this has no visible effect on any other page.
#let rheo-index() = [Overridden index: OVERRIDE-MARKER]
