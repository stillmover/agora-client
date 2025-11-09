import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config";

export const AuthActionsWidget = () => (
  <div className="flex items-center gap-2">
    <Button variant="ghost" asChild>
      <Link to={ROUTES.LOGIN}>Log In</Link>
    </Button>
    <Button asChild>
      <Link to={ROUTES.REGISTER}>Sign Up</Link>
    </Button>
  </div>
);
