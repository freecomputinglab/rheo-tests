---
id: rt-stop-test-runs-from-clobbering-the-6bbe5cfc
short-id: '6'
title: Stop test runs from clobbering the tracked store fixtures
priority: 4
labels:
- fix-store-hygiene
deps: []
closed: true
---

Running the migrate tests deletes committed fixtures and tracks scratch output.

`store/` holds ONE committed fixture tree, `store/compat/merged-imports/`, kept
visible by two negating gitignores (`store/.gitignore` with `*`/`!compat`/
`!.gitignore`, and `store/compat/.gitignore`). It is also the scratch directory
the migrate tests copy projects into, via `copy_project_to_test_store` in
`src/helpers/` (find it; the migrate tests at `tests/harness.rs:1485` onward all
use it).

MEASURED: after `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness`, a
clean checkout reports as dirty:

- `store/.gitignore`, `store/compat/.gitignore` and all five files under
  `store/compat/merged-imports/` DELETED.
- `store/migrate_feed_removal/`, `store/migrate_link_syntax/`,
  `store/migrate_target_syntax/`, `store/migrate_vertebrae_exclude/` and
  `store/migrate_marrow_table/` ADDED as untracked-but-not-ignored scratch,
  each holding a project the test copied there and `rheo migrate` then rewrote
  in place (the `version` line differs from the source fixture).

This cost real work once already: a landing on branch `rheo/feat/vertebra-prelude`
carried the deletions and the scratch dirs into the commit, and `store/compat/merged-imports`
had to be restored by hand. `#[test_case("store/compat/merged-imports")]`
(`tests/harness.rs:127`) fails with `Os { code: 2, kind: NotFound }` whenever
the fixture has been eaten, which reads as an unrelated regression to whoever
sees it next.

## Steps

1. Find `copy_project_to_test_store` and establish exactly how it clears its
   destination — whether it removes `store/` wholesale, or removes and recreates
   a per-test subdirectory. Report what you found; the fix depends on it.

2. Separate the scratch root from the fixture root. The committed compat fixture
   must not live inside a directory any test is allowed to wipe. Either:
   - point the test store at a new, entirely gitignored directory (e.g.
     `target/test-store/` or `store/.scratch/`) and leave `store/compat/` alone;
     or
   - narrow the clearing so it only ever touches the one subdirectory named by
     `store_name`, never its siblings and never `store/` itself.

   Prefer the first: a scratch root under `target/` cannot be committed by
   accident at all, which is the failure this bird is about. Say in the commit
   message which you chose.

3. Update `store/.gitignore` / `store/compat/.gitignore` to match whatever
   layout step 2 settles on. If the scratch root moves out of `store/`, the
   negation gymnastics in those two files stop being necessary — a plain
   `store/` holding only committed fixtures needs no ignore rules at all.

4. Update `README.md`, which documents the layout at lines 55-75 (`store/ #
   Compat test fixtures (committed)`) and the `RUN_COMPAT_TESTS=1` env var
   below it, to describe the new split.

## NON-GOALS

- Do NOT delete or rewrite `store/compat/merged-imports/`. It is a committed
  fixture that a `#[test_case]` still reads; this bird protects it, not replaces
  it.
- Do NOT change what any migrate test asserts. The subject is where the copy
  lands, not what the copy proves.
- Do NOT touch anything under `ref/`, and do not run a reference blesser.

## VERIFY

1. From a clean tree: `RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness`
   passes, then `jj status` reports NO changes at all — no deletions under
   `store/`, no added scratch directories.
2. `store/compat/merged-imports/rheo.toml` and its four content files still
   exist, and the `store/compat/merged-imports` test case passes.
3. Run the suite twice in a row without cleaning in between; the second run
   passes too (the scratch clearing still works).
