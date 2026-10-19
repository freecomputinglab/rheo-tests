---
id: rt-link-rookery-into-flights-0957c288
short-id: '09'
title: Link rookery into flights
priority: 2
labels:
- fix-flight-rookery-path
deps: []
closed: false
---
Makes `scripts/flight-setup.sh` also link the sibling rookery checkout into a flight, so the rookery scenario tests find it at their default `../rookery` path inside a flight without setting `ROOKERY_DIR` by hand.

Touches: scripts/flight-setup.sh, CLAUDE.md

## Why

`rookery_dir()` in `src/helpers/scenario.rs` resolves `ROOKERY_DIR`, else `<CARGO_MANIFEST_DIR>/../rookery`. In the main checkout that is `/home/lox/code/_fcl/rookery`. In a flight (`<nest>/.birds/workspaces/<bird-id>/<flight-id>/`) it is `<nest>/.birds/workspaces/<bird-id>/rookery`, which does not exist — the same problem `flight-setup.sh` already solves for `../rheo` by symlinking `<bird-id>/rheo`. Four workers in one session each needed `ROOKERY_DIR` passed by hand.

## Steps

1. In `scripts/flight-setup.sh`, after the existing `ln -sfn "$sibling_rheo" "$bird_dir/rheo"` line, do the same for `$nest_root/../rookery` → `$bird_dir/rookery`. Rookery is optional: when the sibling directory is absent, print `flight-setup: no sibling rookery checkout at <path>; rookery tests will need ROOKERY_DIR` to stderr and **still exit 0** (unlike the rheo check, which stays fatal). When present, echo a `linked` line in the same shape as the rheo one.
2. Update the script's header comment to mention rookery in one line.
3. In `CLAUDE.md`, where it documents `flight-setup.sh` (anchor below), add one sentence: the script also links `../rookery` when it exists, which the rookery scenario tests need.

## Locate by anchor

In `/home/lox/code/_fcl/rheo-tests`:

- `rg -n 'ln -sfn "\$sibling_rheo" "\$bird_dir/rheo"' scripts` — one hit, near the end of `scripts/flight-setup.sh`.
- `rg -n 'flight-setup.sh' CLAUDE.md` — the paragraph(s) documenting it.
- `rg -n 'pub fn rookery_dir' src` — one hit, `src/helpers/scenario.rs`; read only, do not change.

## Non-goals

- Do not change `rookery_dir()` or any test.
- Do not make a missing rookery fatal.

## VERIFY

```bash
bash -n scripts/flight-setup.sh
t=$(mktemp -d) && mkdir -p $t/nest/.birds/workspaces/b/f && ln -s /home/lox/code/_fcl/rheo $t/rheo
scripts/flight-setup.sh $t/nest/.birds/workspaces/b/f; echo "exit=$?"; ls -la $t/nest/.birds/workspaces/b
ln -s /home/lox/code/_fcl/rookery $t/rookery
scripts/flight-setup.sh $t/nest/.birds/workspaces/b/f; echo "exit=$?"; ls -la $t/nest/.birds/workspaces/b
```

First run: `exit=0`, a `rheo` symlink, and the "no sibling rookery checkout" message. Second run: `exit=0` and both `rheo` and `rookery` symlinks.