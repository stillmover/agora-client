import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ResetForm } from "@/features/auth/ui/ResetForm";
import { useIsAuthenticated } from "@/entities/session";

export const Route = createFileRoute("/_auth/reset")({
  component: ResetPage,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: (search.redirect as string) || undefined,
  }),
});

function ResetPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      const targetUrl = redirect ?? "/";
      navigate({ to: targetUrl });
    }
  }, [isAuthenticated, navigate, redirect]);

  return <ResetForm />;
}
