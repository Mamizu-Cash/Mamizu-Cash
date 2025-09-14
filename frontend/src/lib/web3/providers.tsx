import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { queryClient, wagmiConfig } from "./wagmi-config";

interface Web3ProvidersProps {
  children: React.ReactNode;
}

export function Web3Providers({ children }: Web3ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
