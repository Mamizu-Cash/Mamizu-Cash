import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";

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
    <>
      <Header />
      <Outlet />
      <DevtoolsComponent />
    </>
  ),
});
