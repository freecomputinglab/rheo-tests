---
id: rt-drive-scenarios-through-stdin-rebuilds-1b974d9c
short-id: 1b
title: Drive scenarios through stdin rebuilds
priority: 3
labels:
- test-watch-events
- parked
deps:
- blocked-by:rt-wait-on-watch-events-not-a-timeout-6b763f49
closed: false
---
Drives narrowed-rebuild scenarios through `rheo watch --trigger stdin`: each step applies its edit once, asks rheo for exactly one rebuild of the files it touched, and waits for that rebuild's `build_finished` event. This removes the re-apply-until-seen loop and the 2.5 s settle wait, and with them the hazard of an edit being applied twice.

Touches: src/helpers/devserver.rs, src/helpers/scenario.rs, tests/watch_narrow.rs, tests/watch_narrow_regressions.rs, tests/watch_narrow_rookery_smoke.rs, tests/watch_narrow_rookery_notes.rs, tests/watch_narrow_rookery_structure.rs, tests/watch_narrow_rookery_soak.rs, tests/watch_narrow_waterline.rs

**Parked until the sibling rheo checkout has BOTH `rheo watch --trigger stdin` and narrowed rebuilds.** `--trigger stdin` comes from the rheo bird “Trigger watch rebuilds from stdin” (`rh-trigger-watch-rebuilds-from-stdin-eeb16099`, label `feat-performance`); narrowed rebuilds (`[watch] narrow`, the `narrowed: ` log line) live on rheo's `feat/ligaments` bookmark. Both are in one working copy only once the operator rebases `feat/ligaments` onto the updated `feat/performance`. This repo builds whatever `../rheo`'s working copy holds. Check before unparking: `cargo run -q --manifest-path ../rheo/Cargo.toml -- watch --help | grep -- --trigger` AND `rg -n '"narrowed: ' ../rheo/crates/core/src/build.rs`. Blocked also by the bird “Wait on watch events, not a timeout”, which adds the events plumbing this builds on.

## What rheo provides

- `--trigger stdin`: no filesystem watcher, no debounce. Each stdin line `rebuild <path> [<path>...]` (paths relative to the project root, space-separated, no spaces inside a path) causes **exactly one** rebuild; `rebuild` with no paths also rebuilds. EOF ends the session.
- `--events <FILE>` (already wired into `DevServer` by the blocking bird): after each rebuild one line `{"event":"build_finished","initial":false,"ok":...,"kind":"full","ms":N}`. On the rebased branch `kind` may also be `"narrowed"`; do not depend on `kind` — the `narrowed: ` / `full rebuild: ` INFO log line is still the source for which path ran (see `rebuild_lines`).

## Steps

1. **`DevServer`** (`src/helpers/devserver.rs`):
   - Add `pub fn start_driven(project_path: &Path, extra_args: &[&str]) -> Self`, identical to `start` but also passing `--trigger stdin` and spawning with `.stdin(Stdio::piped())`, keeping the `ChildStdin` in a new `Option<ChildStdin>` field (`None` for `start`). Factor the shared spawn-and-wait body out of `start` rather than copying it.
   - Add `pub fn rebuild(&self, paths: &[&str]) -> String`: count current `"initial":false` `build_finished` lines in `events()`, write `rebuild <paths joined by " ">\n` to stdin and flush, poll `events()` every 20 ms until one more such line exists (fail immediately with the log if the child exits; no time limit otherwise), then wait until `rebuild_lines()` has grown past its count from before the request (the INFO line is logged before the event is written, but arrives through a separate pipe-reader thread; give this a 5 s cap and panic with the log if it is exceeded). Return the newest `rebuild_lines()` entry. Needs `&self` → wrap the `ChildStdin` in a `Mutex`.
   - Add `pub fn last_build_ms(&self) -> u128` parsing `"ms":N` from the newest `build_finished` line (tiny hand parse; no `serde_json` — the format is fixed).
   - Delete `edit_and_wait_for_rebuild`, `REBUILD_QUIESCE` and `REBUILD_TIMEOUT` once nothing uses them. Keep `wait_for_edit` and `REEDIT_INTERVAL`: `tests/watch.rs` uses them to test the real filesystem watcher, which must stay covered.
2. **`Step`** (`src/helpers/scenario.rs`): add a `paths: Vec<&'static str>` field naming the files the edit touches. `Step::replace`, `Step::append`, `Step::write` and `Step::remove` already know their `rel`; set `paths: vec![rel]`. `Step::new` gains a `paths: &[&'static str]` parameter before the closure. Simplify `Step::replace` back to non-idempotent: panic if `from` is absent — each edit now runs exactly once, so the `to`-already-present branch and its doc paragraph go.
3. **`Scenario::run`**: start with `DevServer::start_driven`, and per step call `(step.edit)(project)` once then `server.rebuild(&step.paths)`. Set `StepReport::millis` from `server.last_build_ms()` (rheo's own measurement) instead of wall-clock.
4. **Tests**: update every `Step::new(...)` call to pass its paths, and every direct `edit_and_wait_for_rebuild(...)` call in `tests/watch_narrow.rs` and `tests/watch_narrow_regressions.rs` to an edit followed by `server.rebuild(&[...])`, with those tests started via `start_driven`. Leave `tests/watch_narrow_speed.rs` alone — the bird “Time the speed test from rheo's own ms” moves it, and depends on this one.

## Locate by anchor

In `/home/lox/code/_fcl/rheo-tests`:

- `rg -n 'pub fn edit_and_wait_for_rebuild' src` — one hit, `src/helpers/devserver.rs`.
- `rg -n 'const REBUILD_QUIESCE' src` / `rg -n 'const REBUILD_TIMEOUT' src` — one hit each.
- `rg -n 'pub fn start\(project_path: &Path' src` — one hit, `DevServer::start`.
- `rg -n 'pub struct Step \{' src` — one hit, `src/helpers/scenario.rs`.
- `rg -n 'let log_line = server.edit_and_wait_for_rebuild' src` — one hit, in `Scenario::run`.
- `rg -n 'edit_and_wait_for_rebuild|Step::new\(' tests` — every call site to update.

## Non-goals

- Do not change `wait_for_edit`, `REEDIT_INTERVAL` or `tests/watch.rs`.
- Do not change any scenario's edits or expectations beyond adding paths — a test that was failing on a known rheo bug should fail the same way afterwards.
- Do not touch `tests/watch_narrow_speed.rs`.
- Do not add `serde_json`.

## VERIFY

```bash
cargo fmt --check
cargo clippy --lib --test watch --test watch_narrow --test watch_narrow_regressions --test watch_narrow_rookery_smoke --test watch_narrow_rookery_notes --test watch_narrow_rookery_structure --test watch_narrow_rookery_soak --test watch_narrow_waterline -- -D warnings
rg -n 'edit_and_wait_for_rebuild|REBUILD_QUIESCE' src tests   # expect no output
RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 cargo test --test watch --test watch_narrow -- --test-threads=1
ROOKERY_DIR=/home/lox/code/_fcl/rookery RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 cargo test --test watch_narrow_rookery_smoke -- --ignored --nocapture
```

The non-ignored tests pass. The smoke run completes every step (pass or fail on known rheo staleness — report which) with no doubled edits and no timeouts. Report each step's `millis` from the smoke table.