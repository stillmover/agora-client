import { Button } from "@/shared/ui/button";
import { authModalActions } from "@/shared/stores";

export const AuthActionsWidget = () => (
  <div className="flex items-center gap-2">
    <Button variant="ghost" onClick={() => authModalActions.open("login")}>
      Log In
    </Button>
    <Button onClick={() => authModalActions.open("register")}>Sign Up</Button>
  </div>
);
