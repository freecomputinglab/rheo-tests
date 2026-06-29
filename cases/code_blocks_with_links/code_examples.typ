= Code Blocks with Links Test

This document tests that link transformation correctly handles code blocks.

== Real Links

Real links should be transformed: #link(<other>)[see other page].

Multiple links: #link(<intro>)[intro] and #link(<conclusion>)[conclusion].

== Code Examples

Inline code should preserve links: `#link("./file.typ")[example]`.

Code block example:
```
// This link should be preserved:
#link("./other.typ")[other page]
```

== Mixed Content

Real link: #link(<chapter1>)[Chapter 1]

Then code: `#link("./code.typ")[code link]`

And another real link: #link(<chapter2>)[Chapter 2]
