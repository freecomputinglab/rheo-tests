// @test-formats: html,pdf
// @test-description: Nested intro demonstrating stem collision and @label references

#let rheo-feed-title = "Chapter Introduction"

= Chapter Introduction

This is a nested introduction that shares the "intro" stem with the root-level intro.typ.

== Handle Collision Resolution

Because both files are named "intro.typ", rheo assigns:
- Root file: @intro (bare handle)
- This file: @chapters-intro (path-qualified handle)

== Cross-References

Link back to [@intro][the root introduction] using the bare handle.

Reference [@ch1][Chapter 1] in the same directory.

Continue to the [@ch1][next chapter] for more content.
