import { useNavigate } from "@tanstack/react-router";
import {
  User,
  LogOut,
  Settings,
  Plus,
  Download,
  FileText,
  MessageSquare,
} from "lucide-react";

import {
  useSessionUser,
  useLogoutMutation,
  sessionActions,
} from "@/entities/session";
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
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    try {
      sessionActions.logout();
      await logoutMutation.mutateAsync();
      navigate({ to: ROUTES.HOME });
    } catch (error) {
      logger.error("Error during logout:", error);
      navigate({ to: ROUTES.HOME });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Plus className="h-5 w-5" />
      </Button>

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
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            My Posts
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Saved
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
