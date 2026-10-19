---
id: rt-rookery-note-edit-scenarios-f15982a6
short-id: f1
title: Rookery note-edit scenarios
priority: 3
labels:
- test-watch-narrow
deps:
- blocked-by:rt-rookery-scenario-runner-a2ef0ed7
closed: true
---
Touches: tests/watch_narrow_rookery_notes.rs (new)

## Why

These are scripted sequences of realistic note edits on the rookery fixture,
each checked against a fresh full compile after every step. Uses the scenario
runner and the fixture from bird rt-rookery-scenario-runner-a2ef0ed7 (this bird's dependency):
`Scenario`, `Step` (`Step::replace/append/write/remove`), `Expect`,
`ScenarioReport::assert_clean`, `rookery_setup`, and the fixture
`cases/watch_narrow_rookery/`. Find them with
`rg -n 'pub struct Scenario|pub fn rookery_setup' src`. If they are missing,
stop and report.

Read the fixture's `content/notes/*.typ` first and pick concrete note ids and
words from it. The ids below (`n03a` …) are placeholders for "a note owned by
file nNN".

## Steps

Create `tests/watch_narrow_rookery_notes.rs` with four tests. Each is
`#[ignore = "needs ../rookery checkout"]`, builds one `Scenario`, calls
`.run("cases/watch_narrow_rookery", rookery_setup)`, then `.assert_clean()`.
Every step uses `Expect::AnyNarrowed` unless stated otherwise.

1. `note_lifecycle`, in order: edit a note's body text; retitle it; add tag
   `beta` (it must then appear on `outline-alpha` only if it is also `alpha`;
   just let the oracle judge); remove that tag again; delete the whole `#idea(..)`
   call from its page; restore it exactly as it was.
2. `backlinks_follow_links`: on a page with no link to note X (owned
   elsewhere), add `@idea:X`; edit X's title (the referrer's link text must
   follow); remove the link; add links to X from two different pages in one
   step (one `Step::new` editing both files).
3. `note_moves_between_pages`: in ONE step, cut a whole `#idea` block from
   page A and paste it into page B, so the same id is owned by a new file. Then
   edit its body. Then move it back.
4. `rename_note_id`: in ONE step, change a note's id and every `@idea:`/`#window(..)`
   that names it, across all files. Then edit the renamed note's body. The
   oracle catches a ghost of the old id surviving in `ideas/index.html`, the
   search index or an outline.

Write each step's `name` as a short sentence ("retitle n03a"), since it is
what the failure table shows.

## Non-goals

- Do not edit the fixture, the helpers, rheo, or rookery. If a scenario needs
  a fixture change, report it instead.
- Do not weaken a step to make it pass. A failing step is a finding: leave it
  failing.
- No timing assertions.

## Verify

```bash
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_notes -- --ignored --nocapture --test-threads=1
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_notes
cargo fmt --check && cargo clippy --tests -- -D warnings
```

The first command runs all four. Paste each one's step table into your report,
including the first diff of every failing step. The second command reports 4
ignored. `../rheo` must resolve inside the flight (bird rt-8e).