import {
  createFileRoute,
  redirect,
  Outlet,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_main/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.session.isAuthenticated) {
      throw redirect({
        search: {
          code: undefined,
          error: undefined,
          redirect: location.href,
          state: undefined,
        },
        to: "/login",
      });
    }
  },
  component: AuthGuard,
});

function AuthGuard() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!session.isAuthenticated) {
      navigate({
        to: "/login",
        search: {
          code: undefined,
          error: undefined,
          redirect: location.href,
          state: undefined,
        },
      });
    }
  }, [session.isAuthenticated, navigate, location.href]);

  return <Outlet />;
}
