#!/bin/bash
# Run contract transplant CLI for Kaigan using the correct blueprint ID

set -e

BLUEPRINT_ID="yuki-js/mamizu_cash_reg@v4"
export DEPLOYER_PRIVATE_KEY=0x65d7efd64916f2b857e9d8af652e4915e418620a2bc751a466471d139571cfad

# Build the project (if not already built)
npm run --prefix "$(dirname "$0")/.." build

# Run the transplant CLI
node "$(dirname "$0")/../dist/index.js" transplant-from-blueprint --blueprint "$BLUEPRINT_ID"