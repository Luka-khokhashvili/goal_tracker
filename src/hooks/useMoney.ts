import { useStore } from '@/app/store/StoreContext';
import type { Currency } from '@/constants/currency';
import { convert, formatMoney } from '@/utils/money';

/**
 * Money formatting bound to the current display currency and saved rates.
 * Each amount carries its own native currency (`from`); this converts it to the
 * display currency so the USD/GEL toggle is automatic. When `from` already
 * equals the display currency, the value is shown exactly (no conversion).
 */
export function useMoney() {
  const { state } = useStore();
  const { displayCurrency } = state.settings;
  const rates = state.exchangeRates;

  return {
    displayCurrency,
    rates,
    /** Format an amount given in its native `from` currency, shown in display currency. */
    formatFrom: (minor: number, from: Currency): string =>
      formatMoney(convert(minor, from, displayCurrency, rates), displayCurrency),
    /** Format an amount in a fixed currency, no conversion (e.g. always-USD figures). */
    formatRaw: (minor: number, currency: Currency): string => formatMoney(minor, currency),
    /** Convert an amount from its native currency to the display currency (number). */
    toDisplay: (minor: number, from: Currency): number =>
      convert(minor, from, displayCurrency, rates),
  };
}
