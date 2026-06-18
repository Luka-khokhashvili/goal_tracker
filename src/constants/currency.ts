import { z } from 'zod';

/**
 * Supported currencies. USD is the default display currency; GEL is kept so
 * the app can switch back (the user lives in Georgia). `minorPerMajor` is how
 * many minor units make one major unit — 100 cents per dollar, 100 tetri per lari.
 */
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', minorPerMajor: 100 },
  GEL: { code: 'GEL', symbol: '₾', label: 'Georgian Lari', minorPerMajor: 100 },
} as const;

export const CurrencySchema = z.enum(['USD', 'GEL']);
export type Currency = z.infer<typeof CurrencySchema>;

export const DEFAULT_CURRENCY: Currency = 'USD';

export function currencyMeta(code: Currency) {
  return CURRENCIES[code];
}
