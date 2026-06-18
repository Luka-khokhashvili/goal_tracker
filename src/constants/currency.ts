import { z } from "zod";

/**
 * Supported currencies. USD is the default display currency; GEL is kept so
 * the app can switch back (the user lives in Georgia). `minorPerMajor` is how
 * many minor units make one major unit — 100 cents per dollar, 100 tetri per lari.
 */
export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", label: "US Dollar", minorPerMajor: 100 },
  GEL: { code: "GEL", symbol: "₾", label: "Georgian Lari", minorPerMajor: 100 },
} as const;

export const CurrencySchema = z.enum(["USD", "GEL"]);
export type Currency = z.infer<typeof CurrencySchema>;

export const DEFAULT_CURRENCY: Currency = "USD";

/**
 * The currency every stored `Money` value is denominated in. Fixed at USD so
 * conversions are always one well-defined hop (USD <-> GEL via saved rates).
 * Changing this would require re-converting all stored data, so it's a constant,
 * not a setting.
 */
export const BASE_CURRENCY: Currency = "GEL";

/**
 * Monthly savings targets (the rule's $$ and any per-month override) are
 * denominated in GEL — they reflect the user's real-life salary/reserve pay,
 * which is in lari. They are entered and edited ONLY in GEL; the USD figure is
 * a derived, read-only view obtained via the saved exchange rate.
 */
export const TARGET_CURRENCY: Currency = "GEL";

export function currencyMeta(code: Currency) {
  return CURRENCIES[code];
}
