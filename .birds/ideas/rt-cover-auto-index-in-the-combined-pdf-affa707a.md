---
id: rt-cover-auto-index-in-the-combined-pdf-affa707a
short-id: af
title: Cover auto_index in the combined PDF
priority: 3
labels:
- fix-rheo-index-handle
deps:
- blocked-by:rt-cover-the-prelude-auto-exclusion-f5aa977b
closed: false
---
Touches: cases/spine_auto_index_pdf/rheo.toml, cases/spine_auto_index_pdf/intro.typ, cases/spine_auto_index_pdf/guide/a.typ, cases/spine_auto_index_pdf/guide/b.typ, tests/harness.rs

Every auto_index case is HTML-only, and PDF is the format where the feature
is actually broken.

## What you are working in

`/home/lox/code/_fcl/rheo-tests` is the integration-test repo for `rheo`, a
Typst-to-PDF/HTML/EPUB compiler whose source is the sibling checkout
`/home/lox/code/_fcl/rheo`. Run the suite from the rheo-tests root:

    RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness

`RHEO_MANIFEST` is required standalone (`README.md:104`). There is no
Justfile, no lint step, and no `CLAUDE.md` in this repo.

Hand-written `#[test]` functions use `CompiledFixture`
(`src/helpers/compiled.rs`): `compile(fixture, store_name, formats)` at `:63`
with formats as `&["--pdf"]`, `expect_success` at `:78`, `read` at `:118`,
`path` at `:114`. `lopdf = "0.41"` is a dependency (`Cargo.toml:28`).

## The rheo change

`auto_index` (default on) mints a landing page for a content directory with
no `index.typ`/`<dirname>.typ`, whose entire body is a call to an injected
Typst helper `rheo-index()` that lists that directory's children as links.

In the combined PDF that page renders COMPLETELY EMPTY, silently, on a green
build. `rheo-index()` reads the current page's handle from
`state("rheo-handle")`, which is published once per `#document` block by
`rheo-page-init(handle)`. PDF wraps every vertebra in ONE document and emits
`rheo-page-init("")`, so the handle is the empty string, the lookup finds no
node, the children list is empty, and nothing is drawn.

rheo bird `rh-bind-rheo-index-per-vertebra-c7c34420` (label
`fix-rheo-index-handle`) fixes it by passing the handle in as an argument
instead of looking it up at runtime, and — because a combined PDF has no
per-page hrefs — by rendering each child as a Typst label link,
`link(label(child.handle), child.title)`, which produces a real `/Link`
annotation in the exported PDF. You are not implementing any of that; do not
edit anything under `/home/lox/code/_fcl/rheo`.

## Why a ref-diffed case will NOT catch this

A `#[test_case("cases/...")]` entry runs through `fn run_test_case`
(`tests/harness.rs:128`), which for PDF calls `verify_pdf_output`
(`src/helpers/comparison.rs:61-87`). That compares the PDF's PAGE COUNT and
its metadata JSON only, via `extract_pdf_metadata`
(`src/helpers/comparison.rs:517`). The synthesized index page exists either
way — empty or full — so the page count is identical and the diff passes.
There is no helper anywhere in this repo that inspects `/Link` annotations or
extracts PDF text.

So this must be a bespoke `#[test]` that opens the PDF itself. The idiom to
follow is `fn test_pdf_merge` (`tests/harness.rs:284-349`), which does
`use lopdf::Document;` then `Document::load(&pdf_path)` and
`doc.get_pages().len()`.

## Steps

1. Create `cases/spine_auto_index_pdf/` with:

   - `rheo.toml`:

         version = "0.6.2"
         formats = ["pdf"]

     With a comment above `formats`, in the style of the comment at the top of
     `cases/spine_auto_index/rheo.toml`, saying what the case pins: the same
     index-less-directory layout as `cases/spine_auto_index`, but built as a
     combined PDF, where the synthesized page's `rheo-index()` call must emit
     real label links rather than rendering nothing.

   - `intro.typ` — a root vertebra with `#set document(title: "Intro")` and a
     short heading. It must contain NO `#link(...)` of its own.
   - `guide/a.typ` — `#set document(title: "A")` and a heading. No links.
   - `guide/b.typ` — `#set document(title: "B")` and a heading. No links.

   `guide/` deliberately has no `index.typ` and no `guide.typ`, so
   `auto_index` mints its landing page. Keeping every vertebra free of its own
   links is what makes the annotation count in step 3 unambiguous: before the
   fix the document has zero link annotations, after it has one per child.

