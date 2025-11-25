import { Link } from "@tanstack/react-router";
import { useIsAuthenticated } from "@/entities/session";
import { HeaderSearchWidget } from "@/widgets/header-search";
import { UserMenuWidget } from "@/widgets/user-menu";
import { ThemeToggle } from "@/features/theme-toggle";
import { AuthModal } from "@/widgets/auth-modal";

export const Header = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="w-full flex items-center gap-3 px-4 py-3">
        <Link
          to="/"
          className="text-lg font-bold hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo-white.png"
            alt="Agora Client"
            width={120}
            height={120}
            className="block dark:hidden rounded-lg w-24 sm:w-28"
          />
          <img
            src="/logo-black.png"
            alt="Agora Client"
            width={120}
            height={120}
            className="hidden dark:block rounded-lg w-24 sm:w-28"
          />
        </Link>

        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-full max-w-lg">
          <HeaderSearchWidget />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated ? <UserMenuWidget /> : <AuthModal />}
        </div>
      </div>
      <div className="block md:hidden px-4 pb-3">
        <HeaderSearchWidget />
      </div>
    </header>
  );
};
