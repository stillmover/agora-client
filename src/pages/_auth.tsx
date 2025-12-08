import {
  Outlet,
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from "@/shared/services/logger";
import { getGetApiAuthGoogleCallbackUrl } from "@/shared/api/endpoints/authentication/authentication";
import { env } from "@/shared/utils/env";
import { sessionActions } from "@/entities/session";
import { sessionApi } from "@/entities/session/api/sessionApi";
import { sessionKeys } from "@/entities/session/api/query-keys";
import { extractUserFromResponse } from "@/entities/session/api/types";

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
    if (search.code && search.state) {
      logger.debug("OAuth callback received", {
        code: search.code,
        state: search.state,
      });

      const storedState = localStorage.getItem("oauth_state");
      if (storedState !== search.state) {
        logger.error("OAuth state mismatch");
        navigate({
          to: "/login",
          search: {
            error: "auth_failed",
            code: undefined,
            state: undefined,
            redirect: undefined,
          },
        });
        return;
      }

      localStorage.removeItem("oauth_state");

      const callbackUrl = new URL(
        getGetApiAuthGoogleCallbackUrl(),
        env.BACKEND_URL,
      );
      callbackUrl.searchParams.set("code", search.code);
      callbackUrl.searchParams.set("state", search.state);

      fetch(callbackUrl.toString(), {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`OAuth callback failed: ${response.status}`);
          }
          return response;
        })
        .then(async () => {
          try {
            const userResponse = await sessionApi.getCurrentUser();
            const userData = extractUserFromResponse(userResponse);

            if (userData) {
              sessionActions.login({
                id: String(userData.id),
                username: userData.username,
                email: userData.email ?? undefined,
              });

              queryClient.setQueryData(sessionKeys.me(), userResponse);

              logger.info("OAuth authentication successful", {
                userId: userData.id,
              });
              navigate({ to: "/", replace: true });
            } else {
              throw new Error("OAuth successful but failed to fetch user data");
            }
          } catch (error) {
            logger.error(
              "Failed to fetch user data after OAuth authentication",
              error,
            );
            navigate({
              to: "/login",
              search: {
                error: "auth_failed",
                code: undefined,
                state: undefined,
                redirect: undefined,
              },
            });
          }
        })
        .catch((error) => {
          logger.error("OAuth authentication failed", error);
          navigate({
            to: "/login",
            search: {
              error: "auth_failed",
              code: undefined,
              state: undefined,
              redirect: undefined,
            },
          });
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
