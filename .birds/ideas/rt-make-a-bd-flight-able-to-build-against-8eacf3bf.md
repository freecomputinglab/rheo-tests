---
id: rt-make-a-bd-flight-able-to-build-against-8eacf3bf
short-id: 8e
title: Make a bd flight able to build against the sibling rheo checkout
priority: 3
labels:
- fix-flight-sibling-path-dep
deps: []
closed: false
---
Touches: .cargo/config.toml (new, gitignored), .gitignore, README.md, and possibly scripts/flight-setup.sh (new) + CLAUDE.md (new)

A `bd` flight in this repo cannot build, because `Cargo.toml`'s sibling path
dependencies do not resolve from inside a flight workspace.

MEASURED, 2026-09-18, flying three birds here: `bd slip` puts a flight at

```
<nest>/.birds/workspaces/<bird-id>/<flight-id>/
```

`Cargo.toml` (lines 15-19) declares

```toml
rheo-core = { path = "../rheo/crates/core" }
rheo-html = { path = "../rheo/crates/html" }
rheo-pdf  = { path = "../rheo/crates/pdf" }
rheo-epub = { path = "../rheo/crates/epub" }
```

Those are relative to the manifest's own directory, so from a flight `../rheo`
means `.birds/workspaces/<bird-id>/rheo`, which does not exist. Every cargo
command inside a fresh flight fails. A flight worker is forbidden to run
`jj`/`git` and is told never to leave the flight path, so it cannot fix this
itself — three separate agents hit it in one session and each needed the
orchestrator to prepare the flight by hand first.

The manual workaround that worked, per flight:

```bash
ln -sfn /home/lox/code/_fcl/rheo <nest>/.birds/workspaces/<bird-id>/rheo
```

plus `CARGO_TARGET_DIR=<nest>/target` on every cargo invocation, which brings a
cold flight build down to ~29s by reusing the nest's compiled typst
dependencies instead of recompiling them per flight.

Two avenues are closed, so do not spend time on them: `bd` has no post-slip
hook (see its command list in `bd --help`), and the flight location is not
configurable — `.birds/manifest.toml` takes only `schema`, `prefix`, `backend`,
`ideas`, `[markup]` and `[ideas-scan]`.

## Steps

1. **Try the cargo path override first.** A flight is a *descendant* of the
   nest root, so cargo walking up from a flight directory reaches
   `<nest>/.cargo/config.toml`, and `paths` entries in a config file resolve
   relative to that file's own parent directory — i.e. against the nest, where
   `../rheo` is correct. Create `.cargo/config.toml` at the repo root:

   ```toml
   paths = ["../rheo/crates/core", "../rheo/crates/html", "../rheo/crates/pdf", "../rheo/crates/epub"]
   ```

   Add `/.cargo/` to `.gitignore`: the entry is machine-local (it hard-codes
   this checkout's sibling layout) and CI has no use for it, since CI clones
   `rheo-tests` beside `rheo` where the plain path deps already resolve.

2. **Verify step 1 actually takes, and do not assume it does.** Cargo may have
   to read `../rheo/crates/core/Cargo.toml` to resolve the dependency graph
   *before* any path override applies, in which case a flight still fails with
   a missing-manifest error and this avenue is dead. Run the VERIFY below. If
   it fails, delete `.cargo/config.toml` and the `.gitignore` line and go to
   step 3 instead — report which branch you took.

3. **Fallback: make preparing a flight one command.** Add
   `scripts/flight-setup.sh`, taking a flight path as its only argument,
   deriving the bird directory from it (the flight path's parent) and creating
   the `rheo` symlink there, pointing at the sibling `rheo` checkout resolved
   from the nest root. Make it idempotent (`ln -sfn`) and have it fail loudly
   when the sibling checkout is absent. `just` is not in this repo's devShell
   and there is no Justfile, so a plain shell script is the right shape — do
   not add a `just` dependency for this.

4. **Write it down either way.** This repo has no `CLAUDE.md`. Add one whose
   whole job is the non-obvious local invocation: the sibling-checkout
   requirement, `RHEO_MANIFEST=../rheo/Cargo.toml`,
   `TYPST_IGNORE_SYSTEM_FONTS=1`, the `CARGO_TARGET_DIR` reuse and its measured
   payoff, and whichever of step 1 / step 3 landed. Keep it short — this is a
   note about how to run the suite here, not a tour of the repo. Add the same
   flight note to `README.md` beside the existing `RHEO_MANIFEST` line (around
   line 110) so a human reading the README finds it too.

## Non-goals

- Do not change `Cargo.toml`'s path dependencies. They are correct for the
  sibling-checkout layout that CI and every human checkout use; the flight is
  the odd case and must adapt to them, not the reverse.
- Do not file or fix anything in `birds-rs` from here. A post-slip hook in `bd`
  would solve this class of problem generally, but that is a separate repo and
  a separate decision.
- No change to how the tests themselves locate rheo (`RHEO_MANIFEST`,
  `src/helpers/cli.rs`) — that layer already works.

## VERIFY

Slip a throwaway bird and build inside its flight **without creating any
symlink by hand**:

```bash
cd <nest>
bd create "TEMP flight path dep probe" --json          # note the id
bd slip <that-id> --json                               # note flight_id + path
cd <the flight path>
CARGO_TARGET_DIR=<nest>/target RHEO_MANIFEST=../rheo/Cargo.toml \
  TYPST_IGNORE_SYSTEM_FONTS=1 cargo test --test watch
```

All three tests in `tests/watch.rs` pass from inside the flight. Then clean up
the probe:

```bash
bd flight --id <flight-id> abandon      # discards the flight AND the bird doc
```

Under step 3's fallback the same VERIFY applies with one
`scripts/flight-setup.sh <flight path>` run first, and that command belongs in
the `CLAUDE.md` you write.