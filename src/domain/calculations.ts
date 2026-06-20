import type { Money } from '@/types/money';
import type { Goal } from '@/features/goals/schema';
import type { Contribution } from '@/features/contributions/schema';
import type { ExchangeRates } from '@/features/exchange/schema';
import { FEE_CURRENCY, GOAL_CURRENCY } from '@/constants/currency';
import { convert } from '@/utils/money';
import { addMonths, currentMonthKey, toMonthKey } from '@/utils/date';

/**
 * Core goal math. Native storage currencies:
 *   - bike price:    GOAL_CURRENCY (USD)
 *   - goal fees:     FEE_CURRENCY (GEL)
 *   - contributions: CONTRIBUTION_CURRENCY (GEL)
 * Since almost everything is GEL, we compute totals/remaining/progress in GEL
 * (FEE_CURRENCY) — only the bike price is converted (USD -> GEL). No React,
 * no I/O: trivially unit-testable.
 */

/** Sum of the GEL-denominated fees (registration, insurance, gear/license/preps). */
export function totalFees(goal: Goal): Money {
  return goal.registrationFees + goal.insuranceEstimate + goal.additionalFees;
}

/** Total required in GEL: bike price (USD -> GEL) + GEL fees. */
export function totalRequired(goal: Goal, rates: ExchangeRates): Money {
  const priceGel = convert(goal.price, GOAL_CURRENCY, FEE_CURRENCY, rates);
  return priceGel + totalFees(goal);
}

/** Everything contributed so far — in CONTRIBUTION_CURRENCY (GEL), exact. */
export function totalSaved(contributions: Contribution[]): Money {
  return contributions.reduce((sum, c) => sum + c.amount, 0);
}

/** How much is still needed, in GEL. Never negative. */
export function remainingAmount(
  goal: Goal,
  contributions: Contribution[],
  rates: ExchangeRates,
): Money {
  return Math.max(0, totalRequired(goal, rates) - totalSaved(contributions));
}

/** Progress as a 0..1 ratio (both sides in GEL), clamped. */
export function progressRatio(
  goal: Goal,
  contributions: Contribution[],
  rates: ExchangeRates,
): number {
  const required = totalRequired(goal, rates);
  if (required <= 0) return 0;
  return Math.min(1, totalSaved(contributions) / required);
}

/** Progress as a 0..100 percentage. */
export function progressPercent(
  goal: Goal,
  contributions: Contribution[],
  rates: ExchangeRates,
): number {
  return progressRatio(goal, contributions, rates) * 100;
}

/** Sum of contributions grouped by month (GEL native), e.g. { "2026-06": 90000 }. */
export function contributionsByMonth(contributions: Contribution[]): Map<string, Money> {
  const map = new Map<string, Money>();
  for (const c of contributions) {
    const key = toMonthKey(c.date);
    map.set(key, (map.get(key) ?? 0) + c.amount);
  }
  return map;
}

/**
 * Average contribution per ACTIVE month (months with a deposit), in GEL.
 * Using active months — not calendar months elapsed — keeps the forecast from
 * being dragged down by months you intentionally skipped.
 */
export function averageMonthlyContribution(contributions: Contribution[]): Money {
  const byMonth = contributionsByMonth(contributions);
  if (byMonth.size === 0) return 0;
  const total = [...byMonth.values()].reduce((a, b) => a + b, 0);
  return Math.round(total / byMonth.size);
}

/**
 * Estimated completion month from a monthly saving rate. `remaining` and
 * `monthlyRate` must be in the SAME currency. Null when the rate is 0.
 */
export function estimatedCompletionMonth(
  remaining: Money,
  monthlyRate: Money,
  from: string = currentMonthKey(),
): string | null {
  if (remaining <= 0) return from;
  if (monthlyRate <= 0) return null;
  const months = Math.ceil(remaining / monthlyRate);
  return addMonths(from as never, months);
}
