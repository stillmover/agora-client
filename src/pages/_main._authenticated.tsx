import { createFileRoute, redirect } from "@tanstack/react-router";

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
