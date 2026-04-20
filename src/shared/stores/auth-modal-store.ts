import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";

export type AuthView = "login" | "register" | "reset";

interface AuthModalState {
  isOpen: boolean;
  view: AuthView;
}

const initialState: AuthModalState = {
  isOpen: false,
  view: "login",
};

export const authModalStore = new Store<AuthModalState>(initialState);

export const authModalActions = {
  close: () => {
    authModalStore.setState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  },

  open: (view: AuthView = "login") => {
    authModalStore.setState((prev) => ({
      ...prev,
      isOpen: true,
      view,
    }));
  },

  reset: () => {
    authModalStore.setState(() => initialState);
  },

  setView: (view: AuthView) => {
    authModalStore.setState((prev) => {
      if (prev.view === view) {
        return prev;
      }

      return {
        ...prev,
        view,
      };
    });
  },
} as const;

export const useAuthModalState = () => useStore(authModalStore);

export const useAuthModalOpen = () => useStore(authModalStore, (state) => state.isOpen);

export const useAuthModalView = () => useStore(authModalStore, (state) => state.view);
