import { useEffect, type ReactNode } from 'react';
import { Bike } from 'lucide-react';
import { useSettings } from '@/features/settings/useSettings';
import { CurrencyToggle, ThemeToggle } from '@/features/settings/SettingsControls';

/** App frame: applies the theme class to <html> and renders the header. */
export function AppLayout({ children }: { children: ReactNode }) {
  const { theme } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-strong text-white">
              <Bike size={18} />
            </span>
            <div>
              <h1 className="text-sm font-semibold leading-tight text-content">
                Moto Savings Tracker
              </h1>
              <p className="text-xs text-muted">Your ride, one contribution at a time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CurrencyToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
