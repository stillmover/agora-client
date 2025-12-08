import { Link } from "@tanstack/react-router";
import { Menu, Plus, Bell } from "lucide-react";
import { useIsAuthenticated } from "@/entities/session";
import { HeaderSearchWidget } from "@/widgets/header-search";
import { UserMenuWidget } from "@/widgets/user-menu";
import { ThemeToggle } from "@/features/theme-toggle";
import { AuthModal } from "@/widgets/auth-modal";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

export const Header = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "border-b border-border/50",
        "bg-background/80 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-background/70",
      )}
    >
      <div className="flex items-center h-14 px-4 gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link
          to="/"
          className="flex-shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img
            src="/logo-white.png"
            alt="Agora"
            width={100}
            height={32}
            className="block dark:hidden h-8 w-auto"
          />
          <img
            src="/logo-black.png"
            alt="Agora"
            width={100}
            height={32}
            className="hidden dark:block h-8 w-auto"
          />
        </Link>

        {/* Desktop Search - Centered */}
        <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto">
          <HeaderSearchWidget />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {isAuthenticated && (
            <>
              {/* Create Post Button - Desktop */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex gap-2"
                asChild
              >
                <Link to="/submit">
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">Create</span>
                </Link>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon-sm"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 h-2 w-2 bg-brand rounded-full" />
              </Button>
            </>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu or Auth */}
          {isAuthenticated ? <UserMenuWidget /> : <AuthModal />}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="block md:hidden px-4 pb-3">
        <HeaderSearchWidget />
      </div>
    </header>
  );
};
