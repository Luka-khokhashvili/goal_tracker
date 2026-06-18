import { Moon, Sun } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useSettings } from './useSettings';
import type { Currency } from '@/constants/currency';

/** Segmented USD / GEL display-currency switch. */
export function CurrencyToggle() {
  const { displayCurrency, setDisplayCurrency } = useSettings();
  const options: Currency[] = ['USD', 'GEL'];
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface p-0.5">
      {options.map((c) => (
        <button
          key={c}
          onClick={() => setDisplayCurrency(c)}
          className={cn(
            'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
            displayCurrency === c
              ? 'bg-brand-strong text-white'
              : 'text-muted hover:text-content',
          )}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

/** Dark/light theme toggle button. */
export function ThemeToggle() {
  const { theme, toggleTheme } = useSettings();
  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl border border-border bg-surface p-2 text-muted hover:text-content"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
