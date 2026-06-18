import type { PersistedState } from '@/types';
import type { Action } from './actions';

/**
 * Pure reducer over the persisted state. Each case returns a new state object
 * (no mutation), so React sees changes and the persistence effect can save.
 */
export function reducer(state: PersistedState, action: Action): PersistedState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;

    case 'ADD_GOAL': {
      // First goal becomes the active one automatically.
      const activeGoalId = state.settings.activeGoalId ?? action.goal.id;
      return {
        ...state,
        goals: [...state.goals, action.goal],
        settings: { ...state.settings, activeGoalId },
      };
    }

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) => (g.id === action.goal.id ? action.goal : g)),
      };

    case 'ARCHIVE_GOAL':
      return {
        ...state,
        goals: state.goals.map((g) =>
          g.id === action.id
            ? { ...g, status: 'archived', updatedAt: action.updatedAt }
            : g,
        ),
        settings:
          state.settings.activeGoalId === action.id
            ? { ...state.settings, activeGoalId: nextActiveId(state, action.id) }
            : state.settings,
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((g) => g.id !== action.id),
        // Cascade: drop dependent records so we never orphan data.
        contributions: state.contributions.filter((c) => c.goalId !== action.id),
        monthlyTargets: state.monthlyTargets.filter((t) => t.goalId !== action.id),
        scenarios: state.scenarios.filter((s) => s.goalId !== action.id),
        settings:
          state.settings.activeGoalId === action.id
            ? { ...state.settings, activeGoalId: nextActiveId(state, action.id) }
            : state.settings,
      };

    case 'SET_ACTIVE_GOAL':
      return { ...state, settings: { ...state.settings, activeGoalId: action.id } };

    case 'ADD_CONTRIBUTION':
      return { ...state, contributions: [...state.contributions, action.contribution] };

    case 'UPDATE_CONTRIBUTION':
      return {
        ...state,
        contributions: state.contributions.map((c) =>
          c.id === action.contribution.id ? action.contribution : c,
        ),
      };

    case 'DELETE_CONTRIBUTION':
      return {
        ...state,
        contributions: state.contributions.filter((c) => c.id !== action.id),
      };

    case 'UPSERT_MONTHLY_TARGET': {
      // One override per (goal, month): replace if it exists, else append.
      const exists = state.monthlyTargets.some(
        (t) => t.goalId === action.target.goalId && t.month === action.target.month,
      );
      return {
        ...state,
        monthlyTargets: exists
          ? state.monthlyTargets.map((t) =>
              t.goalId === action.target.goalId && t.month === action.target.month
                ? action.target
                : t,
            )
          : [...state.monthlyTargets, action.target],
      };
    }

    case 'DELETE_MONTHLY_TARGET':
      return {
        ...state,
        monthlyTargets: state.monthlyTargets.filter((t) => t.id !== action.id),
      };

    case 'UPDATE_TARGET_RULE':
      return { ...state, targetRule: action.rule };

    case 'UPDATE_EXCHANGE_RATES':
      return { ...state, exchangeRates: action.rates };

    case 'SET_DISPLAY_CURRENCY':
      return { ...state, settings: { ...state.settings, displayCurrency: action.currency } };

    case 'SET_THEME':
      return { ...state, settings: { ...state.settings, theme: action.theme } };

    default:
      return state;
  }
}

/** Pick a sensible active goal after the current one is archived/deleted. */
function nextActiveId(state: PersistedState, removedId: string): string | null {
  const remaining = state.goals.filter(
    (g) => g.id !== removedId && g.status === 'active',
  );
  return remaining[0]?.id ?? null;
}
