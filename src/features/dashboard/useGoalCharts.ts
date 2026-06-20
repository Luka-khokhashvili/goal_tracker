import { useMemo } from 'react';
import { useStore } from '@/app/store/StoreContext';
import { useGoals } from '@/features/goals/useGoals';
import { useContributions } from '@/features/contributions/useContributions';
import { CURRENCIES } from '@/constants/currency';
import { toMajor } from '@/utils/money';
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
  value: number; // GEL MAJOR units
}

/**
 * Prepares the three chart datasets. Everything is shown in GEL — the savings
 * currency — exactly (the bike price is converted USD->GEL once inside
 * totalRequired, with the saved exchange rate). No display-currency round-trip,
 * so values never drift.
 */
export function useGoalCharts() {
  const { state } = useStore();
  const { activeGoal } = useGoals();
  const { contributions } = useContributions();
  const rates = state.exchangeRates;
  const symbol = CURRENCIES.GEL.symbol;

  return useMemo(() => {
    const gel = (minor: number) => toMajor(minor, 'GEL');

    const cumulative: ChartPoint[] = cumulativeSavingsSeries(contributions).map((p) => ({
      label: formatMonthKey(p.month as never),
      value: gel(p.amount),
    }));

    const monthly: ChartPoint[] = monthlyContributionSeries(contributions).map((p) => ({
      label: formatMonthKey(p.month as never),
      value: gel(p.amount),
    }));

    // Forecast in GEL: start from saved, add avg/month up to the GEL target.
    const targetMinor = activeGoal ? totalRequired(activeGoal, rates) : 0;
    const startMinor = totalSaved(contributions);
    const rateMinor = averageMonthlyContribution(contributions);
    const forecast: ChartPoint[] = forecastToGoal(startMinor, targetMinor, rateMinor).map((p) => ({
      label: formatMonthKey(p.month as never),
      value: gel(p.amount),
    }));

    const targetValue = gel(targetMinor);

    return { cumulative, monthly, forecast, targetValue, symbol };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contributions, activeGoal, rates.usdToGel, rates.gelToUsd]);
}
