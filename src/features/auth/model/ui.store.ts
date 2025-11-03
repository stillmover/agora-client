import { Store } from "@tanstack/store";

export type AuthUIState = {
  isModalOpen: boolean;
};

export const uiStore = new Store<AuthUIState>({
  isModalOpen: false,
});

export const uiActions = {
  openModal: () => uiStore.setState({ isModalOpen: true }),
  closeModal: () => uiStore.setState({ isModalOpen: false }),
};
