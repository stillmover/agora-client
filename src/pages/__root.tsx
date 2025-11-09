import {
  createRootRouteWithContext,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { type SessionState } from "@/entities/session";
import type { QueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ErrorBoundary } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

interface RouterContext {
  queryClient: QueryClient;
  session: SessionState & {
    isInitializing: boolean;
    error: unknown;
    refetch: () => void;
  };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <Link to={ROUTES.HOME}>
            <Button>Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
