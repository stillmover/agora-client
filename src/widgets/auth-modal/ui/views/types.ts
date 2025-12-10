type AuthView = "login" | "register" | "reset";

interface AuthViewProps {
  onSuccess: VoidFunction;
  onViewChange: (view: AuthView) => void;
}

export type { AuthView, AuthViewProps };
