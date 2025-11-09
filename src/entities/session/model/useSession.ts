import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { sessionQueries } from "../api/queries";
import { sessionActions, useSessionPersistence } from "./session-store";
import { logger } from "@/shared/services";

export const useSession = () => {
  const sessionState = useSessionPersistence();

  const shouldFetchUser = sessionState.isAuthenticated && !sessionState.user;

  const sessionQuery = useQuery({
    ...sessionQueries.currentUser(),
    enabled: shouldFetchUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && "status" in error && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (sessionQuery.isError && sessionState.isAuthenticated) {
      const error = sessionQuery.error;

      if (error instanceof Error && "status" in error) {
        const status = error.status as number;

        if (status === 401) {
          if (sessionState.user) {
            sessionActions.logout();
            logger.info("User unauthenticated (401), logging out");
          } else {
            logger.warn(
              "User data fetch failed with 401 but no user data in store - likely cookies not set yet",
            );
          }
          return;
        }

        if (status >= 400 && status < 500) {
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
    }
  }, [
    sessionQuery.isError,
    sessionQuery.error,
    sessionState.isAuthenticated,
    sessionState.user,
  ]);

  useEffect(() => {
    if (
      sessionQuery.isSuccess &&
      sessionQuery.data &&
      sessionState.isAuthenticated &&
      !sessionState.user
    ) {
      const userData = sessionQuery.data as {
        id: number;
        username: string;
        email?: string;
      };
      if (userData) {
        sessionActions.login({
          id: String(userData.id),
          username: userData.username,
          email: userData.email || undefined,
        });
        logger.info("Session user data updated from server");
      } else {
        sessionActions.logout();
        logger.warn("Session query successful but no user data, logging out");
      }
    }
  }, [
    sessionQuery.isSuccess,
    sessionQuery.data,
    sessionState.isAuthenticated,
    sessionState.user,
  ]);

  return useMemo(
    () => ({
      ...sessionState,
      isInitializing: shouldFetchUser && sessionQuery.isLoading,
      error: sessionQuery.isError
        ? sessionQuery.error instanceof Error
          ? sessionQuery.error.message
          : String(sessionQuery.error)
        : sessionState.error,
      refetch: () => {
        void sessionQuery.refetch();
      },
    }),
    [
      sessionState.isAuthenticated,
      sessionState.user,
      sessionState.isLoading,
      sessionState.error,
      shouldFetchUser,
      sessionQuery.isLoading,
      sessionQuery.isError,
      sessionQuery.error,
    ],
  );
};
