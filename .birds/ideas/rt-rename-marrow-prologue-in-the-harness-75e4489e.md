---
id: rt-rename-marrow-prologue-in-the-harness-75e4489e
short-id: '7'
title: Rename marrow prologue in the harness
priority: 4
labels:
- rename-marrow-table
deps: []
closed: true
---
Touches: cases/marrow_names/content/.marrow.prelude.typ, cases/marrow_names/content/.marrow.prologue.typ, tests/harness.rs, cases/marrow_position_prologue/rheo.toml, cases/marrow_position_prologue/content/index.typ, cases/marrow_position_prologue/content/.marrow.typ, cases/migrate_marrow_table/rheo.toml, cases/migrate_marrow_table/main.typ

This is the rheo-tests half of a two-repo rename. It is RED until the rheo
side lands, and that is expected — see "This bird is the red half" below
before you start.

## What you are working in

`/home/lox/code/_fcl/rheo-tests` is the integration-test repo for `rheo`, a
Typst-to-PDF/HTML/EPUB compiler whose source is the sibling checkout
`/home/lox/code/_fcl/rheo`. Run the suite from the rheo-tests root with:

    RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness

`RHEO_MANIFEST` is required when running standalone (`README.md:104`). A
single test by name, e.g.:

    RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness marrow

There is no Justfile and no lint step in this repo. There is no `CLAUDE.md`
here either — the conventions you need are all restated below.

## The rename, in full

rheo is replacing two `rheo.toml` keys and one reserved filename. Nothing
about marrow's BEHAVIOUR changes; this is naming only.

- The explicit marrow filename `.marrow.prelude.typ` becomes
  `.marrow.prologue.typ`. Its partner `.marrow.epilogue.typ` is unchanged.
- The top-level `marrow = "somefile.typ"` key (a filename override) becomes
  `[marrow] file = "somefile.typ"`.
- The `dot_marrow_is_epilogue = <bool>` key becomes `[marrow] position`,
  taking the string `"epilogue"` (the default) or `"prologue"`.

The rules that do NOT change, and which your new cases must keep pinning:

- `.marrow.prologue.typ` is spliced BEFORE every `#document(...)` block at the
  bundle root, so a `#show`/`#set` rule in it reaches vertebrae that already
  exist. `.marrow.epilogue.typ` is spliced after.
- Either explicit name OUTRANKS a bare `.marrow.typ`, and when one is present
  the bare file is not read at all.
- `[marrow] position` governs only where a BARE `.marrow.typ` lands. It never
  moves an explicitly-named one.

The rheo-side change is tracked there as bird
`rh-rename-dot-marrow-is-epilogue-9b3bbd43` (label `rename-marrow-table`).
You are not implementing any of it. Do not edit anything under
`/home/lox/code/_fcl/rheo`.

## This bird is the red half

rheo's CI clones a rheo-tests branch whose name is `rheo/` followed by the
rheo branch name (`README.md:24-33`). The rheo work lands on rheo branch
`feat/vertebra-prelude`, so this work belongs on rheo-tests branch
`rheo/feat/vertebra-prelude` and the two go green together.

So: after your change, `cargo test --test harness marrow` WILL FAIL against a
rheo that has not yet renamed the constant. That is the intended state. What
you must confirm is that it fails for the right reason and nothing else is
broken — VERIFY below says exactly how.

## Steps

1. Rename the fixture file. `cases/marrow_names/` currently holds exactly four
   files: `rheo.toml`, `content/index.typ`, `content/.marrow.typ` and
   `content/.marrow.prelude.typ`. Rename the last to
   `content/.marrow.prologue.typ`, leaving its contents byte-identical. Use
   `mv`; do not rewrite the file.

2. Update the one test that names the old filename.
   `tests/harness.rs:2923-2940` is `fn test_marrow_explicit_names_outrank_bare`,
   with its doc comment starting at `tests/harness.rs:2919`. The literal string
   `.marrow.prelude` appears at exactly four lines — `:2919` (doc comment),
   `:2930` (an assertion message), `:2937` and `:2938` (a
   `built.path("html/.marrow.prelude.html")` existence check and its message).
   Change all four to `.marrow.prologue`. Verified by search: those four are
   the ONLY hits for `.marrow.prelude` in the repo outside `ref/`, and
   `dot_marrow_is_epilogue` and `marrow_prologue` have zero hits anywhere — so
   there is nothing else in the tree to rename.

3. Add a case pinning `[marrow] position`. Create
   `cases/marrow_position_prologue/` with:

   - `rheo.toml`:

         version = "0.6.2"
         formats = ["html"]
         content_dir = "content"

         [marrow]
         position = "prologue"

   - `content/index.typ` — one vertebra containing a `#set document(title: ...)`
     and the markup `*bold*`, so a `#show strong:` rule from marrow has
     something to land on.
   - `content/.marrow.typ` — a BARE marrow containing a show rule that is
     plainly visible in the output when it applies, e.g.
     `#show strong: it => [MARROW-REACHED]`.

   With `position = "prologue"` the bare marrow is spliced before the
   vertebra, so the rule applies and `MARROW-REACHED` appears. With the key
   absent (default `"epilogue"`) it does not.

