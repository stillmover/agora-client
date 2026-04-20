export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";

export const getStoredTheme = (): Theme => {
  if (typeof globalThis.window === "undefined") {
    return "system";
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  if (saved && ["light", "dark", "system"].includes(saved)) {
    return saved;
  }

  return "system";
};

export const saveTheme = (theme: Theme): void => {
  if (typeof globalThis.window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

export const getNextTheme = (current: Theme, isDark: boolean): Theme => {
  if (current === "light") {
    return "dark";
  }
  if (current === "dark") {
    return "light";
  }

  return isDark ? "light" : "dark";
};

export const shouldApplyDarkTheme = (theme: Theme, systemPrefersDark: boolean): boolean =>
  theme === "dark" || (theme === "system" && systemPrefersDark);
