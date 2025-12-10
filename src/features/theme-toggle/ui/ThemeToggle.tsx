import { useMemo } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useTheme } from "../model/useTheme";
import type { Theme } from "../lib/theme-utils";

const getThemeIcon = (theme: Theme, isDark: boolean) => {
  switch (theme) {
    case "light": {
      return <Sun className="h-4 w-4" />;
    }
    case "dark": {
      return <Moon className="h-4 w-4" />;
    }
    case "system":
    default: {
      return isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
    }
  }
};

const getThemeAriaLabel = (theme: Theme): string => {
  switch (theme) {
    case "light": {
      return "Switch to dark theme";
    }
    case "dark": {
      return "Switch to system theme";
    }
    case "system":
    default: {
      return "Switch to light theme";
    }
  }
};

export const ThemeToggle = () => {
  const { theme, isDark, cycleTheme } = useTheme();

  const icon = useMemo(() => getThemeIcon(theme, isDark), [theme, isDark]);
  const ariaLabel = useMemo(() => getThemeAriaLabel(theme), [theme]);
  const title = useMemo(
    () => `Current theme: ${theme}${theme === "system" ? ` (${isDark ? "dark" : "light"})` : ""}`,
    [theme, isDark]
  );

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
