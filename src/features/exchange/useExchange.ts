import { useStore } from '@/app/store/StoreContext';
import type { ExchangeRatesDraft } from './schema';

/** The saved USD<->GEL rates and an updater. Rates persist until changed. */
export function useExchange() {
  const { state, dispatch } = useStore();

  function updateRates(draft: ExchangeRatesDraft): void {
    dispatch({
      type: 'UPDATE_EXCHANGE_RATES',
      rates: { ...draft, updatedAt: new Date().toISOString() },
    });
  }

  return { rates: state.exchangeRates, updateRates };
}
