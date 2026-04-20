import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
import { RightSidebar } from "@/widgets/right-sidebar";
import { HeroCarousel } from "@/features/hero-carousel";
import { cn } from "@/shared/lib/utils";

interface AppShellProps {
  children: ReactNode;
  showHeroCarousel?: boolean;
  showRightSidebar?: boolean;
  fullWidth?: boolean;
}

export const AppShell = ({
  children,
  showHeroCarousel = false,
  showRightSidebar = true,
  fullWidth = false,
}: AppShellProps) => (
  <div className="min-h-screen bg-background">
    <div className={cn("w-full", fullWidth ? "max-w-full" : "max-w-[1600px]", "mx-auto")}>
      <Header />
    </div>

    {showHeroCarousel && (
      <div className={cn("w-full", fullWidth ? "max-w-full" : "max-w-[1600px]", "mx-auto")}>
        <HeroCarousel />
      </div>
    )}

    <div className={cn("mx-auto w-full", fullWidth ? "max-w-full" : "max-w-[1600px]")}>
      <div
        className={cn(
          "grid gap-6 px-4 py-6",
          fullWidth
            ? "grid-cols-1"
            : "grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_320px]"
        )}
      >
        {!fullWidth && (
          <aside className="hidden lg:block">
            <div className="sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto no-scrollbar">
              <Sidebar />
            </div>
          </aside>
        )}

        <main className={cn("min-w-0", !fullWidth && "lg:max-w-2xl xl:max-w-3xl mx-auto w-full")}>
          {children}
        </main>

        {showRightSidebar && !fullWidth && (
          <aside className="hidden xl:block">
            <div className="sticky top-[72px] max-h-[calc(100vh-88px)] overflow-y-auto no-scrollbar">
              <RightSidebar />
            </div>
          </aside>
        )}
      </div>
    </div>
  </div>
);
