import { useStore } from '@/app/store/StoreContext';
import { BASE_CURRENCY, type Currency } from '@/constants/currency';
import { convert, formatMoney } from '@/utils/money';

/**
 * Money formatting bound to the current display currency and saved rates.
 * Components format amounts through here so the USD/GEL toggle is automatic.
 */
export function useMoney() {
  const { state } = useStore();
  const { displayCurrency } = state.settings;
  const rates = state.exchangeRates;

  return {
    displayCurrency,
    rates,
    /** Format a BASE-currency (USD) amount in the display currency. */
    format: (baseMinor: number): string =>
      formatMoney(convert(baseMinor, BASE_CURRENCY, displayCurrency, rates), displayCurrency),
    /** Format an amount given in `from` currency, shown in the display currency. */
    formatFrom: (minor: number, from: Currency): string =>
      formatMoney(convert(minor, from, displayCurrency, rates), displayCurrency),
    /** Format an amount in its own currency, no conversion. */
    formatRaw: (minor: number, currency: Currency): string =>
      formatMoney(minor, currency),
    /** Convert a BASE (USD) amount to the display currency as a number. */
    toDisplay: (baseMinor: number): number =>
      convert(baseMinor, BASE_CURRENCY, displayCurrency, rates),
  };
}
