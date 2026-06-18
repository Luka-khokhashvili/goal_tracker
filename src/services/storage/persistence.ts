import { CURRENT_SCHEMA_VERSION, STORAGE_KEY } from '@/constants/schema';
import { EMPTY_STATE, PersistedStateSchema, type PersistedState } from '@/types';
import type { Goal } from '@/features/goals/schema';
import type { Contribution } from '@/features/contributions/schema';
import { localStorageAdapter } from './localStorageAdapter';
import { migrate } from './migrations';

/**
 * Typed read of the whole app state. Never throws: anything wrong with the
 * stored data (missing, malformed JSON, fails validation) resolves to a fresh
 * EMPTY_STATE so the app boots instead of white-screening.
 */
export function loadState(): PersistedState {
  const raw = localStorageAdapter.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(EMPTY_STATE);

  try {
    const migrated = migrate(JSON.parse(raw));
    const result = PersistedStateSchema.safeParse(migrated);
    if (result.success) return result.data;
    console.warn(
      '[storage] Persisted state failed validation; using empty state.',
      result.error.flatten(),
    );
  } catch (error) {
    console.warn('[storage] Could not parse persisted state; using empty state.', error);
  }
  return structuredClone(EMPTY_STATE);
}

/** Typed write of the whole app state. Stamps the current schema version. */
export function saveState(state: PersistedState): void {
  const payload: PersistedState = { ...state, schemaVersion: CURRENT_SCHEMA_VERSION };
  localStorageAdapter.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/** Wipe all persisted data (used by a future "reset" action). */
export function clearState(): void {
  localStorageAdapter.removeItem(STORAGE_KEY);
}

/*
 * Granular helpers from the spec. They operate on the single snapshot via
 * read-modify-write, so the persisted blob stays internally consistent.
 */
export function loadGoals(): Goal[] {
  return loadState().goals;
}

export function saveGoals(goals: Goal[]): void {
  saveState({ ...loadState(), goals });
}

export function loadContributions(): Contribution[] {
  return loadState().contributions;
}

export function saveContributions(contributions: Contribution[]): void {
  saveState({ ...loadState(), contributions });
}
