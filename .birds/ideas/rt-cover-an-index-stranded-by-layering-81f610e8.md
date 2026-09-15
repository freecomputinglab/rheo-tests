---
id: rt-cover-an-index-stranded-by-layering-81f610e8
short-id: '8'
title: Cover an index stranded by layering
priority: 3
labels:
- fix-auto-index-stranded
deps:
- blocked-by:rt-cover-an-excluded-landing-file-4b998876
closed: true
---
Touches: cases/spine_auto_index_stranded/rheo.toml, cases/spine_auto_index_stranded/intro.typ, cases/spine_auto_index_stranded/chapters/one.typ, cases/spine_auto_index_partial/rheo.toml, cases/spine_auto_index_partial/intro.typ, cases/spine_auto_index_partial/chapters/one.typ, cases/spine_auto_index_partial/chapters/two.typ, tests/harness.rs

`auto_index` crossed with `[[spine.section]]` has no case at all, and the
crossing is where it publishes an empty page.

## What you are working in

`/home/lox/code/_fcl/rheo-tests` is the integration-test repo for `rheo`, a
Typst-to-PDF/HTML/EPUB compiler whose source is the sibling checkout
`/home/lox/code/_fcl/rheo`. Run the suite from the rheo-tests root:

    RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness

`RHEO_MANIFEST` is required standalone (`README.md:104`). There is no
Justfile, no lint step, and no `CLAUDE.md` in this repo.

Hand-written `#[test]` functions use `CompiledFixture`
(`src/helpers/compiled.rs`): `compile(fixture, store_name, formats)` at `:63`
with formats as `&["--html"]`, `expect_success` at `:78`, `read` at `:118`,
`path` at `:114`. There is NO method that lists an output directory, so
assert individual files with `built.path("...").exists()`.

## The rheo change

`auto_index` (default on) mints a landing page for a content directory that
has no `index.typ` and no `<dirname>.typ`, whose body lists that directory's
children as links.

`[[spine.section]]` and `[spine] include` then rearrange the tree — and a
section can claim EVERY one of that directory's children, leaving the
synthesized page behind with nothing to list. MEASURED on rheo's side, with
`content/index.typ` and `content/chapters/one.typ` plus:

    [[spine.section]]
    name = "grouped"
    include = ["chapters/*.typ"]

the build produces `build/html/grouped/one.html` as expected and ALSO
`build/html/chapters.html` containing exactly `<body><ul></ul></body>`,
titled "Index". That page lands in `spine-flat`, so it reaches every nav,
feed and sitemap built on it.

The scan already enforces the right rule at scan time — a directory whose
subtree is empty is dropped, on the reasoning that a page listing nothing is
worse than no page — but the layering step does not.

rheo bird `rh-drop-an-index-left-childless-by-layering-d5f237fe` (label
`fix-auto-index-stranded`) prunes a SYNTHESIZED landing node that layering
has left with no children, recursively, so a pruned node cannot strand its
own parent. Two rules bound it: a landing node that came from a REAL file on
disk is never pruned (the author wrote it, so it is theirs to keep), and a
directory whose section claims only SOME of its children keeps its index,
now listing the remainder. You are not implementing any of that; do not edit
anything under `/home/lox/code/_fcl/rheo`.

## This bird is the red half

rheo's CI clones a rheo-tests branch named `rheo/` plus the rheo branch name
(`README.md:24-33`). The rheo work is on rheo branch `feat/vertebra-prelude`,
so this belongs on rheo-tests branch `rheo/feat/vertebra-prelude`. Against a
rheo without the fix, the first of the two tests below is expected to FAIL.

## Steps

