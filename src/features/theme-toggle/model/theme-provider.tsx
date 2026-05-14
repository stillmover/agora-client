import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { themeStorage, type Theme } from "../lib/theme-utils";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleSimple: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => themeStorage.get());
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemTheme(mq.matches ? 'dark' : 'light');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const isDark = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    themeStorage.set(theme);
  }, [isDark, theme]);

  const toggleSimple = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleSimple }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};