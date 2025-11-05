import { Store, useStore } from "@tanstack/react-store";

export type AuthUser = {
  id: string;
  username: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authStore = new Store<AuthState>(initialState);

export const authActions = {
  login: (user: AuthUser) =>
    authStore.setState({ isAuthenticated: true, user }),
  logout: () => authStore.setState({ isAuthenticated: false, user: null }),
};

export const useAuth = () => useStore(authStore);
export const useIsAuthenticated = () =>
  useStore(authStore, (s) => s.isAuthenticated);
export const useAuthUser = () => useStore(authStore, (s) => s.user);
