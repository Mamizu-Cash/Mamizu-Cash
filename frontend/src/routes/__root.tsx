import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
import { Toaster } from "../components/ui/sonner";
import { ToastProvider, ToastContainer } from "../components/ui/Toast";
import { Web3Providers } from "../lib/web3/providers";

// Conditionally import devtools only in development
const DevtoolsComponent = () => {
  if (import.meta.env.PROD) {
    return null;
  }

  // Use floating devtools with collapse functionality
  return <TanStackRouterDevtools initialIsOpen={false} />;
};

export const Route = createRootRoute({
  component: () => (
    <Web3Providers>
      <ToastProvider>
        <Header />
        <Outlet />
        <ToastContainer />
        <Toaster />
        <DevtoolsComponent />
      </ToastProvider>
    </Web3Providers>
  ),
});
