import { z } from 'zod';
import { CurrencySchema, DEFAULT_CURRENCY } from '@/constants/currency';

export const ThemeSchema = z.enum(['dark', 'light']);
export type Theme = z.infer<typeof ThemeSchema>;

/**
 * App-wide preferences. Defaults make a fresh install sensible: USD display,
 * dark theme, no active goal selected yet.
 *
 * `displayCurrency` is what the UI shows and the user toggles. Stored money is
 * always in BASE_CURRENCY (USD cents); converting to displayCurrency happens at
 * the edges using the saved exchange rates — see `constants/currency`.
 */
export const AppSettingsSchema = z.object({
  displayCurrency: CurrencySchema.default(DEFAULT_CURRENCY),
  theme: ThemeSchema.default('dark'),
  activeGoalId: z.string().uuid().nullable().default(null),
});

export type AppSettings = z.infer<typeof AppSettingsSchema>;

export const DEFAULT_SETTINGS: AppSettings = AppSettingsSchema.parse({});
