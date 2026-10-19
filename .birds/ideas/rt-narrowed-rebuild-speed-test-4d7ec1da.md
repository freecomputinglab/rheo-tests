---
id: rt-narrowed-rebuild-speed-test-4d7ec1da
short-id: 4d
title: Narrowed-rebuild speed test
priority: 2
labels:
- test-watch-narrow
deps:
- blocked-by:rt-narrowed-rebuild-harness-5c59db1c
closed: false
---
Touches: tests/watch_narrow_speed.rs (new)

## Why

`[watch] narrow = true` exists to make `rheo watch` rebuilds faster: an edit to
one page recompiles that page, plus its ligament dependents, instead of every
page. Nothing measures whether it does. This bird adds an opt-in timing test.

Uses helpers from bird rt-narrowed-rebuild-harness-5c59db1c (this bird's dependency):
`DevServer::start(project, &["--html"])`, `DevServer::edit_and_wait_for_rebuild(edit) -> String`
(applies the edit and returns the `narrowed: …`/`full rebuild: …` log line that
rheo writes AFTER the disk outputs), and `DevServer::wait_for_edit(path, edit, pred)`
(polls a served page). Find them with
`rg -n 'fn edit_and_wait_for_rebuild|pub fn wait_for_edit' src`. If they are
missing, stop and report.

Fact to design around: with `--open`, which `DevServer` always passes, each edit
runs the narrowed DISK rebuild and THEN a separate full in-memory compile for the
dev server (`update_dev_server` → `Build::compile_for_watch` in
`../rheo/crates/cli/src/lib.rs`; `rg -n 'fn update_dev_server' ../rheo/crates`).
So two latencies matter, and this test reports both:
- **disk latency**: edit → rebuild log line. This is what narrowing should shrink.
- **served latency**: edit → served page shows the edit. Expect little gain,
  because the full in-memory compile still runs. Report this number; do not
  assert on it.

## Steps

1. `tests/watch_narrow_speed.rs`. A helper `fn generate(dir: &Path, narrow: bool)`
   writes 200 pages, `p000.typ` … `p199.typ`. Each holds a heading, the marker
   text `MARK-<nnn>-0`, and `#lorem(1500)`. It also writes `rheo.toml` with
   `version = "<rheo_core::config::manifest_version::CURRENT>"`,
   `formats = ["html"]`, and, when `narrow`, a `[watch]` table with `narrow = true`.
   No ligaments: that keeps the narrowed set at exactly one page.
2. One `#[test] #[ignore = "timing; run explicitly"]` named
   `narrowed_rebuild_is_faster_than_full`. Run the following once with
   `narrow = true` and once with `narrow = false`, in separate tempdirs, one
   server at a time:
   - Start the server. Do one warm-up edit (replace `MARK-100-0` with `MARK-100-w`
     in `p100.typ`, then `edit_and_wait_for_rebuild`). The first rebuild of a
     session can differ from the rest.
   - Then 3 timed edits, k = 1..=3: replace the previous marker in p100.typ with
     `MARK-100-<k>`. Time `edit_and_wait_for_rebuild` with `Instant`, subtracting
     the helper's own 2.5 s settle wait if it is included (read the helper and
     do whichever is correct). Then time
     `wait_for_edit("/p100.html", || {}, |b| b.contains("MARK-100-<k>"))`,
     measured from the edit.
   - With narrow on, assert every returned line starts `narrowed: 1 vertebra(e)`.
     With narrow off, assert it starts `full rebuild:`.
   - Take the median of each latency.
3. Print one table with `eprintln!` (disk/served medians, narrow vs full). Assert
   only: narrow disk median ≤ 0.5 × full disk median. The assertion message
   must include both numbers.

## Non-goals

- No assertion on served latency, and no change to rheo, `DevServer`, or any
  other test file.
- Do not raise the page count past 200 to make the gap look bigger.

## Verify

```bash
RHEO_BIN=$(cargo build --manifest-path ../rheo/Cargo.toml -p rheo --release --message-format=json 2>/dev/null | jq -r 'select(.executable != null) | .executable' | tail -1) \
  cargo test --test watch_narrow_speed -- --ignored --nocapture
RHEO_MANIFEST=../rheo/Cargo.toml cargo test --test watch_narrow_speed
cargo fmt --check && cargo clippy --tests -- -D warnings
```

The first command prints the timing table and passes. Paste the table into your
report. If the assertion fails, i.e. narrowing is NOT twice as fast on disk,
leave it failing and report the numbers: that is a real finding, not a test bug.
The second command reports 1 ignored. If `jq` is not on PATH, build first and
point `RHEO_BIN` at `../rheo/target/release/rheo` or wherever cargo reports the
binary. If `../rheo` does not resolve inside the flight, this is blocked on rt-8e.