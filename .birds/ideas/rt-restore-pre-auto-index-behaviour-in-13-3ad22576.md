---
id: rt-restore-pre-auto-index-behaviour-in-13-3ad22576
short-id: '3'
title: Restore pre-auto_index behaviour in 13 existing cases
priority: 3
labels:
- feat-auto-index
deps: []
closed: false
---
The engine bird `rh-auto-index-for-index-less-directories-06a3c261` (in
`../rheo`, same label `feat-auto-index`) flips `[spine] auto_index` on BY
DEFAULT: any content directory with no landing file (`index.typ` or
`<dirname>.typ`) that has children now gets a synthesized landing page instead
of being an inert group node. That is intentional, documented behaviour — see
that bird for the full design.

This suite has 13 EXISTING cases that each happen to contain a landing-less
directory as incidental scaffolding, not as the thing under test. Under the
new default they each grow one extra synthesized page, and that breaks a
hardcoded page count, HTML byte-compare, or spine-shape assertion that was
written assuming today's (pre-change) behaviour.

**Confirmed by direct testing** (build against the engine bird's own
binary, not guessed): adding `auto_index = false` under `[spine]` in a case's
`rheo.toml` restores its page set and structure to byte-for-byte what it is
today — verified on two of the shapes below (a case with an existing bare
`[spine]` table, and a case with no `[spine]` table at all, only a per-format
`[html.spine]` table). This is the fix for all 13: it's a config toggle, not
a code change, and it exists specifically so a test (or a real project) can
opt back into pre-change behaviour.

Touches: cases/spine_exclude/rheo.toml, cases/rheo_context_spine/rheo.toml, cases/rheo_context_sys_inputs/rheo.toml, cases/nested_vertebra_href/rheo.toml, cases/deep_nested_href/rheo.toml, cases/cross_directory_links/rheo.toml, cases/cross_directory_label_collision/rheo.toml, cases/bundle_ref_cross_directory/rheo.toml, cases/escape_form_nested/rheo.toml, cases/head_control/rheo.toml, cases/relative_path_links/rheo.toml, cases/epub_nested_spine/rheo.toml, cases/spine_scan_tree/rheo.toml

## Order — depends on the engine bird landing first

You cannot verify this bird against the current `rheo` binary on `main` —
`auto_index` does not exist there yet. This bird must be worked AFTER
`rh-auto-index-for-index-less-directories-06a3c261` lands in `../rheo`. If it
has not landed yet when you pick this up, say so and stop rather than
guessing at the config shape from this description alone.

Verify against the landed binary with:
```
cd /home/lox/code/_fcl/rheo-tests
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness
```

## The fix, mechanically, for each of the 13 files

For each `rheo.toml` listed in `Touches:` above:

- If it already has a bare `[spine]` table (only `cases/spine_exclude/rheo.toml`
  does, with an `exclude = [...]` line), add `auto_index = false` as a new line
  inside that existing table.
- Otherwise, append a NEW table to the end of the file:
  ```toml

  [spine]
  auto_index = false
  ```
  Do this even when the file already has a `[html.spine]` or `[epub.spine]`
  table (most of them do, for an unrelated `title = "..."` key) — `[spine]` and
  `[html.spine]`/`[epub.spine]` are different TOML tables and coexist fine;
  confirmed by direct test on `cases/head_control/rheo.toml`, which has
  `content_dir = "content"` and no bare `[spine]` table today.

