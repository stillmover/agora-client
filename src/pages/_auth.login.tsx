import { createFileRoute, useRouter } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth";
import { useEffect } from "react";
import { useIsAuthenticated } from "@/entities/session";

export const Route = createFileRoute("/_auth/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
});

function LoginPage() {
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      if (redirect) {
        router.history.push(redirect);
      } else {
        router.navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, redirect, router]);

  return <LoginForm redirect={redirect} />;
}
