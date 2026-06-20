import { useStore } from '@/app/store/StoreContext';

/**
 * The manually-entered "how much of my savings I currently hold as USD" figure.
 * Stored in USD minor units; informational only (doesn't affect goal totals).
 */
export function useHoldings() {
  const { state, dispatch } = useStore();

  function setUsdHoldings(usdMinor: number): void {
    dispatch({ type: 'SET_USD_HOLDINGS', amount: usdMinor });
  }

  return { usdHoldings: state.usdHoldings, setUsdHoldings };
}
