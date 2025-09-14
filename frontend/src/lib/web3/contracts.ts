// Contract addresses - these will be set via environment variables
export const CONTRACT_ADDRESSES = {
  COUNTER:
    (import.meta.env.VITE_COUNTER_ADDRESS as `0x${string}`) ||
    "0x0000000000000000000000000000000000000000",
  ALWAYS_ALLOW:
    (import.meta.env.VITE_ALWAYS_ALLOW_ADDRESS as `0x${string}`) ||
    "0xee77e2d45ba22173114733594f0d6f8c33385721",
  BUSINESS_VERIFIER:
    (import.meta.env.VITE_BUSINESS_VERIFIER_ADDRESS as `0x${string}`) ||
    "0xb44aba22cfc4b58b2cdf9be059d3ba94cd051638",
  KNOWN_COMPANY_UNTI:
    (import.meta.env.VITE_KNOWN_COMPANY_UNTI_ADDRESS as `0x${string}`) ||
    "0x74a1924549587b7d19398771c6c5ea3b7ae3c32a",
} as const;

// Chain ID
export const KAIGAN_CHAIN_ID = 5278000;
