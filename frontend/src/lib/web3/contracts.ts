// Contract addresses on Kaigan network
export const CONTRACT_ADDRESSES = {
  COUNTER: "0x7B18E306359529Fc135d8740c3E2ECb65d4b8C46" as `0x${string}`,
  ALWAYS_ALLOW: "0xee77e2d45ba22173114733594f0d6f8c33385721" as `0x${string}`,
  BUSINESS_VERIFIER: "0x115a62FB5C8e2256C626d1e83Da619d7032187a9" as `0x${string}`,
  KNOWN_COMPANY_UNTI: "0x74a1924549587b7d19398771c6c5ea3b7ae3c32a" as `0x${string}`,
  MIZUHIKI_SBT: "0x606F72657e72cd1218444C69eF9D366c62C54978" as `0x${string}`,
  // Privacy Pool contracts (deployed 2025-09-15)
  HASHER: "0xb3fBf25E6C86805F780e543167EAf9CfC417049C" as `0x${string}`,
  VERIFIER: "0x115a62FB5C8e2256C626d1e83Da619d7032187a9" as `0x${string}`,
  MAMIZU_CASH: "0x8D85b87FD65BD0b1A78B30A180158f4FEB118fBe" as `0x${string}`,
} as const;

// Kaigan chain configuration
export const KAIGAN_CHAIN_ID = 5278000;
export const KAIGAN_RPC_URL =
  "https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q";
export const KAIGAN_EXPLORER_URL = "https://explorer.kaigan.jsc.dev";
