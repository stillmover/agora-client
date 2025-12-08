import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { sessionQueries } from "../api/queries";
import { sessionActions, useSessionState } from "./session-store";
import { logger } from "@/shared/services";
import type { SessionUser } from "./types";

const isValidUserData = (
  data: unknown,
): data is { id: number; username: string; email?: string } => {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "username" in data &&
    typeof (data as { id: unknown }).id === "number" &&
    typeof (data as { username: unknown }).username === "string"
  );
};

const mapToSessionUser = (userData: {
  id: number;
  username: string;
  email?: string;
}): SessionUser => ({
  id: String(userData.id),
  username: userData.username,
  email: userData.email ?? undefined,
});

const getErrorStatus = (error: Error): number | null => {
  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }
  return null;
};

const useAuthCallback = (): boolean => {
  const hasHandledCallback = useRef(false);

  const authSuccess = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("auth") === "success";
  }, []);

  useEffect(() => {
    if (authSuccess && !hasHandledCallback.current) {
      hasHandledCallback.current = true;
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [authSuccess]);

  return authSuccess;
};

const useSessionErrorHandler = (
  error: Error | null,
  isError: boolean,
  isAuthenticated: boolean,
  hasUser: boolean,
) => {
  useEffect(() => {
    if (!isError || !isAuthenticated || !error) return;

    const status = getErrorStatus(error);

    if (status === 401) {
      if (hasUser) {
        sessionActions.logout();
        logger.info("User unauthenticated (401), logging out");
      } else {
        logger.warn(
          "User data fetch failed with 401 but no user data in store - likely cookies not set yet",
        );
      }
      return;
    }

    if (status !== null && status >= 400 && status < 500) {
      sessionActions.logout();
      logger.error(`Client error ${status}, logging out`, error);
      return;
    }

    if (status !== null && status >= 500) {
      logger.error(`Server error ${status}, keeping session intact`, error);
      return;
    }

    logger.error(
      "Session query error (network/unknown), keeping session",
      error,
    );
  }, [isError, error, isAuthenticated, hasUser]);
};

const useSessionSync = (
  data: unknown,
  isSuccess: boolean,
  hasUser: boolean,
) => {
  useEffect(() => {
    if (!isSuccess || !data || hasUser) return;

    if (isValidUserData(data)) {
      sessionActions.login(mapToSessionUser(data));
      logger.info("Session user data updated from server");
    }
  }, [isSuccess, data, hasUser]);
};

export const useSession = () => {
  const sessionState = useSessionState();
  const authSuccess = useAuthCallback();

  const shouldFetchUser =
    (sessionState.isAuthenticated && !sessionState.user) || authSuccess;

  const sessionQuery = useQuery({
    ...sessionQueries.currentUser(),
    enabled: shouldFetchUser,
  });

  useSessionErrorHandler(
    sessionQuery.error,
    sessionQuery.isError,
    sessionState.isAuthenticated,
    Boolean(sessionState.user),
  );

  useSessionSync(
    sessionQuery.data,
    sessionQuery.isSuccess,
    Boolean(sessionState.user),
  );

  const refetch = useCallback(() => {
    void sessionQuery.refetch();
  }, [sessionQuery]);

  return useMemo(
    () => ({
      ...sessionState,
      isInitializing: shouldFetchUser && sessionQuery.isLoading,
      error: sessionQuery.isError
        ? sessionQuery.error instanceof Error
          ? sessionQuery.error.message
          : String(sessionQuery.error)
        : sessionState.error,
      refetch,
    }),
    [
      sessionState,
      shouldFetchUser,
      sessionQuery.isLoading,
      sessionQuery.isError,
      sessionQuery.error,
      refetch,
    ],
  );
};
