import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
import type { SessionState, SessionUser } from "./types";

const STORAGE_KEY = "session_user";

const getStoredUser = (): SessionUser | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as unknown;

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "id" in parsed &&
      "username" in parsed &&
      typeof (parsed as { id: unknown }).id === "string" &&
      typeof (parsed as { username: unknown }).username === "string"
    ) {
      return parsed as SessionUser;
    }

    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persistUser = (user: SessionUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
};

const getInitialState = (): SessionState => {
  const storedUser = getStoredUser();

  if (storedUser) {
    return {
      isAuthenticated: true,
      user: storedUser,
      isLoading: false,
      error: null,
    };
  }

  return {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
  };
};

export const sessionStore = new Store<SessionState>(getInitialState());

sessionStore.subscribe(() => {
  const state = sessionStore.state;
  persistUser(state.isAuthenticated ? state.user : null);
});

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

  setLoading: (isLoading: boolean) => {
    sessionStore.setState((prev) => ({
      ...prev,
      isLoading,
    }));
  },

  setError: (error: string | null) => {
    sessionStore.setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  },
} as const;

export const useSessionState = (): SessionState => useStore(sessionStore);

export const useIsAuthenticated = () => useStore(sessionStore).isAuthenticated;

export const useSessionUser = () => useStore(sessionStore).user;
