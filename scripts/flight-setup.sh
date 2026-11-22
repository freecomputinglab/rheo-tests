#!/usr/bin/env bash
# Link a bd flight back to the sibling rheo checkout so Cargo.toml's path
# deps (../rheo/crates/*) resolve inside it. Cargo reads a path dependency's
# manifest relative to the flight's own directory, so a flight at
# <nest>/.birds/workspaces/<bird-id>/<flight-id>/ needs its own
# <bird-id>/rheo symlink — a .cargo/config.toml `paths` override does not
# help, because cargo loads the dependency's manifest before applying it.
#
# Usage: scripts/flight-setup.sh <flight-path>
set -euo pipefail

flight_path=${1:?usage: flight-setup.sh <flight-path>}
flight_path=$(cd "$flight_path" && pwd)
bird_dir=$(dirname "$flight_path")

# Nest root is four levels up from a flight: <nest>/.birds/workspaces/<bird>/<flight>
nest_root=$(cd "$flight_path/../../../.." && pwd)
sibling_rheo="$nest_root/../rheo"

if [ ! -d "$sibling_rheo" ]; then
    echo "flight-setup: sibling rheo checkout not found at $sibling_rheo" >&2
    exit 1
fi

ln -sfn "$sibling_rheo" "$bird_dir/rheo"
echo "flight-setup: linked $bird_dir/rheo -> $sibling_rheo"
