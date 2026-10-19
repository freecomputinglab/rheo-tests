---
id: rt-time-the-speed-test-from-rheo-s-own-ms-31bb676f
short-id: '31'
title: Time the speed test from rheo's own ms
priority: 2
labels:
- test-watch-events
- parked
deps:
- blocked-by:rt-drive-scenarios-through-stdin-rebuilds-1b974d9c
closed: false
---
Makes the narrowed-rebuild speed test compare rheo's own measured build times instead of wall-clock time, which today is dominated by the filesystem watcher's ~200 ms debounce and makes narrowed and full rebuilds look identical (~205 ms each).

Touches: tests/watch_narrow_speed.rs

**Parked for the same reason as, and blocked by,** the bird “Drive scenarios through stdin rebuilds”: it needs `DevServer::start_driven`, `DevServer::rebuild` and `DevServer::last_build_ms` from that bird, and a sibling rheo checkout with both `--trigger stdin` and narrowed rebuilds. Check before unparking: `rg -n 'pub fn last_build_ms' src` finds one hit.

## Why

`tests/watch_narrow_speed.rs` generates a 200-page fixture twice (with and without `[watch] narrow = true`), times three edits each, and asserts the narrowed median disk latency is at most half the full one. Its "disk latency" is wall-clock from the edit to `edit_and_wait_for_rebuild` returning, minus that helper's 2.5 s settle wait. That includes rheo's debounce (`DEBOUNCE_QUIET` 150 ms polled every 50 ms), so both modes measured ~205 ms and the assertion failed for a reason unrelated to narrowing.

`DevServer::last_build_ms()` returns the `ms` rheo itself recorded for the latest build: from the top of the rebuild (after any debounce — and under `--trigger stdin` there is none) to output on disk plus the in-memory push to the dev server.

## Steps

1. Start both sessions with `DevServer::start_driven` instead of `DevServer::start`.
2. For each timed edit (and the warm-up): write the edit once, call `server.rebuild(&["p100.typ"])` (use the actual relative path the test writes — find it with `rg -n 'p100' tests/watch_narrow_speed.rs`), keep its returned log line for the existing rebuild-kind assertion, and record `Duration::from_millis(server.last_build_ms() as u64)` as the disk latency.
3. Delete the file's local `REBUILD_QUIESCE` constant and the `saturating_sub(REBUILD_QUIESCE)` subtraction.
4. Keep the served-latency measurement and the 0.5× assertion unchanged. Update the module doc comment's description of "disk latency" to say it is rheo's own reported build time.

## Locate by anchor

- `rg -n 'const REBUILD_QUIESCE' tests/watch_narrow_speed.rs` — one hit (~line 28).
- `rg -n 'saturating_sub\(REBUILD_QUIESCE\)' tests` — one hit (~line 82).
- `rg -n 'DevServer::start\(' tests/watch_narrow_speed.rs` — one hit.

## Non-goals

- Do not change the fixture size, page bodies, number of edits, or the 0.5× threshold.
- Do not edit `src/helpers/`.

## VERIFY

```bash
cargo fmt --check && cargo clippy --test watch_narrow_speed -- -D warnings
cargo test --test watch_narrow_speed           # expect: 1 ignored
RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 cargo test --release --test watch_narrow_speed -- --ignored --nocapture
```

Report the printed medians for both modes, whether the assertion passed, and whether other cargo/rheo processes were running at the time. A failing assertion with clearly different medians is a real finding to report, not something to tune away.