---
id: rt-rookery-soak-walk-19cffda4
short-id: '19'
title: Rookery soak walk
priority: 2
labels:
- test-watch-narrow
deps:
- blocked-by:rt-rookery-scenario-runner-a2ef0ed7
closed: false
---
Touches: tests/watch_narrow_rookery_soak.rs (new)

## Why

Hand-written scenarios only cover the orders someone thought of. This bird adds
a seeded random walk: a long, reproducible sequence of mixed edits on the
rookery fixture, with the full-compile oracle after every step. It catches
staleness that only shows up after an unusual history. Uses the scenario runner
and fixture from bird rt-rookery-scenario-runner-a2ef0ed7 (this bird's dependency). Find them with
`rg -n 'pub struct Scenario|pub fn rookery_setup' src`. If they are missing,
stop and report.

## Steps

1. Create `tests/watch_narrow_rookery_soak.rs`. Add no RNG crate: write a
   ten-line xorshift64 struct in the file, seeded from env `RHEO_SOAK_SEED`
   (default `1`). Step count comes from env `RHEO_SOAK_STEPS` (default `25`).
2. An edit vocabulary as an enum, `SoakEdit`, with a method producing a `Step`
   from the current project state. Each variant reads the project files to
   choose a target, so edits stay valid as the tree changes:
   - `BodyWord`: replace one word in a random note body.
   - `Retitle`: change a random note's `title: [..]`.
   - `ToggleTag`: add or remove `alpha`/`beta`/`gamma` on a random note.
   - `AddLink`: add `@idea:<random id>` to a random page that does not own that id.
   - `RemoveLink`: remove one existing `@idea:` reference.
   - `PostTitle`: change a `posts/pN.typ` `#set document(title: ..)`.
   - `NewPage`: create `notes/s<k>.typ` with a fresh note.
   - `DeletePage`: delete one `notes/s<k>.typ` created earlier.
   - `LibTouch`: change the banner text in `content/lib.typ`.
   Weight it towards content edits (about 70% `BodyWord`/`Retitle`/`ToggleTag`/
   `AddLink`/`RemoveLink`/`PostTitle`). Every step uses `Expect::Any`: this test
   judges output, not which path ran. Because steps depend on the live tree,
   build the step list lazily. If the runner only takes a fixed `Vec<Step>`, give
   each `Step`'s edit closure the job of choosing its target from the files at
   apply time.
3. One test, `#[ignore = "soak; needs ../rookery checkout"]`, `rookery_soak`.
   Print the seed and step count first. Each step's `name` is the variant plus
   its target ("Retitle n07b"), so a failure can be replayed by seed.

## Non-goals

- Do not edit the runner, the fixture, rheo, or rookery.
- No shrinking or minimisation. Report the seed and the first failing step.

## Verify

```bash
RHEO_SOAK_SEED=1 RHEO_SOAK_STEPS=25 RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_soak -- --ignored --nocapture
RHEO_SOAK_SEED=1 RHEO_SOAK_STEPS=25 RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_soak -- --ignored --nocapture
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_rookery_soak
cargo fmt --check && cargo clippy --tests -- -D warnings
```

The first two runs must print the SAME sequence of step names, which shows the
walk is deterministic. Paste one table into your report. The third command
reports 1 ignored. `../rheo` must resolve inside the flight (bird rt-8e).