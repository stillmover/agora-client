import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { sessionKeys } from "./query-keys";
import { sessionApi } from "./sessionApi";
import { extractUserFromResponse } from "./types";
import type { AuthUserData } from "./types";

export const sessionQueries = {
  currentUser: () =>
    queryOptions({
      gcTime: Infinity,
      queryFn: sessionApi.getCurrentUser,
      queryKey: sessionKeys.me(),
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
      select: (response): AuthUserData | null => extractUserFromResponse(response),
      staleTime: Infinity,
    }),
} as const;

export const useCurrentUser = () => useSuspenseQuery(sessionQueries.currentUser());

export const useCurrentUserQuery = () => useQuery(sessionQueries.currentUser());
