---
id: rt-covers-synthesized-spine-entries-0858b140
short-id: '0'
title: Covers synthesized spine entries before rheo marks them
priority: 3
labels:
- fix-spine-flat-synthesized
deps: []
closed: false
---
WRITE THIS TEST FIRST. It is the red half of a two-repo change: it fails
against rheo as this branch's engine stands, and passes once rheo serializes a
new field. Do not implement the rheo side here.

## Background — everything you need

`auto_index` (landed on rheo branch `feat/vertebra-prelude`, NOT on rheo
`main`) mints a landing vertebra for a content directory that has no
`index.typ` and no `<dirname>.typ`. The minted vertebra goes into the spine
like any other page, carrying the notional path `<dir>/index.typ` — but there
is no such file on disk. Default is on
(`/home/lox/code/_fcl/rheo/crates/core/src/config/mod.rs:364`,
`auto_index: ... .unwrap_or(true)`).

Nothing in the serialized spine says which entries are minted. `spine-flat`
dicts carry `handle`/`path`/`title` and tree nodes carry
`title`/`handle`/`path`/`children`
(`/home/lox/code/_fcl/rheo/crates/core/src/reticulate/spine/serialize.rs:86-133`),
so a package that does anything with a path other than link to it — reading it
with Typst's `read()`, for instance — hits a file-not-found it can neither
predict nor recover from. That is a real, observed breakage: waterline/rookery
builds a sub-bibliography by reading every `spine-flat` path, and its whole
site stopped compiling.

rheo bird `rh-mark-synthesized-vertebrae-in-spine-flat` (in
`/home/lox/code/_fcl/rheo`, label `fix-spine-flat-synthesized`) adds a
`synthesized: bool` to both shapes. This bird is its test, written first.

This is coverage ADDED TO an existing case, not a new one. `feat-auto-index`
already built `cases/spine_auto_index`, `cases/spine_auto_index_off` and
`cases/spine_auto_index_override` (birds `rt-cases-for-auto-indexed-directories-f89191fc`
and `rt-restore-pre-auto-index-behaviour-in-13-3ad22576`, both closed).
`cases/spine_auto_index` is already exactly the shape this needs: zero-config
`rheo.toml` (so the default `true` is what is under test), `intro.typ` at the
root, and `guide/a.typ` + `guide/b.typ` in a directory with no landing file.

Touches: cases/spine_auto_index/intro.typ, cases/rheo_context_sys_inputs/intro.typ

## Steps

1. Add an assertion block to `cases/spine_auto_index/intro.typ`. That file is
   four lines today — a `#set document`, a heading, and a `Handle:` line. Keep
   all of it and append a bare `#{ ... }` block of `assert` calls. `assert`
   returns none, so the block adds nothing to the HTML and the reference output
   stays byte-identical. Copy the shape of the block in
   `cases/rheo_context_sys_inputs/intro.typ`, including its habit of a
   `message:` on every single assert.

   With `let ctx = rheo-context()`, assert:

   a. `ctx.spine-flat.len() == 4` — `intro.typ`, the minted `guide/index.typ`,
      `guide/a.typ` and `guide/b.typ`.
   b. For every entry `v` in `ctx.spine-flat`:
      `v.keys().sorted() == ("handle", "path", "synthesized", "title")`.
   c. The entry whose `v.path == "guide/index.typ"` has `v.synthesized == true`.
      Select it by PATH, not by handle: the minted vertebra's handle is not
      verified here and guessing it wrong would fail the test for the wrong
      reason.
   d. The entries whose paths are `"intro.typ"`, `"guide/a.typ"` and
      `"guide/b.typ"` each have `v.synthesized == false`.
   e. Walking `ctx.spine` recursively, every node's
      `keys().sorted() == ("children", "handle", "path", "synthesized", "title")`.

2. Update the one case that pins the OLD key sets and will start failing the
   moment rheo adds the field. `rg "keys\(\).sorted\(\)" cases/` finds exactly
   two lines, both in `cases/rheo_context_sys_inputs/intro.typ`:

   - `assert(v.keys().sorted() == ("handle", "path", "title"), ...)` becomes
     `("handle", "path", "synthesized", "title")`.
   - the `check-node` assert `("children", "handle", "path", "title")` becomes
     `("children", "handle", "path", "synthesized", "title")`.

   Leave its `ctx.spine-flat.len() == 2` assert ALONE. That case opted out with
   `auto_index = false` under `[spine]` in its `rheo.toml` (added by
   `rt-restore-pre-auto-index-behaviour-in-13-3ad22576`), so it mints nothing
   and still sees exactly two vertebrae. The new field appears on its entries
   all the same — `synthesized: false` on every one — which is why the key-set
   asserts still have to change.

3. Do NOT run `UPDATE_REFERENCES=1` before the rheo change lands. It rewrites
   the checked-in `ref/` tree from whatever the current binary produces
   (`README.md`, "Updating Reference Outputs"), which would bake today's wrong
   output in and leave a case that passes forever while proving nothing. The
   assertions here are invisible in the HTML anyway, so no reference needs
   regenerating for this bird at all.

## Non-goals

Do NOT implement the rheo side — different repo, different bird. Do NOT change
`auto_index` behaviour or its default. Do NOT add a fourth `spine_auto_index_*`
case; the assertions belong on the existing one. Do NOT touch the other twelve
cases that `rt-restore-pre-auto-index-behaviour-in-13-3ad22576` opted out with
`auto_index = false` — none of them assert on key sets. Do NOT push, and do not
create a bookmark unless asked.

## VERIFY

`cargo` is only on PATH inside the project devShell, so every command runs
through direnv.

1. RED, with rheo still unchanged:

       direnv exec /home/lox/code/_fcl/rheo-tests sh -c "cd /home/lox/code/_fcl/rheo-tests && RHEO_MANIFEST=../rheo/Cargo.toml RUN_HTML_TESTS=1 cargo test --test harness spine_auto_index"

   FAILS, and the failure is the Typst assertion from step 1b naming the key
   set — not a file-not-found and not a build error.

2. GREEN, after `rh-mark-synthesized-vertebrae-in-spine-flat` is implemented in
   rheo: the same command passes, and the whole suite

       direnv exec /home/lox/code/_fcl/rheo-tests sh -c "cd /home/lox/code/_fcl/rheo-tests && RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness"

   passes too, `rheo_context_sys_inputs` included.
