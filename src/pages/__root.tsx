import {
  createRootRouteWithContext,
  Outlet,
  Link,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config";

interface RouterContext {
  queryClient: QueryClient;
}

if (import.meta.env.DEV) {
  import("react-scan").then(({ scan }) => {
    scan();
  });
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  ),
  notFoundComponent: () => (
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
  ),
});
