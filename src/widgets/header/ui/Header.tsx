import { Link } from "@tanstack/react-router";
import { useIsAuthenticated } from "@/entities/session";
import { HeaderNavigationWidget } from "@/widgets/header-navigation";
import { HeaderSearchWidget } from "@/widgets/header-search";
import { UserMenuWidget } from "@/widgets/user-menu";
import { ThemeToggle } from "@/features/theme-toggle";
import { AuthModal } from "@/widgets/auth-modal";

export const Header = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto flex items-center gap-3 px-4 py-3">
        <Link
          to="/"
          className="text-lg font-bold hover:opacity-80 transition-opacity"
        >
          Reddit Client
        </Link>

        <HeaderNavigationWidget />
        <HeaderSearchWidget />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? <UserMenuWidget /> : <AuthModal />}
        </div>
      </div>
    </header>
  );
};
