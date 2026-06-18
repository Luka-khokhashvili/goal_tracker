import { z } from 'zod';

/**
 * Money is an INTEGER amount in the currency's minor unit (e.g. US cents,
 * GEL tetri). 1 dollar = 100. We never store money as a float, because
 * `0.1 + 0.2 !== 0.3` in JavaScript and rounding errors accumulate.
 *
 * Conversion to/from a human "dollars" value happens only at the edges
 * (input parsing, display formatting) via helpers in `utils/money` (Phase 5).
 */
export type Money = number;

export const MoneySchema = z
  .number({ invalid_type_error: 'Amount must be a number' })
  .int('Amount must be a whole number of minor units (cents)')
  .nonnegative('Amount cannot be negative');
