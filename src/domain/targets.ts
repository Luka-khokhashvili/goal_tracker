import type { Money } from '@/types/money';
import type { MonthKey, MonthlyTarget, TargetRule } from '@/features/targets/schema';
import { monthsBetween } from '@/utils/date';

/**
 * Pure rules for "what should I save in month X". All amounts returned are in
 * GEL minor units (tetri) — targets are GEL-native (see TARGET_CURRENCY).
 */

/**
 * Is `month` a reserve-pay (boost) month? True when it sits a whole multiple of
 * `boostIntervalMonths` away from the anchor — in either direction, so the
 * pattern holds for months before and after the anchor.
 */
export function isBoostMonth(month: MonthKey, rule: TargetRule): boolean {
  const diff = monthsBetween(rule.boostAnchorMonth, month);
  const mod = ((diff % rule.boostIntervalMonths) + rule.boostIntervalMonths) % rule.boostIntervalMonths;
  return mod === 0;
}

/**
 * The effective target for a month (GEL minor units):
 *   1. an explicit per-month override wins, else
 *   2. the boost amount on reserve-pay months, else
 *   3. the base amount.
 */
export function resolveMonthlyTarget(
  month: MonthKey,
  rule: TargetRule,
  overrides: MonthlyTarget[],
): Money {
  const override = overrides.find((o) => o.month === month);
  if (override) return override.amount;
  return isBoostMonth(month, rule) ? rule.boostAmount : rule.baseAmount;
}

/** Why a month resolved the way it did — handy for UI labels/tooltips. */
export type TargetSource = 'override' | 'boost' | 'base';

export function resolveMonthlyTargetSource(
  month: MonthKey,
  rule: TargetRule,
  overrides: MonthlyTarget[],
): TargetSource {
  if (overrides.some((o) => o.month === month)) return 'override';
  return isBoostMonth(month, rule) ? 'boost' : 'base';
}
