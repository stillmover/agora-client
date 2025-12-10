import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sessionQueries } from "../api/queries";
import { sessionActions, useSessionState } from "./session-store";
import { logger } from "@/shared/services";
import type { SessionUser } from "./types";

const isValidUserData = (data: unknown): data is { id: number; username: string; email?: string } =>
  typeof data === "object" &&
  data !== null &&
  "id" in data &&
  "username" in data &&
  typeof (data as { id: unknown }).id === "number" &&
  typeof (data as { username: unknown }).username === "string";

const mapToSessionUser = (userData: {
  id: number;
  username: string;
  email?: string;
}): SessionUser => ({
  email: userData.email ?? undefined,
  id: String(userData.id),
  username: userData.username,
});

const getErrorStatus = (error: Error): number | null => {
  if ("status" in error && typeof (error as { status?: number }).status === "number") {
    return (error as { status?: number }).status ?? null;
  }
  return null;
};

const useAuthCallback = (): boolean => {
  const hasHandledCallback = useRef(false);

  const authSuccess = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
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

export const useSession = () => {
  const sessionState = useSessionState();
  const authSuccess = useAuthCallback();

  const [sessionChecked, setSessionChecked] = useState(false);
  const errorHandledRef = useRef(false);

  const shouldFetchUser =
    (sessionState.isAuthenticated || Boolean(sessionState.user) || authSuccess) && !sessionChecked;

  const sessionQuery = useQuery({
    ...sessionQueries.currentUser(),
    enabled: shouldFetchUser,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if ((sessionQuery.isSuccess || sessionQuery.isError) && !sessionChecked) {
      setSessionChecked(true);
    }
  }, [sessionQuery.isSuccess, sessionQuery.isError, sessionChecked]);

  useEffect(() => {
    if (!sessionQuery.isSuccess || !sessionQuery.data) {
      return;
    }

    if (isValidUserData(sessionQuery.data)) {
      sessionActions.login(mapToSessionUser(sessionQuery.data));
      logger.info("Session user data updated from server");
    }
  }, [sessionQuery.isSuccess, sessionQuery.data]);

  useEffect(() => {
    if (!sessionQuery.isError || !sessionQuery.error || errorHandledRef.current) {
      return;
    }

    const error = sessionQuery.error instanceof Error ? sessionQuery.error : null;
    if (!error) {
      return;
    }

    const status = getErrorStatus(error);
    errorHandledRef.current = true;

    if (status === 401) {
      if (sessionState.user || sessionState.isAuthenticated) {
        sessionActions.logout();
        logger.info("User unauthenticated (401), logging out");
      }
      return;
    }

    if (status !== null && status >= 400 && status < 500) {
      sessionActions.logout();
      logger.error(`Client error ${status}, logging out`, error);
      return;
    }

    logger.error("Session query error", error);
  }, [sessionQuery.isError, sessionQuery.error, sessionState.user, sessionState.isAuthenticated]);

  const refetch = useCallback(() => {
    errorHandledRef.current = false;
    setSessionChecked(false);
  }, []);

  return useMemo(
    () => ({
      ...sessionState,
      isInitializing: !sessionChecked && sessionQuery.isLoading,
      error: sessionQuery.isError
        ? sessionQuery.error instanceof Error
          ? sessionQuery.error.message
          : String(sessionQuery.error)
        : sessionState.error,
      refetch,
    }),
    [
      sessionState,
      sessionChecked,
      sessionQuery.isLoading,
      sessionQuery.isError,
      sessionQuery.error,
      refetch,
    ]
  );
};
