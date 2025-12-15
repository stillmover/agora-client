import { useNavigate } from "@tanstack/react-router";
import { User, LogOut, Settings, Bookmark, FileText, MessageSquare } from "lucide-react";

import { useSessionUser, useIsAuthenticated, useLogoutMutation } from "@/entities/session";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { logger } from "@/shared/services/logger";
import { getInitials } from "@/shared/services";

export const UserMenuWidget = () => {
  const user = useSessionUser();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate({ to: ROUTES.HOME });
    } catch (error) {
      logger.error("Error during logout:", error);
      navigate({ to: ROUTES.HOME });
    }
  };

  if (isAuthenticated && !user) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  if (!user) {
    return;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            navigate({
              params: { username: user.username },
              to: "/u/$username",
            })
          }
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: ROUTES.SETTINGS })}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            navigate({
              params: { username: user.username },
              to: "/u/$username",
            })
          }
        >
          <FileText className="mr-2 h-4 w-4" />
          My Posts
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: ROUTES.MESSAGES })}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Messages
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: ROUTES.SAVED })}>
          <Bookmark className="mr-2 h-4 w-4" />
          Saved
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
