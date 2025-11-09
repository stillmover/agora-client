import "./styles/index.css";
import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { queryClient } from "@/shared/utils";
import { AppProviders } from "@/app/providers/AppProviders";
import { useSession } from "@/entities/session";

if (import.meta.env.DEV) {
  void import("react-scan").then(({ scan }) => {
    scan();
  });
}

if (import.meta.env.DEV) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW();
  });
}

const router = createRouter({
  context: {
    queryClient,
    session: undefined!,
  },
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.querySelector("#root")!;

function InnerApp() {
  const session = useSession();

  const context = useMemo(
    () => ({ queryClient, session }),
    [session.isAuthenticated, session.user, session.isInitializing],
  );

  return <RouterProvider router={router} context={context} />;
}

if (!rootElement.innerHTML) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppProviders>
        <InnerApp />
      </AppProviders>
    </StrictMode>,
  );
}
