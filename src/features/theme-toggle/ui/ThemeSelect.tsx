import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useTheme } from '../model/theme-provider';

export const ThemeSelect = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p className="font-medium mb-3">Theme</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Sun, label: 'Light', value: 'light' as const },
          { icon: Moon, label: 'Dark', value: 'dark' as const },
          { icon: Monitor, label: 'System', value: 'system' as const },
        ].map(option => (
          <button
            type='button'
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer',
              theme === option.value
                ? 'border-brand bg-brand/5'
                : 'border-border hover:border-muted-foreground/30',
            )}
          >
            <option.icon
              className={cn(
                'h-6 w-6',
                theme === option.value ? 'text-brand' : 'text-muted-foreground',
              )}
            />
            <span
              className={cn(
                'text-sm font-medium',
                theme === option.value
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
