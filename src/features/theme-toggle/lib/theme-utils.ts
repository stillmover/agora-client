export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";

export const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "system";
  }

  const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  if (saved && ["light", "dark", "system"].includes(saved)) {
    return saved;
  }

  return "system";
};

export const saveTheme = (theme: Theme): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

export const getNextTheme = (current: Theme): Theme => {
  switch (current) {
    case "light": {
      return "dark";
    }
    case "dark": {
      return "system";
    }
    case "system":
    default: {
      return "light";
    }
  }
};

export const shouldApplyDarkTheme = (theme: Theme, systemPrefersDark: boolean): boolean =>
  theme === "dark" || (theme === "system" && systemPrefersDark);
