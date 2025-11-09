import { useEffect } from "react";
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
    sessionStore.setState(initialState);
  },
} as const;

export const useSessionPersistence = (): SessionState => {
  const state = useStore(sessionStore);
  const [storedUser, setStoredUser] = useLocalStorage<SessionUser | null>(
    "session_user",
    null,
  );

  useEffect(() => {
    if (storedUser && !state.isAuthenticated) {
      sessionStore.setState({
        isAuthenticated: true,
        user: storedUser,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      setStoredUser(state.user);
    } else if (!state.isAuthenticated) {
      setStoredUser(null);
    }
  }, [state.isAuthenticated, state.user, setStoredUser]);

  return state;
};

export const useIsAuthenticated = () => useStore(sessionStore).isAuthenticated;
export const useSessionUser = () => useStore(sessionStore).user;
