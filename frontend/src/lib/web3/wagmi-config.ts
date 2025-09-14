import { QueryClient } from "@tanstack/react-query";
import { defineChain } from "viem";
import { createConfig, http, injected } from "wagmi";

// JSC Kaigan Testnet configuration
export const kaigan = defineChain({
  id: Number(import.meta.env.VITE_CHAIN_ID) || 5278000,
  name: import.meta.env.VITE_CHAIN_NAME || "JSC Kaigan Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [
        import.meta.env.VITE_RPC_URL ||
          "https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Kaigan Explorer",
      url: import.meta.env.VITE_BLOCK_EXPLORER || "https://explorer.kaigan.jsc.dev",
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [kaigan],
  connectors: [injected({ target: "metaMask" }), injected({ target: "injected" })],
  transports: {
    [kaigan.id]: http(
      import.meta.env.VITE_RPC_URL ||
        "https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q",
    ),
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds
      retry: 3,
    },
    mutations: {
      retry: 3,
    },
  },
});