2. Append a bespoke `#[test]` to the end of `tests/harness.rs`. Give it a doc
   comment stating the rule: a synthesized directory index must render its
   children in the combined PDF too, as label links, and not silently come out
   blank. Compile with:

       let built = CompiledFixture::compile(
           "cases/spine_auto_index_pdf", "spine_auto_index_pdf", &["--pdf"])
           .expect_success();
       let pdf_path = built.path("pdf/spine_auto_index_pdf.pdf");

   Confirm that output filename before asserting on it — `test_pdf_merge`
   builds its path as `build_dir.join("pdf/pdf_merge.pdf")`
   (`tests/harness.rs:325`), i.e. `pdf/<store_name>.pdf`, but check what the
   fixture actually produced and use the real name. If it differs, say so in
   your report.

3. Assert on link annotations. Load the document with
   `lopdf::Document::load(&pdf_path)`, iterate `doc.get_pages()`, and for each
   page object count the entries in its `/Annots` array (a page with no
   `/Annots` key contributes zero). Assert the TOTAL across all pages is at
   least 2 — one link per child of `guide/`.

   Before rheo's fix this total is 0 and the assertion fails, which is the
   expected red half. Put the observed total into the assertion message so a
   reader of a failure knows what it was.

   UNCERTAIN, so handle it explicitly: the exact lopdf 0.41 API for reaching a
   page dictionary's `/Annots` is not pinned in this bird. Read the crate's
   docs for the version in `Cargo.toml:28` before writing it —
   `cargo doc -p lopdf --open`, or the `lopdf::Document` and
   `lopdf::Dictionary` sources. If reaching `/Annots` proves awkward, the
   acceptable fallback is `Document::extract_text(&[page_numbers])`, asserting
   the extracted text of the whole document contains both child titles "A" and
   "B". Use whichever you can make work, and state in your report which one you
   used and why.

4. Do NOT add this case to the `#[test_case]` attribute stack
   (`tests/harness.rs:48-126`) and do NOT create
   `ref/examples/spine_auto_index_pdf/`. As explained above, a reference diff
   cannot see this bug, and adding one would imply coverage that does not
   exist.

## NON-GOALS

- Do NOT edit anything in `/home/lox/code/_fcl/rheo`.
- Do NOT add a general-purpose PDF link-inspection helper to
  `src/helpers/`. One bespoke test needs one local count; a shared helper is a
  separate argument and a separate bird.
- Do NOT convert `cases/spine_auto_index` to also build PDF. Its HTML
  references are pinned by other work and adding a format would churn them.
- Do NOT assert an exact annotation count. Typst may add annotations of its
  own; "at least one per child" is the rule being pinned, and an exact number
  would be brittle.
- Do NOT test the per-page (non-combined) PDF layout. `[pdf.spine] merge` is a
  separate mechanism with its own cases and the bug is specific to the
  combined document.

## VERIFY, all four

1. `RHEO_MANIFEST=../rheo/Cargo.toml cargo build --tests` succeeds — the lopdf
   API you chose in step 3 actually compiles.
2. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness spine_auto_index_pdf`
   — against a rheo WITHOUT the fix it fails on the annotation (or text) count
   with a message reporting 0, which is the expected red half. Against a rheo
   WITH the fix it passes. State in your report which you observed and quote
   the message.
3. The PDF is actually produced: the path asserted in step 2 exists, and the
   test's `expect_success` did not trip. A case that fails to compile at all
   would produce the same red as the bug and must not be mistaken for it.
4. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness` shows no NEW
   failures outside the test you added.