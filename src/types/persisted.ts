import { z } from 'zod';
import { CURRENT_SCHEMA_VERSION } from '@/constants/schema';
import { GoalSchema } from '@/features/goals/schema';
import { ContributionSchema } from '@/features/contributions/schema';
import { ScenarioSchema } from '@/features/scenarios/schema';
import { MonthlyTargetSchema } from '@/features/targets/schema';
import { AppSettingsSchema, DEFAULT_SETTINGS } from '@/features/settings/schema';

/**
 * The entire app state, exactly as it lives in localStorage. Flat arrays with
 * foreign keys (goalId) mirror relational tables — this is what makes a future
 * Supabase migration a near-mechanical mapping (one table per array).
 *
 * `schemaVersion` is validated against the current version so the storage
 * layer can detect and migrate older saved data.
 */
export const PersistedStateSchema = z.object({
  schemaVersion: z.number().int().positive(),
  goals: z.array(GoalSchema).default([]),
  contributions: z.array(ContributionSchema).default([]),
  scenarios: z.array(ScenarioSchema).default([]),
  monthlyTargets: z.array(MonthlyTargetSchema).default([]),
  settings: AppSettingsSchema.default(DEFAULT_SETTINGS),
});

export type PersistedState = z.infer<typeof PersistedStateSchema>;

/** The shape used for a brand-new, empty install. */
export const EMPTY_STATE: PersistedState = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  goals: [],
  contributions: [],
  scenarios: [],
  monthlyTargets: [],
  settings: DEFAULT_SETTINGS,
};
