/**
 * The ONLY module in the app permitted to touch window.localStorage.
 * Everything else goes through here, so swapping the storage backend (or
 * mocking it in tests) is a one-file change.
 *
 * It degrades gracefully: if localStorage is unavailable (private mode, SSR,
 * storage disabled), it falls back to an in-memory map so the app keeps working
 * for the session instead of throwing.
 */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function localStorageWorks(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const probe = '__moto_probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function createMemoryStore(): KeyValueStore {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function createLocalStore(): KeyValueStore {
  return {
    getItem: (k) => {
      try {
        return window.localStorage.getItem(k);
      } catch {
        return null;
      }
    },
    setItem: (k, v) => {
      try {
        window.localStorage.setItem(k, v);
      } catch {
        // Quota exceeded or blocked — fail soft; data stays in memory only.
      }
    },
    removeItem: (k) => {
      try {
        window.localStorage.removeItem(k);
      } catch {
        /* ignore */
      }
    },
  };
}

export const localStorageAdapter: KeyValueStore = localStorageWorks()
  ? createLocalStore()
  : createMemoryStore();
