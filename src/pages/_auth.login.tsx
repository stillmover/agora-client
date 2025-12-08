import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      const targetUrl = redirect ?? "/";
      navigate({ to: targetUrl });
    }
  }, [isAuthenticated, redirect, navigate]);

  return <LoginForm redirect={redirect} />;
}
