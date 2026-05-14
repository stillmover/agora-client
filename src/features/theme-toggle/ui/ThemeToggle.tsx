import { Moon, Sun } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useTheme } from '../model/theme-provider';

export const ThemeToggle = () => {
  const { isDark, toggleSimple } = useTheme();

  const icon = isDark ? (
    <Sun className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  );
  const ariaLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  const title = `Current theme: ${isDark ? 'light' : 'dark'}`;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSimple}
      className="h-9 w-9 focus-visible:ring-2 focus-visible:ring-purple-500"
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
    </Button>
  );
};
