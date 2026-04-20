import { useEffect, useState, useCallback, useMemo } from "react";
import { getStoredTheme, saveTheme, getNextTheme, shouldApplyDarkTheme } from "../lib/theme-utils";
import type { Theme } from "../lib/theme-utils";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const [isDark, setIsDark] = useState(false);

  const systemPrefersDark = useMemo(() => {
    if (typeof globalThis.window === "undefined") {
      return false;
    }
    return globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (currentTheme: Theme) => {
      const shouldBeDark = shouldApplyDarkTheme(currentTheme, systemPrefersDark);

      if (shouldBeDark) {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.remove("dark");
        setIsDark(false);
      }
    };

    applyTheme(theme);
    saveTheme(theme);

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
  }, [theme, systemPrefersDark]);

  const cycleTheme = useCallback(() => {
    setTheme(getNextTheme(theme, isDark));
  }, [theme, isDark]);

  return {
    cycleTheme,
    isDark,
    theme,
  };
};
