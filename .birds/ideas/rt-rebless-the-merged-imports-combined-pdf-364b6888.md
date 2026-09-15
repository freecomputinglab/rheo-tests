---
id: rt-rebless-the-merged-imports-combined-pdf-364b6888
short-id: '36'
title: Rebless the merged-imports combined PDF for auto_index
priority: 3
labels:
- fix-merged-imports-ref
deps: []
closed: false
---

The one compat fixture's PDF reference predates `auto_index`, so the suite is red.

`#[test_case("store/compat/merged-imports")]` (`tests/harness.rs:127`) diffs the
whole output tree of `store/compat/merged-imports/` against
`ref/examples/merged-imports/`. It fails:

    PDF metadata mismatch:
      - File size: expected 12263 bytes, got 16443 bytes (34% diff, beyond 10% tolerance)

MEASURED, by copying the fixture aside and running
`cargo run -- compile <copy> --pdf` against rheo as it now stands:

- output is 16443 bytes, still `Pages: 1`.
- `pdftotext` shows the two chapters as before, and now also two bullet lists,
  `Ch01`/`Ch02` and `Helpers`/`Macros`.

Those lists are synthesized directory-index pages. The fixture's `content/`
holds `chapters/{ch01,ch02}.typ` and `shared/{helpers,macros}.typ` and no
landing file in either directory, so `auto_index` (default `true`) mints one
page per directory, each rendering `rheo-index()`. The combined PDF therefore
carries two more pages' worth of content than the reference was blessed
against. This is the documented default — see `changelog.md`'s "A childless
directory index gets a real page" section in the rheo repo, which states
plainly that it changes what existing projects build with no config edit.

The fixture is deliberately an OLD config: `version = "0.2.1"`, and a
`[pdf.spine]` carrying the retired `vertebrae` and `merge` keys. Both warn and
neither has any effect, so spine membership comes from the directory scan. That
part is not new and is not this bird's business — the build already warned about
both before `auto_index` existed.

## Steps

1. Confirm the failure and its cause yourself before changing a byte: run
   `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness merged_minusimports`,
   then `pdftotext` the produced PDF (the test's scratch copy lands under
   `target/test-store/`) and check the two bullet lists are there. Report what
   you saw.

2. Regenerate ONLY this case's reference:

       UPDATE_REFERENCES=1 RHEO_MANIFEST=../rheo/Cargo.toml \
         cargo test --test harness merged_minusimports

   `UPDATE_REFERENCES` is read at `tests/harness.rs:141`. Filtering the test
   name is what keeps the run from rewriting anything else.

3. Inspect exactly what changed.
   `ref/examples/merged-imports/pdf/merged-imports.metadata.json` should move
   from `"file_size": 12263` to the new size with `"page_count"` still `1`. If
   any other file under `ref/` changed, revert it and say so — a blanket
   rebless is the thing this bird exists to avoid.

4. Re-run the single test, then the whole suite, and account for every
   remaining failure by name.

## NON-GOALS

- Do NOT edit `store/compat/merged-imports/` itself. Its stale `version`,
  `vertebrae` and `merge` keys are the point: it pins that an old config still
  builds and warns rather than breaking.
- Do NOT add an `index.typ` to `chapters/` or `shared/` to suppress the
  synthesized pages. The new pages are correct output, not noise to hide.
- Do NOT set `auto_index = false` in the fixture. That would test the opt-out,
  not the default this case is meant to exercise.
- Do NOT widen the PDF size tolerance in `src/helpers/comparison.rs`. The
  tolerance caught a real change and did its job.
- Do NOT touch the three marrow/migrate tests that are red pending a rename on
  the rheo side (`test_marrow_explicit_names_outrank_bare`,
  `test_marrow_position_prologue`, `migrate_converts_marrow_table`).

## VERIFY

1. `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness merged_minusimports`
   passes.
2. Changed files are confined to `ref/examples/merged-imports/`, and within it
   only the PDF metadata. Check with the filesystem, not jj.
3. Full suite: every failure is one of the three known marrow/migrate reds, or
   a red half deliberately awaiting a rheo change — name each one.
