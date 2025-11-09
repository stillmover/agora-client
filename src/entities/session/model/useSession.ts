import { useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { sessionQueries } from "../api/queries";
import { sessionActions, useSessionPersistence } from "./session-store";
import { logger } from "@/shared/services";

export const useSession = () => {
  const sessionState = useSessionPersistence();

  const isLoading =
    (sessionState as { isLoading?: boolean }).isLoading || false;
  const shouldFetchUser = !isLoading;

  const sessionQuery = useQuery({
    ...sessionQueries.currentUser(),
    enabled: shouldFetchUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const hasHandledAuth = useRef(false);

  useEffect(() => {
    if (shouldFetchUser) {
      hasHandledAuth.current = false;
    }
  }, [shouldFetchUser]);

  useEffect(() => {
    if (hasHandledAuth.current || !shouldFetchUser) {
      return;
    }

    if (sessionQuery.isLoading) {
      return;
    }

    if (sessionQuery.isError) {
      const error = sessionQuery.error;

      if (error instanceof Error && "status" in error) {
        const status = error.status as number;

        if (status === 401) {
          hasHandledAuth.current = true;
          sessionActions.logout();
          logger.info("User unauthenticated (401), logging out");
          return;
        }

        if (status >= 400 && status < 500) {
          hasHandledAuth.current = true;
          sessionActions.logout();
          logger.error(`Client error ${status}, logging out`, error);
          return;
        }

        if (status >= 500) {
          logger.error(`Server error ${status}, keeping session intact`, error);
          return;
        }
      }

      logger.error(
        "Session query error (network/unknown), keeping session",
        error,
      );
      return;
    }

    if (sessionQuery.isSuccess && sessionQuery.data) {
      const userData = sessionQuery.data;
      if (userData) {
        hasHandledAuth.current = true;
        sessionActions.login({
          id: String(userData.id),
          username: userData.username,
          email: userData.email || undefined,
        });
        logger.info("Session restored from server validation");
      } else {
        hasHandledAuth.current = true;
        sessionActions.logout();
        logger.warn("Session query successful but no user data, logging out");
      }
      return;
    }
  }, [
    shouldFetchUser,
    sessionQuery.isLoading,
    sessionQuery.isError,
    sessionQuery.isSuccess,
    sessionQuery.data,
    sessionQuery.error,
  ]);

  return useMemo(
    () => ({
      ...sessionState,
      isInitializing: shouldFetchUser && sessionQuery.isLoading,
      error: sessionQuery.isError
        ? sessionQuery.error instanceof Error
          ? sessionQuery.error.message
          : String(sessionQuery.error)
        : null,
      refetch: () => {
        void sessionQuery.refetch();
      },
    }),
    [
      sessionState.isAuthenticated,
      sessionState.user,
      sessionState.isLoading,
      shouldFetchUser,
      sessionQuery.isLoading,
      sessionQuery.isError,
    ],
  );
};
