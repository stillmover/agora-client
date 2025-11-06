import {
  queryOptions,
  useSuspenseQuery,
  useQuery,
} from "@tanstack/react-query";
import { sessionKeys } from "./query-keys";
import { sessionApi } from "./sessionApi";
import type { getApiMeResponse } from "@/shared/api/endpoints/authentication/authentication";

export const sessionQueries = {
  currentUser: () =>
    queryOptions({
      queryKey: sessionKeys.me(),
      queryFn: sessionApi.getCurrentUser,
      retry: (failureCount, error) => {
        if (
          error instanceof Error &&
          "status" in error &&
          error.status === 401
        ) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // apiMutator returns the JSON body, not a wrapper with status codes.
      // Expect: { success: boolean, data?: { user: ... } }
      select: (response: getApiMeResponse) => {
        const anyResponse = response as unknown as {
          success?: boolean;
          data?: { user?: unknown };
        };
        if (anyResponse?.success && anyResponse.data?.user) {
          return anyResponse.data.user as unknown;
        }
        // Treat missing user as no active session (not an error)
        return null as unknown;
      },
    }),
} as const;

export const useCurrentUser = () => {
  return useSuspenseQuery(sessionQueries.currentUser());
};

export const useCurrentUserQuery = () => {
  return useQuery(sessionQueries.currentUser());
};
