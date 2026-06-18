/** Single import surface for the app's domain vocabulary. */
export type { Money } from './money';
export { MoneySchema } from './money';

export type { PersistedState } from './persisted';
export { PersistedStateSchema, EMPTY_STATE } from './persisted';

export type { Goal, GoalDraft, GoalStatus } from '@/features/goals/schema';
export { GoalSchema, GoalDraftSchema } from '@/features/goals/schema';

export type {
  Contribution,
  ContributionDraft,
} from '@/features/contributions/schema';
export {
  ContributionSchema,
  ContributionDraftSchema,
} from '@/features/contributions/schema';

export type {
  MonthlyTarget,
  MonthlyTargetDraft,
  MonthKey,
} from '@/features/targets/schema';
export {
  MonthlyTargetSchema,
  MonthlyTargetDraftSchema,
  MonthKeySchema,
} from '@/features/targets/schema';

export type { Scenario, ScenarioDraft } from '@/features/scenarios/schema';
export { ScenarioSchema, ScenarioDraftSchema } from '@/features/scenarios/schema';

export type { AppSettings, Theme } from '@/features/settings/schema';
export { AppSettingsSchema, DEFAULT_SETTINGS } from '@/features/settings/schema';

export type { Currency } from '@/constants/currency';
export { CurrencySchema, CURRENCIES, DEFAULT_CURRENCY } from '@/constants/currency';
