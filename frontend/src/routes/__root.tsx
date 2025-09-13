import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import Header from "../components/Header";

// Conditionally import devtools only in development
const DevtoolsComponent = () => {
  if (import.meta.env.PROD) {
    return null;
  }

  // For now, disable devtools to allow build to pass
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0 }}>
      <TanStackRouterDevtoolsPanel />
    </div>
  );
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
