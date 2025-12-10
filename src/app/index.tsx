import "@/sentry";
import "./styles/index.css";
import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";
import { Button } from "@/shared/ui/button";
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

type RootFallbackProps = {
  error: unknown;
  resetError: VoidFunction;
  componentStack: string;
};

function AppErrorFallback({ error, resetError }: RootFallbackProps) {
  const { logger } = Sentry;
  const normalizedError = error instanceof Error ? error : new Error("Unknown error");
  const message =
    typeof logger.fmt === "function"
      ? logger.fmt`Root error boundary captured an error`
      : "Root error boundary captured an error";

  logger.error?.(message, {
    name: normalizedError.name,
    message: normalizedError.message,
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
              window.location.assign("/");
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
