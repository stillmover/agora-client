import { useCallback, useEffect, useMemo } from "react";
import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
import { useLocalStorage } from "react-use";
import type { SessionState, SessionUser } from "./types";

const initialState: SessionState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

export const sessionStore = new Store<SessionState>(initialState);

export const useSessionPersistence = (): SessionState => {
  const sessionState = useStore(sessionStore);

  const [, setLocalStorageUser] = useLocalStorage<SessionUser | null>(
    "session_user",
    null,
  );

  const memoizedSetStorageUser = useCallback(
    (user: SessionUser | null) => {
      setLocalStorageUser(user);
    },
    [setLocalStorageUser],
  );

  useEffect(() => {
    if (sessionState.isAuthenticated && sessionState.user) {
      memoizedSetStorageUser(sessionState.user);
    } else if (!sessionState.isAuthenticated && sessionState.user === null) {
      memoizedSetStorageUser(null);
    }
  }, [sessionState.isAuthenticated, sessionState.user, memoizedSetStorageUser]);

  return sessionState;
};

export const useIsAuthenticated = () => {
  const state = useStore(sessionStore);
  return useMemo(() => state.isAuthenticated, [state.isAuthenticated]);
};

export const useSessionUser = () => {
  const state = useStore(sessionStore);
  return useMemo(() => state.user, [state.user]);
};

export const sessionActions = {
  login: (user: SessionUser) => {
    sessionStore.setState({
      isAuthenticated: true,
      user,
      isLoading: false,
      error: null,
    });
  },

  logout: () => {
    sessionStore.setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });
  },
} as const;
