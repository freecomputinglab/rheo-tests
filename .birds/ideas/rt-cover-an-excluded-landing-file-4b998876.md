---
id: rt-cover-an-excluded-landing-file-4b998876
short-id: '4'
title: Cover an excluded landing file
priority: 3
labels:
- fix-auto-index-exclusion
deps:
- blocked-by:rt-cover-auto-index-in-the-combined-pdf-affa707a
closed: false
---
Touches: cases/spine_auto_index_excluded_landing/rheo.toml, cases/spine_auto_index_excluded_landing/intro.typ, cases/spine_auto_index_excluded_landing/guide/index.typ, cases/spine_auto_index_excluded_landing/guide/a.typ, tests/harness.rs

Nothing in this suite excludes a directory's landing file, so the rule
"auto_index fills an absence, never an exclusion" has no integration cover.

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
has no `index.typ` and no `<dirname>.typ`, at the notional path
`<dir>/index.typ`.

Today it also silently overrides an explicit `[spine] exclude`. The scan
filters directory entries through the exclude set BEFORE it searches for a
landing file, so an excluded `index.typ` is invisible to the search, the
search reports "no landing file", and `auto_index` mints a replacement at the
very output path the author excluded. MEASURED on rheo's side: with
`content/index.typ`, `content/chapters/index.typ` and
`content/chapters/one.typ` plus `exclude = ["chapters/index.typ"]`, the build
produces `build/html/chapters.html` containing a generated link list. The
author said "do not publish this page"; rheo published a different page at
that path.

rheo bird `rh-auto-index-must-not-refill-an-exclusion-c6b49937` (label
`fix-auto-index-exclusion`) implements the rule: `auto_index` fills an
ABSENCE, never an EXCLUSION. A directory whose landing file exists but was
excluded becomes a non-clickable group node — the `auto_index = false`
behaviour — because the author has said what they want there, and it is
"nothing". The directory's other children still compile. Notably this is NOT
warned or errored about: excluding a landing file and getting a group node is
a coherent thing to ask for. You are not implementing any of that; do not
edit anything under `/home/lox/code/_fcl/rheo`.

## This bird is the red half

rheo's CI clones a rheo-tests branch named `rheo/` plus the rheo branch name
(`README.md:24-33`). The rheo work is on rheo branch `feat/vertebra-prelude`,
so this belongs on rheo-tests branch `rheo/feat/vertebra-prelude`. Against a
rheo without the fix your test is expected to FAIL on the `guide.html`
absence assertion.

## Steps

1. Create `cases/spine_auto_index_excluded_landing/` with:

   - `rheo.toml`:

         version = "0.6.2"
         formats = ["html"]

         [spine]
         exclude = ["guide/index.typ"]

     Put a comment above `[spine]`, in the style of the comment at the top of
     `cases/spine_auto_index/rheo.toml`, stating the rule: `guide/` HAS a
     landing file, so `auto_index` has no absence to fill; excluding that file
     must leave the directory with no page at all rather than replacing it with
     a synthesized one.

   - `intro.typ` — a root vertebra, `#set document(title: "Intro")` plus a
     heading.
   - `guide/index.typ` — the REAL landing file, with a distinctive marker in
     its body such as `= Real guide index` and
     `#set document(title: "Real Guide")`. The marker is what lets step 2
     distinguish "the author's excluded page leaked through" from "a
     synthesized page appeared at the same path".
   - `guide/a.typ` — one child, `#set document(title: "A")` plus a heading.

2. Append a bespoke `#[test]` to the end of `tests/harness.rs`, with a doc
   comment stating the rule from "The rheo change" above in one or two
   sentences. Compile the case with `&["--html"]` and assert THREE things:

   - `built.path("html/guide.html").exists()` is FALSE — no page at the
     excluded path, synthesized or otherwise. This is the assertion that is red
     before rheo's fix.
   - `built.path("html/guide/a.html").exists()` is TRUE — excluding the landing
     file does not take the directory's other children with it.
   - `built.path("html/index.html").exists()` is TRUE — the root page is
     unaffected.

   Additionally, guard against the wrong kind of green: if `html/guide.html`
   somehow exists, the failure message should include whether it contains the
   marker `Real guide index`, so a reader can tell instantly whether the
   excluded file leaked or a synthesized page took its place. Read it with
   `built.read(...)` only inside that failure path, since `read` on a missing
   file would panic.

3. Do NOT add the case to the `#[test_case]` attribute stack
   (`tests/harness.rs:48-126`) and do NOT create a
   `ref/examples/spine_auto_index_excluded_landing/` directory. A reference
   diff would work here in principle — an extra output file shows up as a
   diff — but it could only be blessed against a rheo that already has the fix,
   and blessing it beforehand would record the buggy output as expected. Named
   absence assertions say the rule out loud and have no such ordering trap.

## NON-GOALS

- Do NOT edit anything in `/home/lox/code/_fcl/rheo`.
- Do NOT assert that a warning or error is emitted. rheo deliberately stays
  silent here; asserting a diagnostic would pin behaviour that the rheo bird
  explicitly rules out.
- Do NOT cover the case where a directory's ONLY `.typ` file was excluded.
  That directory is dropped entirely by a different and already-correct rule,
  and mixing the two into one fixture would make a failure ambiguous.
- Do NOT add a second case with `auto_index = false`. The behaviour under
  exclusion is meant to be identical either way, and
  `cases/spine_auto_index_off` already pins the off path.
- Do NOT touch `cases/spine_exclude`. It sets `auto_index = false` and
  excludes no landing file, so the rheo change cannot affect it.

## VERIFY, all four

1. `RHEO_MANIFEST=../rheo/Cargo.toml cargo build --tests` succeeds.
2. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness spine_auto_index_excluded_landing`
   — against a rheo WITHOUT the fix it fails on the `html/guide.html` absence
   assertion and on nothing else, which is the expected red half. Against a
   rheo WITH it, the test passes. State in your report which you observed and
   quote the failure message.
3. With the `exclude` line temporarily removed from the case's `rheo.toml`, the
   test fails on the SAME assertion in both rheo versions — confirming the test
   is actually sensitive to the `exclude` key and not passing for an unrelated
   reason. Restore the line afterwards and say in your report that you did.
4. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness` shows no NEW
   failures outside the test you added.