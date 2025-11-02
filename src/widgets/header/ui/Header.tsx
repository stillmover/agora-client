import { Link, useNavigate } from "@tanstack/react-router";
import { useIsAuthenticated, useAuthUser, authActions } from "@/features/auth";
import { ROUTES } from "@/shared/config";
import { ThemeToggle } from "@/features/theme-toggle";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { User, LogOut, Settings, Plus } from "lucide-react";
import { getInitials } from "@/shared/utils";
import { AuthModal } from "@/widgets/auth-modal";

export const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    authActions.logout();
    navigate({ to: ROUTES.HOME });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="container mx-auto flex items-center gap-3 px-4 py-3">
        <Link
          to={ROUTES.HOME}
          className="text-lg font-bold hover:opacity-80 transition-opacity"
        >
          Reddit Client
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Input placeholder="Search..." className="w-56 hidden md:block" />
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate({ to: ROUTES.CREATE_POST })}
                className="hidden sm:flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{user?.name}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate({ to: ROUTES.CREATE_POST })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create Post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <AuthModal />
          )}
        </div>
      </div>
    </header>
  );
};
