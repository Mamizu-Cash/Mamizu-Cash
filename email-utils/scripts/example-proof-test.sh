#!/bin/bash
# Run prove4d CLI with the correct blueprint ID and EML file for quick proof generation test

set -e

BLUEPRINT_ID="Bisht13/SuccinctZKResidencyInvite@v3"
EML_PATH="../docs/residency.eml"

# Build the project (if not already built)
npm run --prefix "$(dirname "$0")/.." build

# Run the CLI
node "$(dirname "$0")/../dist/index.js" --blueprint "$BLUEPRINT_ID" --eml "$EML_PATH"