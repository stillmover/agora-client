import { Link } from "@tanstack/react-router";
import { ROUTES } from "@/shared/config";

export const HeaderNavigationWidget = () => (
  <div className="flex gap-2">
    <Link to={ROUTES.HOME} className="[&.active]:font-bold">
      Home
    </Link>
    <Link to={ROUTES.SUBMIT} className="[&.active]:font-bold">
      Submit
    </Link>
  </div>
);
