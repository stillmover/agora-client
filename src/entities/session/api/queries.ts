import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { sessionKeys } from "./query-keys";
import { sessionApi } from "./sessionApi";
import { extractUserFromResponse, type AuthUserData } from "./types";
import { TIME_CONSTANTS } from "@/shared/constants";

const MAX_RETRY_ATTEMPTS = 3;

const shouldRetrySessionQuery = (
  failureCount: number,
  error: unknown,
): boolean => {
  if (error instanceof Error && "status" in error && error.status === 401) {
    return false;
  }
  return failureCount < MAX_RETRY_ATTEMPTS;
};

export const sessionQueries = {
  currentUser: () =>
    queryOptions({
      queryKey: sessionKeys.me(),
      queryFn: sessionApi.getCurrentUser,
      retry: shouldRetrySessionQuery,
      staleTime: TIME_CONSTANTS.MINUTE,
      gcTime: 10 * TIME_CONSTANTS.MINUTE,
      refetchOnMount: false,
      refetchOnWindowFocus: true,
      select: (response): AuthUserData | null =>
        extractUserFromResponse(response),
    }),
} as const;

export const useCurrentUser = () => {
  return useSuspenseQuery(sessionQueries.currentUser());
};

export const useCurrentUserQuery = () => {
  return useQuery(sessionQueries.currentUser());
};
