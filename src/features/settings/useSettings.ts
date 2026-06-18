import { useStore } from '@/app/store/StoreContext';
import type { Currency } from '@/constants/currency';

/** Display preferences: currency toggle + theme toggle. */
export function useSettings() {
  const { state, dispatch } = useStore();
  const { displayCurrency, theme } = state.settings;

  function setDisplayCurrency(currency: Currency): void {
    dispatch({ type: 'SET_DISPLAY_CURRENCY', currency });
  }

  function toggleCurrency(): void {
    setDisplayCurrency(displayCurrency === 'USD' ? 'GEL' : 'USD');
  }

  function toggleTheme(): void {
    dispatch({ type: 'SET_THEME', theme: theme === 'dark' ? 'light' : 'dark' });
  }

  return { displayCurrency, theme, setDisplayCurrency, toggleCurrency, toggleTheme };
}
