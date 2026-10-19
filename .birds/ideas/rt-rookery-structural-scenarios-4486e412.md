---
id: rt-rookery-structural-scenarios-4486e412
short-id: '44'
title: Rookery structural scenarios
priority: 3
labels:
- test-watch-narrow
deps:
- blocked-by:rt-rookery-scenario-runner-a2ef0ed7
closed: false
---
Touches: tests/watch_narrow_rookery_structure.rs (new)

## Why

These scenarios change the project's STRUCTURE rather than one note's content:
adding and removing pages, editing shared library files, and changes that
land in one debounced batch. Several of them switch rheo between its narrowed
and full rebuild paths mid-session, which is where state left over from an
earlier rebuild can leak into a later one. Uses the scenario runner and the
rookery fixture from bird rt-rookery-scenario-runner-a2ef0ed7 (this bird's dependency). Find them with
`rg -n 'pub struct Scenario|pub fn rookery_setup' src`. If they are missing,
stop and report.

What rheo does today (verified in `../rheo/crates/core/src/build.rs`,
`Build::dispatch_decision`; anchor `rg -n 'non-vertebra file changed' ../rheo/crates`
→ one hit). It narrows when every changed path is a page in the CURRENT spine,
and the spine is rescanned each rebuild, so **a newly created page narrows to
just itself**. That is despite every other page's navigation, and rookery's
`spine-flat`-derived views, depending on the page list. It does a full rebuild
for a deleted page, a changed `[spine] prelude`, marrow, or any non-page file
such as `content/lib.typ`. After any narrowed rebuild, later full rebuilds are
still fed the old ligaments (rheo never resets `incoming_ligaments`).

## Steps

Create `tests/watch_narrow_rookery_structure.rs`. Each test is
`#[ignore = "needs ../rookery checkout"]`, runs on `cases/watch_narrow_rookery`
with `rookery_setup`, and ends with `.assert_clean()`.

1. `add_and_remove_pages`: create `content/notes/n13.typ` with one note
   tagged `alpha` that links `@idea:` to an existing note (`Expect::Any`;
   record what happens). Edit its body (`AnyNarrowed`). Delete the file
   (`Expect::Full`). Create it again (`Any`).
2. `library_edit_between_narrowed_edits`: edit a note body (`AnyNarrowed`);
   change the `idea-page` template's banner text in `content/lib.typ`
   (`Full`); edit a different note's body (`AnyNarrowed`); rename a tag used
   on several pages, all files in one step (`Any`); then edit `content/lib.typ`
   back (`Full`).
3. `batched_multi_file_edit`: one `Step::new` whose edit writes four different
   note pages at once, so they land in one debounced batch (`Any`). Then one
   step that edits a page AND `content/lib.typ` together (`Full`).
4. `revert_to_start`: take a copy of `build/html` before any step (run a
   no-op first step if the runner offers no hook), apply five varied edits,
   then revert each file to its original bytes in one step. Assert the final
   on-disk tree equals the initial snapshot with `html_tree_diffs`, on top of
   `assert_clean`. If the runner cannot expose the project path for this,
   report it rather than changing the runner.

## Non-goals

- Do not edit the fixture, the helpers, rheo, or rookery.
- Do not relax an `Expect`, or drop a step, to get a green run. Wrong output
  is the finding.

## Verify

```bash
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_structure -- --ignored --nocapture --test-threads=1
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_structure
cargo fmt --check && cargo clippy --tests -- -D warnings
```

Paste each test's step table and the first diff of each failing step into your
report. The second command reports 4 ignored. `../rheo` must resolve inside
the flight (bird rt-8e).