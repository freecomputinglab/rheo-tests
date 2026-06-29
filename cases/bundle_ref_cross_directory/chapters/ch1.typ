// @test-formats: html,pdf
// @test-description: Chapter 1 with feed metadata

#let rheo-feed-title = "Chapter One: The Beginning"
#let rheo-feed-updated = "2025-01-15T11:00:00Z"

= Chapter 1: The Beginning

This is the first actual chapter content.

== References

Reference back to #link(<intro>)[the root introduction] and #link(<chapters:intro>)[the nested introduction].

Both work correctly: root-level files get bare handles, nested files get ':'-prefixed handles.

== Self Reference

This chapter can be referenced as #link(<chapters:ch1>)[Chapter 1].

== Content

Some example chapter content here.
