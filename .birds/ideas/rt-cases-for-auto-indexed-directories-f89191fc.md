---
id: rt-cases-for-auto-indexed-directories-f89191fc
short-id: f
title: Cases for auto-indexed directories
priority: 2
labels:
- feat-auto-index
deps: []
closed: false
---
rheo is gaining a `[spine] auto_index` key, DEFAULT TRUE: a content directory
with no landing file (`index.typ`, or `<dirname>.typ`) currently produces no
page at all — it becomes a non-clickable group node in the spine — and will
instead get a synthesized landing page. That page's whole body is a call to a
new injected Typst function, `rheo-index()`, which lists the directory's child
pages as links. A project replaces the listing by binding its own `rheo-index`
in its `[spine] prelude` file, which wins because the project's prelude is
prepended after rheo's own injection.

This bird is the integration coverage for all three of those behaviours.

Touches: cases/spine_auto_index/, cases/spine_auto_index_off/, cases/spine_auto_index_override/, ref/cases/spine_auto_index/, ref/cases/spine_auto_index_off/, ref/cases/spine_auto_index_override/, tests/harness.rs

## Order — this case is written FIRST and is EXPECTED TO FAIL

The workspace convention (`/home/lox/code/_fcl/CLAUDE.md`) runs a unit of work
tests-first: write the case, watch it fail, then land the engine change in
`../rheo` and watch it pass. The engine bird is filed in that repo under the
same label, `feat-auto-index`.

So a failing run here is the expected intermediate state, not a defect to work
around.

**DO NOT RUN `UPDATE_REFERENCES=1` BEFORE THE ENGINE CHANGE LANDS.** That
environment variable rewrites the checked-in `ref/` tree from whatever the
current binary produces (`README.md:166`), so running it now would bake
today's wrong output — no directory page at all — into the reference and the
case would pass forever while proving nothing. Write the `ref/` tree by hand,
or regenerate it only after `../rheo` is built with the change and its output
has been read and checked by eye.

## How this suite works, so the case fits it

- One fixture project per directory under `cases/<name>/`, holding its own
  `rheo.toml` and content. `cases/pdf_individual/` is the shape to copy for a
  case that exercises a CONFIG KEY: a `rheo.toml` plus two content files and
  nothing else. `cases/spine_prelude/` is the nearest neighbour by subject.
- The expected output is a committed tree at `ref/cases/<name>/`, mirroring the
  build output.
- Comparison is a WHOLE-FILE STRING COMPARE against that tree —
  `src/helpers/comparison.rs:175` (`compare_html_content`) for HTML and
  `src/helpers/comparison.rs:231` (`compare_text_asset`) for other text assets.
  There is no glob or regex matching, so every byte of the synthesized page's
  HTML lands in the reference and any later change to `rheo-index()`'s markup
  will show up here as a diff. That is the intended sensitivity.
- Cases are enumerated by `#[test_case(..)]` attributes on one function in
  `tests/harness.rs:42-124`, driving `run_test_case` at `tests/harness.rs:125`;
  per-format checks dispatch at `tests/harness.rs:244-274`. A new case needs its
  own `#[test_case("cases/<name>")]` line added there — it is not discovered by
  scanning the directory.

## Steps

1. `cases/spine_auto_index/` — the default-on case. A `rheo.toml` that does NOT
   mention `auto_index` at all (the point is that the default is true), plus:
   - a top-level content file,
   - a subdirectory with NO `index.typ` and NO `<dirname>.typ` in it, holding
     two content files.

   Expected output: the subdirectory's own page exists and its body is the
   default listing, linking to both child pages.

2. `cases/spine_auto_index_off/` — the same content, with `auto_index = false`
   under `[spine]`. Expected output: the two child pages and NO page for the
   directory, which is exactly today's behaviour.

3. `cases/spine_auto_index_override/` — the same content again, plus a
   `[spine] prelude` file that binds `#let rheo-index() = [..]` with recognisable
   marker text. Expected output: the directory's page carries the project's
   markup, not rheo's default listing. This is the case that pins the override
   contract; without it, a later change to the injection order would break every
   site's directory indexes silently.

4. `tests/harness.rs` — add a `#[test_case("cases/<name>")]` line for each of
   the three, in the attribute block at lines 42-124, in the same style as its
   neighbours.

5. `ref/cases/<name>/` for each of the three — the committed expected trees.

## Non-goals

- Do NOT change `rheo` itself from this repo. This repo path-depends on
  `../rheo` and the engine change is a separate bird there.
- Do NOT add unit tests to `../rheo` here; that bird covers them.
- Do NOT refresh any OTHER case's `ref/` tree. If the engine change moves output
  in unrelated cases, that is a finding to report, not to absorb with
  `UPDATE_REFERENCES=1`.
- Do NOT test the `<dirname>.typ` landing convention. A directory with
  `foo/foo.typ` already has a landing page and is outside this change.

## VERIFY

1. `cargo test --test harness` runs all three new cases (`README.md:85`).
2. Before the engine change lands, `cases/spine_auto_index` and
   `cases/spine_auto_index_override` FAIL and `cases/spine_auto_index_off`
   passes — the off case is today's behaviour. Report that state rather than
   trying to make the first two green from this repo.
3. After `../rheo` is built with the change, all three pass with the `ref/`
   trees unchanged from what this bird committed.
4. No other case in the suite changes status.