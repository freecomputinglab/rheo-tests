# Atom feed parity: marrow-authored vs the deleted Rust generator

rheo 0.6.0 removed the Rust Atom feed generator, its `[html] feed_*` config
keys, and the `rheo-*` variable convention that fed it. Feed generation moved
into Typst, built on three primitives a `.marrow.typ` can reach:
`<rheo-content>` transclusion, `rheo-metadata-all()`, and
`sys.inputs.rheo-context.spine-flat`.

`cases/marrow_atom_feed` hand-rolls a feed from those three alone — no `@rheo`
package, so the fixture never depends on the Typst package cache — and
`test_marrow_atom_feed` compares it byte-for-byte against
`ref/cases/marrow_atom_feed/feed.xml`. It exists to prove the primitives
suffice.

The old generator's own fixture and reference were deleted with it, so these
are the deltas between what it produced and what a marrow produces. Nothing
else records them.

## Entry `<title>` is path-derived, not the authored title

The old generator emitted the authored title (`Alpha`, `Beta`); a marrow emits
the path-derived spine title (`Post A`, `Post B`).

Typst has no content-to-plain-text primitive: `document.title` is `Content`, and
`str()` rejects `Content` outright — confirmed in `cases/marrow_metadata`, whose
fixture uses `repr()` for exactly this reason. So a marrow reads
`rheo-context().spine-flat`'s `title`, which is always path-derived and already
a plain `str`, rather than trying to flatten the real one.

A package wanting the authored title as text would need a
`<rheo-content select="...">` against a heading element instead.

## Feed-level `<title>` is a literal, not a config cascade

The old generator derived it from `rheo.toml`'s `feed_title`, falling back to
the spine title and then the project name. That cascade does not exist for this
path: publication facts live in Typst now, not `rheo.toml`. The fixture writes
`"Marrow Atom Feed"` directly.

## `<author>` is a literal with the old default's value

Still `"Rheo"`, but as a literal in the marrow rather than a `feed_author`
config default. The value matches; the derivation does not.

## Timestamps are byte-identical in format

Both emit a `+00:00` offset. The marrow computes it with `rfc3339()` from a real
`datetime` set via `#set document(date: ...)`, rather than parsing a removed
`rheo-feed-updated` string.

## Entry `<content type="html">` is byte-identical

Sourced via `<rheo-content page="..."/>` transclusion — the compiled page's
`<body>` inner HTML, entity-escaped — instead of a Rust-side body reader.
