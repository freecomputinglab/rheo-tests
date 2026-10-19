# CLAUDE.md

This repo is a standalone integration-test suite; it depends on the main
`rheo` crates via path deps (`Cargo.toml`), resolved against a sibling
checkout at `../rheo`. Invocations need:

```bash
RHEO_MANIFEST=../rheo/Cargo.toml TYPST_IGNORE_SYSTEM_FONTS=1 cargo test ...
```

## Building inside a `bd` flight

A `bd` flight sits at `.birds/workspaces/<bird-id>/<flight-id>/`, so
`../rheo` from the flight's `Cargo.toml` means
`.birds/workspaces/<bird-id>/rheo` — which doesn't exist, and cargo reads a
path dependency's own manifest before any `.cargo/config.toml` `paths`
override can apply, so that override does nothing here. Before building
inside a flight, run:

```bash
scripts/flight-setup.sh <flight-path>
```

It symlinks `<bird-id>/rheo` to the real sibling `../rheo` checkout
(idempotent, fails loudly if that checkout is missing). Then build with:

```bash
CARGO_TARGET_DIR=<nest>/target RHEO_MANIFEST=../rheo/Cargo.toml \
  TYPST_IGNORE_SYSTEM_FONTS=1 cargo test ...
```

Reusing the nest's `CARGO_TARGET_DIR` instead of letting the flight compile
its own target dir brings a cold flight build down to ~29s by reusing the
nest's already-compiled typst dependencies.
