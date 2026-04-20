import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useTheme } from "../model/useTheme";

export const ThemeToggle = () => {
  const { isDark, cycleTheme } = useTheme();

  const icon = isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  const ariaLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
  const title = `Current theme: ${isDark ? "dark" : "light"}`;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-9 w-9 focus-visible:ring-2 focus-visible:ring-purple-500"
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
    </Button>
  );
};
