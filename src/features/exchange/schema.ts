import { z } from 'zod';

/**
 * User-entered exchange rates between USD and GEL. Both directions are stored
 * (the user edits them in the Exchange tab); editing one can auto-fill the
 * reciprocal, but both are kept so the user has the final say. Rates persist
 * until changed.
 *
 *   usdToGel: 1 USD  = `usdToGel` GEL
 *   gelToUsd: 1 GEL  = `gelToUsd` USD
 */
export const ExchangeRatesSchema = z.object({
  usdToGel: z.number().positive('Rate must be greater than 0'),
  gelToUsd: z.number().positive('Rate must be greater than 0'),
  updatedAt: z.string().datetime(),
});

export type ExchangeRates = z.infer<typeof ExchangeRatesSchema>;

/** Editable in the form: just the two rates. */
export const ExchangeRatesDraftSchema = ExchangeRatesSchema.pick({
  usdToGel: true,
  gelToUsd: true,
});

export type ExchangeRatesDraft = z.infer<typeof ExchangeRatesDraftSchema>;

/**
 * Sensible starting point (~mid-2026). These are placeholders the user is
 * expected to overwrite in the Exchange tab with the rate they actually use.
 */
export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  usdToGel: 2.7,
  gelToUsd: 0.37,
  updatedAt: '2026-06-18T00:00:00.000Z',
};
