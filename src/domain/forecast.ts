import type { Money } from '@/types/money';
import type { Contribution } from '@/features/contributions/schema';
import type { Scenario } from '@/features/scenarios/schema';
import { addMonths, currentMonthKey } from '@/utils/date';
import { contributionsByMonth } from './calculations';

/** One point on a time series, keyed by month. All amounts are USD minor units. */
export interface MonthPoint {
  month: string; // "YYYY-MM"
  amount: Money;
}

/** Per-month contribution totals, sorted chronologically (for the bar chart). */
export function monthlyContributionSeries(contributions: Contribution[]): MonthPoint[] {
  return [...contributionsByMonth(contributions).entries()]
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/** Running cumulative total over time (for the savings-growth line chart). */
export function cumulativeSavingsSeries(contributions: Contribution[]): MonthPoint[] {
  let running = 0;
  return monthlyContributionSeries(contributions).map((p) => {
    running += p.amount;
    return { month: p.month, amount: running };
  });
}

/** How many whole months at `monthlyRate` to cover `remaining`. Null if never. */
export function monthsToGoal(remaining: Money, monthlyRate: Money): number | null {
  if (remaining <= 0) return 0;
  if (monthlyRate <= 0) return null;
  return Math.ceil(remaining / monthlyRate);
}

export interface ScenarioProjection {
  scenarioId: string;
  label: string;
  monthlyAmount: Money;
  months: number | null;
  /** Projected completion month key, or null if the rate never finishes. */
  completionMonth: string | null;
}

/** Project completion for each "what if I saved X/month" scenario. */
export function projectScenarios(
  remaining: Money,
  scenarios: Scenario[],
  from: string = currentMonthKey(),
): ScenarioProjection[] {
  return scenarios.map((s) => {
    const months = monthsToGoal(remaining, s.monthlyAmount);
    return {
      scenarioId: s.id,
      label: s.label,
      monthlyAmount: s.monthlyAmount,
      months,
      completionMonth: months === null ? null : addMonths(from as never, months),
    };
  });
}

/**
 * Forward projection of cumulative savings from `startTotal`, adding
 * `monthlyRate` each month until `target` is reached (capped at `maxMonths`).
 * Drives the "completion forecast" chart's future segment.
 */
export function forecastToGoal(
  startTotal: Money,
  target: Money,
  monthlyRate: Money,
  from: string = currentMonthKey(),
  maxMonths = 120,
): MonthPoint[] {
  const points: MonthPoint[] = [{ month: from, amount: startTotal }];
  if (monthlyRate <= 0) return points;
  let total = startTotal;
  for (let i = 1; i <= maxMonths && total < target; i++) {
    total = Math.min(target, total + monthlyRate);
    points.push({ month: addMonths(from as never, i), amount: total });
  }
  return points;
}
