import { useMemo } from 'react';
import { useStore } from '@/app/store/StoreContext';
import { useGoals } from '@/features/goals/useGoals';
import { useContributions } from '@/features/contributions/useContributions';
import { CONTRIBUTION_CURRENCY, CURRENCIES } from '@/constants/currency';
import { convert, toMajor } from '@/utils/money';
import { formatMonthKey } from '@/utils/date';
import {
  averageMonthlyContribution,
  totalRequired,
  totalSaved,
} from '@/domain/calculations';
import {
  cumulativeSavingsSeries,
  forecastToGoal,
  monthlyContributionSeries,
} from '@/domain/forecast';

export interface ChartPoint {
  label: string; // "Jun 2026"
  value: number; // display-currency MAJOR units
}

/**
 * Prepares the three chart datasets, all converted into the display currency so
 * the axes and tooltips read consistently regardless of each amount's native
 * currency (goal=USD, contributions=GEL).
 */
export function useGoalCharts() {
  const { state } = useStore();
  const { activeGoal } = useGoals();
  const { contributions } = useContributions();
  const display = state.settings.displayCurrency;
  const rates = state.exchangeRates;
  const symbol = CURRENCIES[display].symbol;

  return useMemo(() => {
    const gel = (minor: number) =>
      toMajor(convert(minor, CONTRIBUTION_CURRENCY, display, rates), display);

    const cumulative: ChartPoint[] = cumulativeSavingsSeries(contributions).map((p) => ({
      label: formatMonthKey(p.month as never),
      value: gel(p.amount),
    }));

    const monthly: ChartPoint[] = monthlyContributionSeries(contributions).map((p) => ({
      label: formatMonthKey(p.month as never),
      value: gel(p.amount),
    }));

    // Forecast in display currency: start from saved, add avg/month up to target.
    // totalRequired is in GEL (bike price already converted USD->GEL inside).
    const targetMinor = activeGoal
      ? convert(totalRequired(activeGoal, rates), CONTRIBUTION_CURRENCY, display, rates)
      : 0;
    const startMinor = convert(totalSaved(contributions), CONTRIBUTION_CURRENCY, display, rates);
    const rateMinor = convert(
      averageMonthlyContribution(contributions),
      CONTRIBUTION_CURRENCY,
      display,
      rates,
    );
    const forecast: ChartPoint[] = forecastToGoal(startMinor, targetMinor, rateMinor).map((p) => ({
      label: formatMonthKey(p.month as never),
      value: toMajor(p.amount, display),
    }));

    const targetValue = activeGoal ? gel(totalRequired(activeGoal, rates)) : 0;

    return { cumulative, monthly, forecast, targetValue, symbol, display };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contributions, activeGoal, display, rates.usdToGel, rates.gelToUsd]);
}
