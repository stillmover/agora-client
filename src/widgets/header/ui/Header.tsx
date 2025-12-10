import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { Menu, Plus, Bell, X } from "lucide-react";
import { useIsAuthenticated } from "@/entities/session";
import { HeaderSearchWidget } from "@/widgets/header-search";
import { UserMenuWidget } from "@/widgets/user-menu";
import { ThemeToggle } from "@/features/theme-toggle";
import { AuthModal } from "@/widgets/auth-modal";
import { Sidebar } from "@/widgets/sidebar";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

export const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "border-b border-border/50",
        "bg-background/80 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-background/70"
      )}
    >
      <div className="flex items-center h-14 px-4 gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMobileMenuOpen(true)}
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
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2" asChild>
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

      {/* Mobile menu drawer */}
      <DialogPrimitive.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content
            id="mobile-nav"
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-[82vw] max-w-xs bg-background",
              "border-r border-border shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
            )}
          >
            <DialogPrimitive.Title className="sr-only">
              Mobile navigation menu
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Navigate to different sections of the app
            </DialogPrimitive.Description>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <span className="text-sm font-semibold">Menu</span>
              <DialogPrimitive.Close asChild>
                <Button variant="ghost" size="icon-sm" aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="h-[calc(100vh-56px)] overflow-y-auto p-4">
              <Sidebar />
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </header>
  );
};