1. Create `cases/spine_auto_index_stranded/` — a section claims EVERY child.

   - `rheo.toml`:

         version = "0.6.2"
         formats = ["html"]

         [[spine.section]]
         name = "grouped"
         include = ["chapters/*.typ"]

     With a comment above `[[spine.section]]`, in the style of the comment at
     the top of `cases/spine_auto_index/rheo.toml`, stating the rule: the
     section claims every child of `chapters/`, so the page `auto_index`
     minted for that directory has nothing left to list and must be withdrawn
     rather than published empty.

   - `intro.typ` — root vertebra, `#set document(title: "Intro")` plus a
     heading.
   - `chapters/one.typ` — `#set document(title: "One")` plus a heading.
     `chapters/` deliberately has no `index.typ` and no `chapters.typ`.

2. Create `cases/spine_auto_index_partial/` — a section claims only SOME.

   - `rheo.toml`: same as above but `include = ["chapters/one.typ"]`, with its
     own comment stating the complementary rule: `two.typ` stays behind, so
     `chapters/`'s synthesized index survives and lists only that remainder.
   - `intro.typ`, `chapters/one.typ`, `chapters/two.typ` — each with its own
     `#set document(title: ...)` ("Intro", "One", "Two") plus a heading.

3. Append ONE bespoke `#[test]` per case to the end of `tests/harness.rs`, each
   with a doc comment naming the rule it pins. Keep them as two functions
   rather than one: they assert opposite outcomes and a single failure message
   should say which rule broke.

   For `spine_auto_index_stranded`, assert:
   - `built.path("html/chapters.html").exists()` is FALSE — the stranded
     synthesized page is withdrawn. This is the red-before-fix assertion.
   - `built.path("html/grouped/one.html").exists()` is TRUE — the section's
     regrouped output is produced.
   - `built.path("html/index.html").exists()` is TRUE.

   For `spine_auto_index_partial`, assert:
   - `built.path("html/chapters.html").exists()` is TRUE — a partially-claimed
     directory keeps its index.
   - The body of `built.read("html/chapters.html")` mentions `two` and does NOT
     mention `one`, since `one.typ` was moved into the section and only the
     remainder should be listed. Match on the child's href or title rather than
     a bare substring that could collide with surrounding markup, and put the
     whole file into the assertion message.
   - `built.path("html/grouped/one.html").exists()` is TRUE.

4. Do NOT add either case to the `#[test_case]` attribute stack
   (`tests/harness.rs:48-126`) and do NOT create `ref/examples/` directories
   for them. A reference diff could only be blessed against a rheo that already
   has the fix, and blessing beforehand would record the empty stranded page as
   expected output.

## NON-GOALS

- Do NOT edit anything in `/home/lox/code/_fcl/rheo`.
- Do NOT add a case where a REAL `chapters/index.typ` has its children claimed
  by a section. That page is deliberately kept, and pinning it is a different
  rule from the one this bird covers — file it separately if you think it is
  worth pinning.
- Do NOT add a `[spine] include` variant of either case. `include` and
  `section` are mutually exclusive in one table and rheo's own unit tests cover
  the `include` path; two more fixtures here would only duplicate them.
- Do NOT assert on the stranded page's title. Whether a synthesized index is
  titled "Index" or by its directory name is a separate bird's business and
  asserting it here would couple the two.
- Do NOT touch `cases/spine_sections` or `cases/spine_include`. Both have real
  landing files, so the rheo change cannot affect them, and both are
  reference-diffed where an accidental edit is expensive to review.

## VERIFY, all four

1. `RHEO_MANIFEST=../rheo/Cargo.toml cargo build --tests` succeeds.
2. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness spine_auto_index_stranded`
   — against a rheo WITHOUT the fix it fails on the `html/chapters.html`
   absence assertion and nothing else, which is the expected red half. Against
   a rheo WITH it, the test passes. State in your report which you observed and
   quote the failure message.
3. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness spine_auto_index_partial`
   passes in BOTH cases. A partially-claimed directory keeps its index either
   way, so this test is green before and after — it exists to prove the fix did
   not over-prune. If it is red before the fix, the fixture is wrong rather
   than the engine: say so rather than adjusting the assertion to match.
4. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness` shows no NEW
   failures outside the two tests you added.