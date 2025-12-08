import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RegisterForm } from "@/features/auth";
import { useEffect } from "react";
import { useIsAuthenticated } from "@/entities/session";

export const Route = createFileRoute("/_auth/register")({
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      const targetUrl = redirect ?? "/";
      navigate({ to: targetUrl });
    }
  }, [isAuthenticated, redirect, navigate]);

  return <RegisterForm redirect={redirect} />;
}
