import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
import { RightSidebar } from "@/widgets/right-sidebar";
import { HeroCarousel } from "@/features/hero-carousel";

type AppShellProps = {
  children: ReactNode;
  showHeroCarousel?: boolean;
  showRightSidebar?: boolean;
};

export const AppShell = ({
  children,
  showHeroCarousel = false,
  showRightSidebar = true,
}: AppShellProps) => (
  <div className="min-h-screen bg-background">
    <Header />
    {showHeroCarousel && <HeroCarousel />}
    <div className="w-full grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-12 xl:grid-cols-16">
      <aside className="hidden lg:block lg:col-span-3 xl:col-span-4">
        <div className="sticky top-20">
          <Sidebar />
        </div>
      </aside>

      <main className="lg:col-span-6 xl:col-span-8">{children}</main>

      {showRightSidebar && (
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-4">
          <div className="sticky top-20">
            <RightSidebar />
          </div>
        </aside>
      )}
    </div>
  </div>
);
