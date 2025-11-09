import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui/button";

type Theme = "light" | "dark" | "system";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved && ["light", "dark", "system"].includes(saved)) {
        return saved;
      }
      return "system";
    }
    return "system";
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentTheme: Theme) => {
      const shouldBeDark =
        currentTheme === "dark" ||
        (currentTheme === "system" && mediaQuery.matches);

      if (shouldBeDark) {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.remove("dark");
        setIsDark(false);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    // Listen for system theme changes when theme is "system"
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    if (theme === "system") {
      mediaQuery.addEventListener("change", handleChange);
    }

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const cycleTheme = () => {
    setTheme((current) => {
      switch (current) {
        case "light":
          return "dark";
        case "dark":
          return "system";
        case "system":
        default:
          return "light";
      }
    });
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
      default:
        return isDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        );
    }
  };

  const getAriaLabel = () => {
    switch (theme) {
      case "light":
        return "Switch to dark theme";
      case "dark":
        return "Switch to system theme";
      case "system":
      default:
        return "Switch to light theme";
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-9 w-9 focus-visible:ring-2 focus-visible:ring-purple-500"
      aria-label={getAriaLabel()}
      title={`Current theme: ${theme}${theme === "system" ? ` (${isDark ? "dark" : "light"})` : ""}`}
    >
      {getIcon()}
    </Button>
  );
};
