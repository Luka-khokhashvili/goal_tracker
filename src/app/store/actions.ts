import type { PersistedState } from '@/types';
import type { Goal } from '@/features/goals/schema';
import type { Contribution } from '@/features/contributions/schema';
import type { MonthlyTarget, TargetRule } from '@/features/targets/schema';
import type { ExchangeRates } from '@/features/exchange/schema';
import type { Currency } from '@/constants/currency';
import type { Theme } from '@/features/settings/schema';

/**
 * The full set of state transitions. Entities arrive fully-formed (id +
 * timestamps already stamped by the dispatching hook), so the reducer stays a
 * pure function of (state, action) with no clock or RNG inside it.
 */
export type Action =
  | { type: 'HYDRATE'; state: PersistedState }
  | { type: 'ADD_GOAL'; goal: Goal }
  | { type: 'UPDATE_GOAL'; goal: Goal }
  | { type: 'ARCHIVE_GOAL'; id: string; updatedAt: string }
  | { type: 'DELETE_GOAL'; id: string }
  | { type: 'SET_ACTIVE_GOAL'; id: string | null }
  | { type: 'ADD_CONTRIBUTION'; contribution: Contribution }
  | { type: 'UPDATE_CONTRIBUTION'; contribution: Contribution }
  | { type: 'DELETE_CONTRIBUTION'; id: string }
  | { type: 'UPSERT_MONTHLY_TARGET'; target: MonthlyTarget }
  | { type: 'DELETE_MONTHLY_TARGET'; id: string }
  | { type: 'UPDATE_TARGET_RULE'; rule: TargetRule }
  | { type: 'UPDATE_EXCHANGE_RATES'; rates: ExchangeRates }
  | { type: 'SET_DISPLAY_CURRENCY'; currency: Currency }
  | { type: 'SET_THEME'; theme: Theme };