Do NOT touch any `.typ` file, any `ref/` tree, or `tests/harness.rs` for these
13 cases. Do NOT rewrite any of their assertions (e.g. the group-node checks
in `spine_scan_tree/index.typ` or `rheo_context_spine`'s content) — the whole
point of this fix is that `auto_index = false` makes those assertions true
again exactly as written, with zero code-level changes. If, after adding the
config line, a case still fails, that is a NEW finding to report (do not try
to patch the `.typ`/`ref/` files to paper over it) — see Non-goals.

## What each case actually tests, so you know the incidental directory is safe to neutralize

(Confirmed by reading each case's files, not guessed.)

1. **`cases/spine_exclude/`** — tests `[spine] exclude` globs (`drafts/**`,
   `TODO.typ`). `guide/a.typ` has no `guide/index.typ`; irrelevant to what's
   under test. `rheo.toml` already has `[spine]\nexclude = [...]` — add the new
   line inside it.
2. **`cases/rheo_context_spine/`** — tests the `rheo-context().spine` API
   surface. `chapters/{one,two}.typ` has no landing file.
3. **`cases/rheo_context_sys_inputs/`** — tests `sys.inputs` availability via
   `rheo-context()`. `chapters/one.typ` has no landing file; the failure was
   "expected 2 vertebrae, got 3" — the synthesized `chapters` page is the third.
4. **`cases/nested_vertebra_href/`** — tests href resolution across nested
   vertebrae. `content/pages/about.typ` has no landing file.
5. **`cases/deep_nested_href/`** — tests href resolution two directories deep.
   `content/guide/deep/x.typ` has no landing file at either `guide/` or
   `guide/deep/`.
6. **`cases/cross_directory_links/`** — tests links between sibling
   directories. `chapters/` and `appendix/` both lack landing files.
7. **`cases/cross_directory_label_collision/`** — tests that identical Typst
   labels in different directories don't collide. `content/a/` and
   `content/b/` both lack landing files.
8. **`cases/bundle_ref_cross_directory/`** — tests bundle-level references
   across directories. `chapters/` lacks a landing file.
9. **`cases/escape_form_nested/`** — tests HTML-escaping inside nested content.
   `content/chapters/intro.typ` has no landing file.
10. **`cases/head_control/`** — tests custom `<head>` control via marrow
    (`content/.marrow.typ`). `content/sub/page.typ` has no landing file.
11. **`cases/relative_path_links/`** — tests relative path resolution.
    `subdir/{child,sibling}.typ` has no landing file.
12. **`cases/epub_nested_spine/`** — tests EPUB spine ordering (`formats =
    ["epub"]`). `pages/about.typ` has no landing file; the extra synthesized
    page shifts the expected EPUB spine order/count.
13. **`cases/spine_scan_tree/`** — the most sensitive one: this case's
    `index.typ` contains hardcoded assertions that `guide/deep` and
    `01-basics` are **group nodes** (`handle == none`), and pins the exact
    `spine-flat` pre-order sequence and count (7 entries). This case is
    explicitly testing zero-config directory-scan shape, which is exactly
    the shape `auto_index = false` is defined to preserve — so this is the
    single most important case to confirm passes unchanged after the config
    addition, not just the easiest to skip.

## Non-goals

- Do NOT add `auto_index` to any case's `ref/` tree or its committed
  expected-output comparison — none of these cases change their expected
  `ref/` output at all once `auto_index = false` is added; they should compare
  identical to what's already committed.
- Do NOT touch `cases/spine_auto_index/`, `cases/spine_auto_index_off/`, or
  `cases/spine_auto_index_override/`, or their `ref/examples/` trees, or the
  three `#[test_case(...)]` lines for them in `tests/harness.rs` (around lines
  94-96). Those were added by a separate, already-landed bird
  (`rt-cases-for-auto-indexed-directories-f89191fc`) and are correct as-is.
- Do NOT run `UPDATE_REFERENCES=1` for any of these 13 cases. If a case still
  mismatches its `ref/` tree after adding `auto_index = false`, that is a
  finding to report, not something to regenerate away.
- Do NOT change `../rheo` from this repo.
- Do NOT add a 14th case or otherwise expand scope. This bird is exactly:
  add one config line to 13 existing files.

## VERIFY

1. `cd /home/lox/code/_fcl/rheo-tests && RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test harness` is green — every test passes, including all 13 named above and the 3 from `rt-cases-for-auto-indexed-directories-f89191fc` (`spine_auto_index`, `spine_auto_index_off`, `spine_auto_index_override`).
2. The total test count matches: 135 pre-existing + 3 (already landed) = 138,
   all passing, 0 failing.
3. Each of the 13 `rheo.toml` files above contains a `[spine]` table with
   `auto_index = false`, and nothing else in those files changed.