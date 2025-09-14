#!/bin/bash
# Run prove4d CLI with the correct blueprint ID and EML file for quick proof generation test

set -e

BLUEPRINT_ID="yuki-js/mamizu_cash_reg@v4"
EML_PATH="../docs/verify-email.eml"

# Build the project (if not already built)
npm run --prefix "$(dirname "$0")/.." build


node "$(dirname "$0")/../dist/index.js" proveplain --blueprint "$BLUEPRINT_ID" --eml "$EML_PATH"