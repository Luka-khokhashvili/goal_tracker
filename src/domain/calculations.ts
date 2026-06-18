import type { Money } from '@/types/money';
import type { Goal } from '@/features/goals/schema';
import type { Contribution } from '@/features/contributions/schema';
import { addMonths, currentMonthKey, toMonthKey } from '@/utils/date';

/**
 * Core goal math. Inputs and outputs are in BASE_CURRENCY minor units (USD
 * cents); these functions are currency-agnostic integers — display conversion
 * happens in the UI layer. No React, no I/O: trivially unit-testable.
 */

/** Bike price + every fee that stands between you and riding away. */
export function totalRequired(goal: Goal): Money {
  return (
    goal.price +
    goal.registrationFees +
    goal.insuranceEstimate +
    goal.additionalFees
  );
}

/** Everything contributed to this goal so far. */
export function totalSaved(contributions: Contribution[]): Money {
  return contributions.reduce((sum, c) => sum + c.amount, 0);
}

/** How much is still needed (never negative). */
export function remainingAmount(goal: Goal, contributions: Contribution[]): Money {
  return Math.max(0, totalRequired(goal) - totalSaved(contributions));
}

/** Progress as a 0..1 ratio, clamped (over-saving caps at 1). */
export function progressRatio(goal: Goal, contributions: Contribution[]): number {
  const required = totalRequired(goal);
  if (required <= 0) return 0;
  return Math.min(1, totalSaved(contributions) / required);
}

/** Progress as a 0..100 percentage. */
export function progressPercent(goal: Goal, contributions: Contribution[]): number {
  return progressRatio(goal, contributions) * 100;
}

/** Sum of contributions grouped by their month, e.g. { "2026-06": 90000 }. */
export function contributionsByMonth(
  contributions: Contribution[],
): Map<string, Money> {
  const map = new Map<string, Money>();
  for (const c of contributions) {
    const key = toMonthKey(c.date);
    map.set(key, (map.get(key) ?? 0) + c.amount);
  }
  return map;
}

/**
 * Average contribution per ACTIVE month (months that actually had a deposit).
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
 * Estimated calendar month (as a month key) the goal is reached, based on a
 * monthly saving rate. Returns null when the rate is 0 (would never finish) or
 * the goal is already met.
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
