#!/bin/bash
# Run prove4d CLI with the correct blueprint ID and EML file for quick proof generation test

set -e

BLUEPRINT_ID="yuki-js/mamizu_cash_reg@v4"
EML_PATH="docs/verify-email.eml"

# Build the project (if not already built)
npm run --prefix "$(dirname "$0")/.." build
# Ensure fixtures directory exists
mkdir -p "$(dirname "$0")/../fixtures"

# if BASE env var is 1 set, switch 0xba1e to BASE adde  ss
if [ "$BASE" == "1" ]; then
  # Use Verifier contract address directly (not wrapper)
  ADDR="0xE61A892565166A2f5cfbF474DD864691922F175D"
else
  ADDR="0x1ff35617d792a88f396008b1e109585020571d49"
fi

# Generate proof fixture
TMP_FIXTURE="$(dirname "$0")/../fixtures/proof.json"
node "$(dirname "$0")/../dist/index.js" gen-fixture --blueprint "$BLUEPRINT_ID" --eml "$EML_PATH" --verifier "$ADDR" --out "$TMP_FIXTURE"
echo "Fixture saved to $TMP_FIXTURE"

# Verify proof fixture on-chain
node "$(dirname "$0")/../dist/index.js" verify-fixture --fixture "$TMP_FIXTURE" --verifier "$ADDR"