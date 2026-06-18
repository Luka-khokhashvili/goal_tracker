import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import { EMPTY_STATE, type PersistedState } from '@/types';
import { repository } from '@/services/repository';
import { reducer } from './reducer';
import type { Action } from './actions';

interface StoreContextValue {
  state: PersistedState;
  dispatch: Dispatch<Action>;
  /** 'loading' until the repository has hydrated initial state. */
  status: 'loading' | 'ready';
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const hydrated = useRef(false);

  // Load persisted state once on mount.
  useEffect(() => {
    let cancelled = false;
    void repository.load().then((loaded) => {
      if (cancelled) return;
      dispatch({ type: 'HYDRATE', state: loaded });
      hydrated.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist after every change — but only once initial hydration is done, so
  // we never overwrite saved data with the empty bootstrap state.
  useEffect(() => {
    if (!hydrated.current) return;
    void repository.save(state);
  }, [state]);

  const status: 'loading' | 'ready' = hydrated.current ? 'ready' : 'loading';

  return (
    <StoreContext.Provider value={{ state, dispatch, status }}>
      {children}
    </StoreContext.Provider>
  );
}

/** Access the store. Throws if used outside <StoreProvider>. */
export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
