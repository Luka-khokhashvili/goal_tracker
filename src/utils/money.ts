import { CURRENCIES, type Currency } from '@/constants/currency';
import type { Money } from '@/types/money';
import type { ExchangeRates } from '@/features/exchange/schema';

/**
 * Money helpers. Everything here keeps the "integer minor units" invariant:
 * functions take/return whole cents/tetri and only touch decimals at the
 * human-facing edges (parse from input, format for display).
 */

/** Major units (e.g. 600.5 dollars) -> minor units (60050 cents). */
export function toMinor(major: number, currency: Currency): Money {
  return Math.round(major * CURRENCIES[currency].minorPerMajor);
}

/** Minor units (60050) -> major units (600.5). */
export function toMajor(minor: Money, currency: Currency): number {
  return minor / CURRENCIES[currency].minorPerMajor;
}

/**
 * Parse a user-typed string ("1,250.50") into minor units. Returns null when
 * the input isn't a valid non-negative number, so forms can show an error.
 */
export function parseMoney(input: string, currency: Currency): Money | null {
  const cleaned = input.replace(/[,\s]/g, '').replace(new RegExp(`\\${CURRENCIES[currency].symbol}`, 'g'), '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return toMinor(value, currency);
}

/** Format minor units as a localized currency string, e.g. "$600" / "₾900.50". */
export function formatMoney(minor: Money, currency: Currency): string {
  const { symbol, minorPerMajor } = CURRENCIES[currency];
  const hasFraction = minor % minorPerMajor !== 0;
  const major = toMajor(minor, currency);
  const formatted = major.toLocaleString('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

/**
 * Convert an amount between USD and GEL using the saved rates. Both currencies
 * use 100 minor units per major, so the /100 and *100 cancel and we can apply
 * the rate directly to the minor amount, then round back to a whole minor unit.
 */
export function convert(
  minor: Money,
  from: Currency,
  to: Currency,
  rates: ExchangeRates,
): Money {
  if (from === to) return minor;
  if (from === 'USD' && to === 'GEL') return Math.round(minor * rates.usdToGel);
  if (from === 'GEL' && to === 'USD') return Math.round(minor * rates.gelToUsd);
  // Unreachable while only USD/GEL exist; kept exhaustive for safety.
  throw new Error(`Unsupported conversion ${from} -> ${to}`);
}

/** Convert then format in one step — the common "show this amount to the user" path. */
export function formatConverted(
  minor: Money,
  from: Currency,
  to: Currency,
  rates: ExchangeRates,
): string {
  return formatMoney(convert(minor, from, to, rates), to);
}
