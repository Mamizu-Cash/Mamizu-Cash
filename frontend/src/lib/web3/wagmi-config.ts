import { QueryClient } from "@tanstack/react-query";
import { defineChain } from "viem";
import { createConfig, http } from "wagmi";

// Kaigan chain configuration
export const kaigan = defineChain({
  id: 5278000,
  name: "Kaigan",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8545"], // Update with actual RPC URL if different
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "http://localhost:8545" }, // Update with actual explorer URL
  },
});

export const wagmiConfig = createConfig({
  chains: [kaigan],
  transports: {
    [kaigan.id]: http(),
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
