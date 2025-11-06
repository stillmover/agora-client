import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Pathless route that protects all authenticated routes under /_main
 * This follows TanStack Router's recommended pattern for authenticated routes
 * @see https://tanstack.com/router/v1/docs/framework/react/guide/authenticated-routes
 */
export const Route = createFileRoute("/_main/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (context.session.isInitializing) {
      return;
    }
    if (!context.session.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          code: undefined,
          state: undefined,
          error: undefined,
          redirect: location.href,
        },
      });
    }
  },
});
