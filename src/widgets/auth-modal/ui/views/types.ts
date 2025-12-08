export type AuthView = "login" | "register" | "reset";

export type AuthViewProps = {
  onSuccess: () => void;
  onViewChange: (view: AuthView) => void;
};
