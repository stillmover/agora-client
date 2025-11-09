import {
  Outlet,
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { handlePostAuth } from "@/entities/session";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from "@/shared/services/logger";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
  validateSearch: (search) => ({
    code: (search.code as string) || undefined,
    state: (search.state as string) || undefined,
    error: (search.error as string) || undefined,
  }),
});

function AuthLayout() {
  const search = useSearch({ from: "/_auth" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Handle OAuth callback
    if (search.code && search.state) {
      logger.debug("OAuth callback received", {
        code: search.code,
        state: search.state,
      });

      // Verify state matches what we stored
      const storedState = localStorage.getItem("oauth_state");
      if (storedState !== search.state) {
        logger.error("OAuth state mismatch");
        navigate({ to: "/login", search: { error: "auth_failed" } });
        return;
      }

      // Clear stored state
      localStorage.removeItem("oauth_state");

      // TODO: Exchange code for tokens and authenticate user
      // For now, just call handlePostAuth to check if user is authenticated
      handlePostAuth(queryClient)
        .then(() => {
          navigate({ to: "/", replace: true });
        })
        .catch((error) => {
          logger.error("OAuth authentication failed", error);
          navigate({ to: "/login", search: { error: "auth_failed" } });
        });
    }
  }, [search.code, search.state, navigate, queryClient]);

  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-sm rounded-md border border-border bg-card p-6 shadow">
        <Outlet />
      </div>
    </div>
  );
}
