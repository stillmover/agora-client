import type { AuthView } from "@/shared/stores";

interface AuthViewProps {
  onSuccess: VoidFunction;
  onViewChange: (view: AuthView) => void;
}

export type { AuthView, AuthViewProps };
