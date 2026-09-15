---
id: rt-cover-the-prelude-auto-exclusion-f5aa977b
short-id: f5
title: Cover the prelude auto-exclusion
priority: 3
labels:
- fix-prelude-scan-exclude
deps:
- blocked-by:rt-rename-marrow-prologue-in-the-harness-75e4489e
closed: false
---
Touches: cases/spine_prelude/rheo.toml, tests/harness.rs, ref/examples/spine_prelude

Two prelude cases hand-apply the very workaround rheo is about to make
unnecessary, so the fix would land with no integration coverage at all.

## What you are working in

`/home/lox/code/_fcl/rheo-tests` is the integration-test repo for `rheo`, a
Typst-to-PDF/HTML/EPUB compiler whose source is the sibling checkout
`/home/lox/code/_fcl/rheo`. Run the suite from the rheo-tests root:

    RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness

`RHEO_MANIFEST` is required standalone (`README.md:104`). There is no
Justfile, no lint step, and no `CLAUDE.md` in this repo.

Hand-written `#[test]` functions here use the `CompiledFixture` helper in
`src/helpers/compiled.rs`: `compile(fixture, store_name, formats)` at `:63`
with formats as `&["--html"]`, `expect_success` at `:78`, `read` at `:118`,
`path` at `:114`, `stderr` at `:103`, `combined` at `:109`. There is NO
method on `CompiledFixture` that lists an output directory, so assert the
presence and absence of individual files with `built.path("...").exists()`.

## The rheo change

`[spine] prelude` names a Typst file, relative to `content_dir`, that rheo
splices inside every vertebra's source after its `rheo-context()` binding.
Because the path is `content_dir`-relative, the prelude file necessarily sits
INSIDE the scanned content tree — and nothing currently excludes it from the
spine scan. So it is compiled as a vertebra in its own right, and with
`auto_index` on (the default) its directory also gets a synthesized landing
page. The documented setup publishes two junk pages: `_lib/prelude.html` and
`_lib.html`.

rheo bird `rh-keep-the-spine-prelude-out-of-the-scan-bd7af0ec` (label
`fix-prelude-scan-exclude`) fixes this by pushing the prelude's own path onto
the scan's exclude set, exactly as the reserved marrow filenames already are.
`_lib.html` then disappears as a consequence rather than directly: once the
prelude is excluded, `_lib/` has no remaining `.typ` children and the scan
drops the whole directory node. You are not implementing any of that; do not
edit anything under `/home/lox/code/_fcl/rheo`.

## Why the current cases hide it

Two cases work around the bug by hand:

- `cases/spine_prelude/rheo.toml:6` — `exclude = ["_lib/**"]`
- `cases/spine_auto_index_override/rheo.toml:10` — `exclude = ["_lib/**"]`

And `fn test_spine_prelude` (`tests/harness.rs:2892-2916`) asserts
`!built.path("html/_lib/prelude.html").exists()` with a comment crediting
that exclude for the absence. So the suite would pass identically before and
after rheo's fix, and the cases would keep documenting a workaround as
necessary.

## This bird is the red half

rheo's CI clones a rheo-tests branch named `rheo/` plus the rheo branch name
(`README.md:24-33`). The rheo work is on rheo branch `feat/vertebra-prelude`,
so this belongs on rheo-tests branch `rheo/feat/vertebra-prelude`, and the
two go green together. Against a rheo without the fix, your change is
expected to FAIL — VERIFY says how to confirm it fails for the right reason.

## Steps

1. `cases/spine_prelude/rheo.toml` — delete the `exclude = ["_lib/**"]` line
   (line 6). Leave every other key as it is: `version = "0.6.2"`,
   `formats = ["html"]`, `content_dir = "content"`, and
   `[spine] prelude = "_lib/prelude.typ"`. The case's content tree stays as
   it is: `content/index.typ`, `content/deep/nested.typ`,
   `content/_lib/prelude.typ`.

2. Add a comment above the `[spine]` table in that same file, in the style of
   the comment at the top of `cases/spine_auto_index/rheo.toml`, saying what
   the absence of an `exclude` is now pinning: the prelude's own path is
   excluded from the scan by rheo, not by the project, so it mints no page of
   its own and its directory is dropped for having no other children.

3. `fn test_spine_prelude` (`tests/harness.rs:2892-2916`) — strengthen it and
   correct its comment. Keep all four existing assertions (the two `Handle:`
   checks, the `!! from the prelude !!` check, and the
   `html/_lib/prelude.html` absence check). Add one more absence assertion for
   the synthesized directory index:

       assert!(
           !built.path("html/_lib.html").exists(),
           "the prelude's own directory got a synthesized index page"
       );

   Also assert the three pages that SHOULD exist are present —
   `html/index.html`, `html/deep/nested.html` — via `built.path(...).exists()`,
   so a fix that over-excludes and drops real pages fails here rather than
   passing by absence.

4. Rewrite the comment inside that test that currently credits the project's
   exclude (the line reading "The prelude is excluded from the spine, so it
   mints no page of its own", at roughly `tests/harness.rs:2914`). It must now
   say that rheo excludes the prelude path itself, and that `_lib.html` is
   absent as a consequence of the directory having no remaining children —
   which is the part a reader would otherwise assume is directly enforced.

5. Regenerate this one case's references. `cases/spine_prelude` is NOT in the
   `#[test_case]` attribute stack (`tests/harness.rs:48-126`) — it is driven
   only by the bespoke test above — so confirm whether
   `ref/examples/spine_prelude/` exists before doing anything here. If it does
   not, skip this step entirely and say so in your report. If it does, and
   only once rheo's fix is in place, regenerate with:

       UPDATE_REFERENCES=1 RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness spine_prelude

   Do NOT bless against a rheo lacking the fix: that would record the two junk
   pages as expected output.

## NON-GOALS

- Do NOT edit anything in `/home/lox/code/_fcl/rheo`.
- Do NOT remove the `exclude = ["_lib/**"]` from
  `cases/spine_auto_index_override/rheo.toml:10`. Keeping it in exactly one
  case is deliberate: it pins that an explicit exclude of the prelude's
  directory is still harmless once rheo excludes the prelude itself, which is
  what every project that already wrote that workaround will be running.
- Do NOT change where `prelude` resolves from. `content_dir`-relative is the
  documented behaviour and is not what this bird tests.
- Do NOT add a case for a `_lib/` holding OTHER `.typ` library files. A
  synthesized index over those is correct behaviour, not a bug, and pinning it
  here would pin the wrong rule.
- Do NOT convert this case to a `#[test_case]` entry. Its assertions are about
  files being absent, which reads far better as named assertions than as a
  reference diff.

## VERIFY, all four

1. `rg -n 'exclude' cases/spine_prelude/rheo.toml` returns no hits.
2. `RHEO_MANIFEST=../rheo/Cargo.toml cargo build --tests` succeeds.
3. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness test_spine_prelude`
   — against a rheo WITHOUT the fix this fails on the `html/_lib/prelude.html`
   and `html/_lib.html` absence assertions and nothing else, which is the
   expected red half. Against a rheo WITH it, the test passes. State in your
   report which you observed, and quote the failing assertion messages if red.
4. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness spine_auto_index`
   still passes unchanged — you did not touch the override case.