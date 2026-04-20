import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
import type { SessionState, SessionUser } from "./types";

const STORAGE_KEY = "session_user";

const getStoredUser = (): SessionUser | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }

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
  } catch {
    localStorage.removeItem(STORAGE_KEY);
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
      error: undefined,
      isAuthenticated: true,
      isLoading: false,
      user: storedUser,
    };
  }

  return {
    error: undefined,
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
  };
};

export const sessionStore = new Store<SessionState>(getInitialState());

sessionStore.subscribe(() => {
  const { state } = sessionStore;
  persistUser(state.isAuthenticated ? state.user : undefined);
});

export const sessionActions = {
  login: (user: SessionUser) => {
    sessionStore.setState({
      error: undefined,
      isAuthenticated: true,
      isLoading: false,
      user,
    });
  },

  logout: () => {
    sessionStore.setState({
      error: undefined,
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    });
  },

  setError: (error: string | null) => {
    sessionStore.setState((prev) => ({
      ...prev,
      error,
      isLoading: false,
    }));
  },

  setLoading: (isLoading: boolean) => {
    sessionStore.setState((prev) => ({
      ...prev,
      isLoading,
    }));
  },
} as const;

export const useSessionState = (): SessionState => useStore(sessionStore);

export const useIsAuthenticated = () => useStore(sessionStore).isAuthenticated;

export const useSessionUser = () => useStore(sessionStore).user;
