import type { PersistedState } from '@/types';
import { clearState, loadState, saveState } from '@/services/storage';
import type { Repository } from './Repository';

/**
 * localStorage-backed Repository. Wraps the synchronous storage service in
 * promises to satisfy the async contract. The `await Promise.resolve()` makes
 * the async boundary explicit and keeps call sites identical to what a real
 * network-backed repository would need.
 */
export class LocalStorageRepository implements Repository {
  async load(): Promise<PersistedState> {
    await Promise.resolve();
    return loadState();
  }

  async save(state: PersistedState): Promise<void> {
    await Promise.resolve();
    saveState(state);
  }

  async clear(): Promise<void> {
    await Promise.resolve();
    clearState();
  }
}
