// @test-formats: html,pdf
// @test-description: Nested intro demonstrating stem collision and @label references

#let rheo-feed-title = "Chapter Introduction"

= Chapter Introduction

This is a nested introduction that shares the "intro" stem with the root-level intro.typ.

== Handle Scheme

rheo assigns handles based on path:
- Root files: bare handle (e.g. <intro>)
- Nested files: ':'-prefixed handle (e.g. <chapters:intro>)

== Cross-References

Link back to #link(<intro>)[the root introduction] using the bare handle.

Reference #link(<chapters:ch1>)[Chapter 1] in the same directory.

Continue to the #link(<chapters:ch1>)[next chapter] for more content.
