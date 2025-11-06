import { createFileRoute, useRouter } from "@tanstack/react-router";
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

  return <RegisterForm redirect={redirect} />;
}
