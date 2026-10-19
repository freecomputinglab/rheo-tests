---
id: rt-wait-on-watch-events-not-a-timeout-6b763f49
short-id: 6b7
title: Wait on watch events, not a timeout
priority: 3
labels:
- test-watch-events
- parked
deps: []
closed: false
---
Makes `DevServer::start` wait for rheo's own "initial build finished" event instead of a fixed 30-second timeout, so a large site such as waterline (~30 s initial compile) starts reliably, and a crashed `rheo watch` fails the test immediately with its log.

Touches: src/helpers/devserver.rs

**Parked until the sibling rheo checkout supports `rheo watch --events <FILE>`.** That flag comes from the rheo bird “Report watch builds as JSON events” (`rh-report-watch-builds-as-json-events-55cb28ea`, label `feat-performance` in `/home/lox/code/_fcl/rheo`). This repo builds rheo from whatever `../rheo`'s working copy holds (`Cargo.toml` path deps plus `RHEO_MANIFEST=../rheo/Cargo.toml`), so nothing here can pass until that working copy has the flag. Check before unparking: `cargo run -q --manifest-path ../rheo/Cargo.toml -- watch --help | grep -- --events`.

## What rheo provides (as specified in that rheo bird)

`rheo watch --events <FILE>` appends one JSON line per event to FILE, flushed per line, fixed field order, no spaces:

- `{"event":"server_ready","url":"http://localhost:3001"}` — under `--open`, when the dev server binds.
- `{"event":"build_finished","initial":true,"ok":true,"kind":"full","ms":1234}` — after every build; `"initial":true` only for the first. A failed build has `"ok":false` and an `"error":"..."` field after `ms`.

Contract: under `--open`, `server_ready` always comes before the first `"initial":true` `build_finished`. Waiting for that `build_finished` means the initial build is on disk and the server holds it in memory.

## Steps

1. In `src/helpers/devserver.rs`, give `DevServer` a `tempfile::TempDir` field holding the events file (`events.jsonl`), and pass `--events <that path>` in `DevServer::start` alongside `--open`. Keep the `TempDir` alive for the struct's lifetime.
2. Add `pub fn events(&self) -> Vec<String>`, returning every line of the events file read so far (an absent file reads as empty).
3. Replace the startup loop in `DevServer::start` (anchor below): instead of searching the log for a port under `STARTUP_TIMEOUT`, poll `events()` every 50 ms until a line starts with `{"event":"build_finished","initial":true`. Take the port from the `server_ready` line's `url` (reuse `parse_port`, which already extracts the digits after `localhost:`). Keep the `child.try_wait()` check exactly as now, so an exited process still panics with the full log. **No time limit on this wait** — that is the point; the child exiting is the failure signal. Remove `STARTUP_TIMEOUT` and the deadline panic.
4. If the initial `build_finished` has `"ok":false`, do not panic — `rheo watch` keeps running after a failed initial build, and some tests may want that. Just return; callers inspect `log()`.
5. Update `start`'s doc comment: it now waits for the initial build to finish, not merely for the port.

## Locate by anchor

In `/home/lox/code/_fcl/rheo-tests` (flight paths: rebase onto the flight):

- `rg -n 'const STARTUP_TIMEOUT' src` — one hit, `src/helpers/devserver.rs` (~line 18). Remove.
- `rg -n 'did not report a server URL within' src` — one hit, the deadline panic inside `pub fn start` (~line 87). Remove.
- `rg -n 'let port = log.lock\(\).unwrap\(\).lines\(\).find_map\(parse_port\);' src` — one hit, the loop to replace (~line 74).
- `rg -n 'fn parse_port' src` — one hit (~line 249). Keep; reuse on the `url`.

## Non-goals

- Do not change `wait_for_edit`, `edit_and_wait_for_rebuild`, `rebuild_lines`, `REEDIT_INTERVAL` or `REBUILD_QUIESCE` — a later bird replaces those.
- Do not add `--trigger stdin` here.
- Do not touch any test file.

## VERIFY

```bash
cargo fmt --check
cargo clippy --lib --test watch -- -D warnings
RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 cargo test --test watch -- --test-threads=1
rg -n 'STARTUP_TIMEOUT' src   # expect no output
```

(Plain `cargo clippy --tests` has ~99 pre-existing errors in `tests/harness.rs` and `tests/manifest_packages.rs`; scope it as above.)