4. Write the test for step 3's case as a bespoke `#[test]`, not a
   `#[test_case]`. Append it to `tests/harness.rs` immediately after
   `test_marrow_explicit_names_outrank_bare` (which ends at `:2940`), in that
   test's own style. Use the `CompiledFixture` helper, whose API is in
   `src/helpers/compiled.rs`:

       let built = CompiledFixture::compile(
           "cases/marrow_position_prologue", "marrow_position_prologue", &["--html"])
           .expect_success();
       let index = built.read("html/index.html");

   `compile` is at `src/helpers/compiled.rs:63`, `expect_success` at `:78`,
   `read` at `:118`, `path` at `:114`, and `recompile(formats)` at `:89`.
   Assert that `index` contains `MARROW-REACHED`. Copy
   `test_spine_prelude`'s habit (`tests/harness.rs:2892-2916`) of putting the
   offending file's contents into every assertion message, e.g.
   `"a prologue-positioned bare marrow did not reach the vertebra:\n{index}"`.

   Do NOT also add the negative half (`position = "epilogue"` does not reach)
   as a second case directory. rheo's own end-to-end tests already pin that
   pair; a second fixture here buys nothing and doubles the blessing work.

5. Add a migrate case. `rheo migrate` rewrites a stale `rheo.toml` in place,
   and the existing template for testing it is `cases/migrate_vertebrae_exclude`
   (three files: `rheo.toml`, `main.typ`, `lib/helper.typ`) driven by the
   bespoke test `fn migrate_converts_vertebrae_to_exclude` at
   `tests/harness.rs:1485-1544`. Read that test and follow its shape exactly:
   it uses `TestCase::new` / `copy_project_to_test_store` directly rather than
   `CompiledFixture`, invokes `rheo_cli_command().args(["migrate", ...])`,
   asserts stdout substrings (`tests/harness.rs:1503-1506`), and then reads
   `rheo.toml` back as text and asserts on the before/after content
   (`tests/harness.rs:1514-1543`).

   Create `cases/migrate_marrow_table/` with a `main.typ` and a `rheo.toml`
   carrying BOTH retired keys:

         version = "0.6.2"
         formats = ["html"]
         marrow = "bundle-root.typ"
         dot_marrow_is_epilogue = false

   Append the test after `migrate_converts_vertebrae_to_exclude` ends (the
   next doc comment block begins at `tests/harness.rs:1546`; insert before
   it). Assert that after `rheo migrate` the file contains a `[marrow]` table
   with `file = "bundle-root.typ"` and `position = "prologue"`, and that
   neither `dot_marrow_is_epilogue` nor a top-level `marrow =` line survives.

   Note the mapping, which is easy to get backwards:
   `dot_marrow_is_epilogue = false` means "the bare marrow is a PROLOGUE", so
   it migrates to `position = "prologue"`.

6. Do NOT run the reference blesser for the two new cases. Both are bespoke
   `#[test]`s, not `#[test_case]` entries, so neither has a `ref/` directory
   and neither needs one. Do not add either case to the `#[test_case]`
   attribute stack at `tests/harness.rs:48-126`.

## NON-GOALS

- Do NOT edit anything in `/home/lox/code/_fcl/rheo`. The engine half is a
  separate bird in a separate repo.
- Do NOT rename `.marrow.epilogue.typ`, `[spine] prelude`, or the
  `VertebraInjection.prelude` internals. Only the prologue filename and the
  two config keys move.
- Do NOT change any marrow BEHAVIOUR expectation in an existing test. The
  outranking rule, the default position and the rule that a project's setting
  never moves a package's bare marrow all stay as they are.
- Do NOT bless or hand-edit anything under `ref/`. Nothing in `ref/` mentions
  the old filename, and the two cases you add are not ref-diffed.
- Do NOT add a `[marrow]` key beyond `file` and `position`.

## VERIFY, all four

1. `rg -n '\.marrow\.prelude|dot_marrow_is_epilogue' . ` from the rheo-tests
   root returns no hits outside `.birds/`.
2. `RHEO_MANIFEST=../rheo/Cargo.toml cargo build --tests` succeeds — the new
   tests compile, so the failure in (3) is a behaviour difference and not a
   typo.
3. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness marrow` fails,
   and every failure names either the marrow filename or the `[marrow]` table.
   No OTHER test in the suite regresses:
   `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness` shows failures
   only in the marrow and migrate tests you touched. This red state is
   correct and expected until rheo's `rh-rename-dot-marrow-is-epilogue-9b3bbd43`
   lands.
4. `cases/marrow_names/content/.marrow.prologue.typ` exists and
   `cases/marrow_names/content/.marrow.prelude.typ` does not.