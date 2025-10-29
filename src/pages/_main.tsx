import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";

export const Route = createFileRoute("/_main")({
  component: MainLayout,
});

function MainLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <Sidebar />
        </div>
        <main className="md:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
