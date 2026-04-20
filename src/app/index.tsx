import "@/sentry";
import "./styles/index.css";
import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
import { Button } from "@/shared/ui/button";
import { routeTree } from "@/routeTree.gen";
import { ROUTES } from "@/shared/config";
import { queryClient } from "@/shared/utils";
import { AppProviders } from "@/app/providers/AppProviders";
import { useSession } from "@/entities/session";

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  globalThis.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("SW registration failed:", error);
    });
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

interface RootFallbackProps {
  error: unknown;
  resetError: VoidFunction;
  componentStack: string;
}

function AppErrorFallback({ error, resetError }: RootFallbackProps) {
  const { logger } = Sentry;
  const normalizedError = error instanceof Error ? error : new Error("Unknown error");
  const message =
    typeof logger.fmt === "function"
      ? logger.fmt`Root error boundary captured an error`
      : "Root error boundary captured an error";

  logger.error?.(message, {
    message: normalizedError.message,
    name: normalizedError.name,
    stack: normalizedError.stack,
  });

  const handleRetry = () =>
    Sentry.startSpan({ name: "ui.root.retry", op: "ui.action" }, () => {
      resetError();
    });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="max-w-md space-y-2">
        <p className="text-lg font-semibold text-foreground">We hit a snag</p>
        <p className="text-sm text-muted-foreground">
          Something broke while loading the app. You can retry or head back to a safe page.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={handleRetry}
          className="w-full sm:w-auto"
          aria-label="Retry loading the app"
        >
          Try again
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          aria-label="Return home"
          onClick={() =>
            Sentry.startSpan({ name: "ui.root.navigate-home", op: "navigation" }, () => {
              globalThis.location.assign(ROUTES.HOME);
            })
          }
        >
          Go home
        </Button>
      </div>
    </div>
  );
}

function InnerApp() {
  const session = useSession();

  const context = useMemo(
    () => ({ queryClient, session }),
    [session.isAuthenticated, session.user?.id, session.isInitializing, session.error]
  );

  return <RouterProvider router={router} context={context} />;
}

if (!rootElement.innerHTML) {
  createRoot(rootElement).render(
    <StrictMode>
      <Sentry.ErrorBoundary fallback={(props) => <AppErrorFallback {...props} />}>
        <AppProviders>
          <InnerApp />
        </AppProviders>
      </Sentry.ErrorBoundary>
    </StrictMode>
  );
}
