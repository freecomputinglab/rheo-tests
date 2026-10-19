---
id: rt-waterline-narrowed-session-62ae4e84
short-id: '62'
title: Waterline narrowed session
priority: 2
labels:
- test-watch-narrow
deps:
- blocked-by:rt-rookery-scenario-runner-a2ef0ed7
closed: true
---
Touches: tests/watch_narrow_waterline.rs (new)

## Why

The fixture is small. The project where stale derived pages were actually
reported is the operator's real rookery site, waterline: about 860 pages,
`[watch] narrow = true`, at `/home/lox/code/waterline/rookery`. This bird adds
an opt-in, machine-local test that copies that site into a tempdir (never
building in place), runs a short scripted session under `rheo watch`, and
compares the on-disk build after every step against a fresh full compile.
Uses the scenario runner from bird rt-rookery-scenario-runner-a2ef0ed7 (this bird's dependency). Find it
with `rg -n 'pub struct Scenario' src`. If it is missing, stop and report.

Facts (read at filing time):
- waterline's `rheo.toml` resolves `@rookery` from a git repo,
  `[packages.rookery] repo = "/home/lox/code/_fcl/rookery"`, `branch = "dev"`.
  That is an absolute path, so it still works after copying. It reads the
  `dev` branch of that repo, NOT the working tree.
- It sets `[spine] prelude = "_lib/prelude.typ"` and excludes several `_lib/`
  directories. Example pages: `writing/weeknotes/26w23.typ`,
  `writing/blog/a-comparison-of-elm-and-react.typ`, `nest/homelab.typ`.
- A full compile of it takes tens of seconds even in release, and this test
  runs one per step, so it must use a release `RHEO_BIN`.

## Steps

1. Create `tests/watch_narrow_waterline.rs` with one test,
   `#[ignore = "machine-local; needs WATERLINE_DIR"]`, `waterline_session`.
   Read the env `WATERLINE_DIR`; when it is unset or lacks `rheo.toml`, panic
   with a one-line message saying to set it.
2. If `Scenario::run` takes a fixture path relative to this repo, pass an
   absolute path only if `TestCase::new`/`copy_project_to_test_store` accept
   one. Otherwise report what is missing, and do not modify the runner. Its
   `setup` closure does nothing (waterline's `rheo.toml` already has `version`
   and `[watch] narrow`). If the runner overwrites `version`, that is fine.
3. Five steps, chosen by reading the copied project. Pick targets that exist
   at test time, and if a named file is gone, pick a sibling of the same kind:
   (a) change one word of prose in the newest weeknote; (b) retitle a
   `#idea`/`ideate` note in a `nest/` page; (c) add an `@idea:` reference from
   a blog post to an existing note owned by a nest page; (d) remove that
   reference; (e) edit one prose word in `_lib/prelude.typ`'s comments only
   (`Expect::Full`). Use `Expect::Any` elsewhere.

## Non-goals

- Never write to `/home/lox/code/waterline` itself. Assert that the project
  path the runner gives the edits starts with the system temp dir.
- Do not change the runner, rheo, rookery, or waterline.

## Verify

```bash
cargo build --manifest-path ../rheo/Cargo.toml -p rheo --release
RHEO_BIN=../rheo/target/release/rheo WATERLINE_DIR=/home/lox/code/waterline/rookery cargo test --test watch_narrow_waterline -- --ignored --nocapture
cargo test --test watch_narrow_waterline
cargo fmt --check && cargo clippy --tests -- -D warnings
```

If the release binary lands elsewhere (a shared `CARGO_TARGET_DIR`), use the
path cargo prints. Paste the step table into your report. The third command
reports 1 ignored. `../rheo` must resolve inside the flight (bird rt-8e).