import type { PersistedState } from '@/types';

/**
 * The data-access seam. The app (store/hooks) depends only on this interface,
 * never on localStorage. Methods are async even though the localStorage
 * implementation is synchronous — so a future SupabaseRepository (which IS
 * async) drops in by changing one line in `repository/index.ts`, with zero
 * changes in components or the store.
 *
 * A snapshot model (load/save the whole state) is the right fit for a
 * single-user, offline-first app. A Supabase implementation would map the
 * snapshot's flat arrays to tables (goals, contributions, ...) on save and
 * join them back on load.
 */
export interface Repository {
  /** Read the full app state. Never rejects — returns empty state on trouble. */
  load(): Promise<PersistedState>;
  /** Persist the full app state. */
  save(state: PersistedState): Promise<void>;
  /** Remove all persisted data. */
  clear(): Promise<void>;
}
