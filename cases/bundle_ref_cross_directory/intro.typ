// @test-formats: html,pdf
// @test-description: Root-level intro demonstrating @label cross-references

#let rheo-feed-title = "Introduction"
#let rheo-feed-updated = "2025-01-15T10:00:00Z"

= Introduction

This is the root-level introduction document.

== Cross-File References

This demonstrates [@chapters-intro][the nested introduction] with path-qualified handle (due to stem collision).

You can also reference [@ch1][Chapter 1] in the chapters directory.

== Back References

The nested intro should link back here using [@intro][the root introduction] (bare handle since we're the unique "intro" at root level).
