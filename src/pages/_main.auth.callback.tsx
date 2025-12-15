import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { logger } from "@/shared/services/logger";
import { getGetApiAuthGoogleCallbackUrl } from "@/shared/api/endpoints/authentication/authentication";
import { env } from "@/shared/utils/env";
import { sessionActions } from "@/entities/session";
import { sessionApi } from "@/entities/session/api/sessionApi";
import { sessionKeys } from "@/entities/session/api/query-keys";
import { extractUserFromResponse } from "@/entities/session/api/types";
import { Spinner } from "@/shared/ui";

export const Route = createFileRoute("/_main/auth/callback")({
  component: OAuthCallbackPage,
  validateSearch: (search) => ({
    code: (search.code as string) || undefined,
    error: (search.error as string) || undefined,
    state: (search.state as string) || undefined,
  }),
});

function OAuthCallbackPage() {
  const search = useSearch({ from: "/_main/auth/callback" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (search.error) {
      logger.error("OAuth error received", { error: search.error });
      navigate({ replace: true, to: "/" });
      return;
    }

    if (search.code && search.state) {
      logger.debug("OAuth callback received", {
        code: search.code,
        state: search.state,
      });

      const storedState = localStorage.getItem("oauth_state");
      if (storedState !== search.state) {
        logger.error("OAuth state mismatch");
        navigate({ replace: true, to: "/" });
        return;
      }

      localStorage.removeItem("oauth_state");

      const callbackUrl = new URL(getGetApiAuthGoogleCallbackUrl(), env.BACKEND_URL);
      callbackUrl.searchParams.set("code", search.code);
      callbackUrl.searchParams.set("state", search.state);

      fetch(callbackUrl.toString(), {
        credentials: "include",
        method: "GET",
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
                email: userData.email ?? undefined,
                id: String(userData.id),
                username: userData.username,
              });

              queryClient.setQueryData(sessionKeys.me(), userResponse);

              logger.info("OAuth authentication successful", {
                userId: userData.id,
              });
              navigate({ replace: true, to: "/" });
            } else {
              throw new Error("OAuth successful but failed to fetch user data");
            }
          } catch (error) {
            logger.error("Failed to fetch user data after OAuth authentication", error);
            navigate({ replace: true, to: "/" });
          }
        })
        .catch((error) => {
          logger.error("OAuth authentication failed", error);
          navigate({ replace: true, to: "/" });
        });
    } else {
      // No OAuth params, redirect to home
      navigate({ replace: true, to: "/" });
    }
  }, [search.code, search.state, search.error, navigate, queryClient]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
