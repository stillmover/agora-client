import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/widgets/app-shell";

const MainLayout = () => (
  <AppShell showHeroCarousel>
    <Outlet />
  </AppShell>
);

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});
