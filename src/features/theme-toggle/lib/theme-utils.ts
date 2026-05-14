export type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "theme";

export const themeStorage = {
  get: (): Theme => (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "system",
  set: (theme: Theme): void => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  },
  remove: (): void => {
    localStorage.removeItem(THEME_STORAGE_KEY);
  },
};