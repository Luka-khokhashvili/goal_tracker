import { z } from 'zod';
import { MoneySchema } from '@/types/money';

/** "YYYY-MM" — the month a target applies to, e.g. "2026-06". */
export const MonthKeySchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format');
export type MonthKey = z.infer<typeof MonthKeySchema>;

/**
 * A savings target the user sets for a specific month, e.g. June 2026 → ₾900
 * (a reserve-pay month). The dashboard compares contributions logged in that
 * month against this target to show "this month's progress". At most one
 * target per (goal, month) — the store enforces uniqueness.
 *
 * `amount` is in GEL minor units (tetri) — see TARGET_CURRENCY. Targets are
 * edited in GEL only; the USD equivalent is derived for display.
 */
export const MonthlyTargetSchema = z.object({
  id: z.string().uuid(),
  goalId: z.string().uuid(),
  month: MonthKeySchema,
  amount: MoneySchema,
  note: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
});

export type MonthlyTarget = z.infer<typeof MonthlyTargetSchema>;

export const MonthlyTargetDraftSchema = MonthlyTargetSchema.pick({
  month: true,
  amount: true,
  note: true,
});

export type MonthlyTargetDraft = z.infer<typeof MonthlyTargetDraftSchema>;

/**
 * The recurring rule that decides each month's target without hand-entry:
 * save `baseAmount` every month, but `boostAmount` on reserve-pay months,
 * which recur every `boostIntervalMonths` starting from `boostAnchorMonth`.
 *
 * Default = ₾600/month, ₾900 on every 6th month, anchored to June 2026 (a
 * known reserve-pay month). An explicit MonthlyTarget overrides the rule for
 * that one month.
 *
 * `baseAmount`/`boostAmount` are in GEL minor units (tetri) — see
 * TARGET_CURRENCY. They are edited in GEL only; USD is a derived view.
 */
export const TargetRuleSchema = z.object({
  baseAmount: MoneySchema,
  boostAmount: MoneySchema,
  boostIntervalMonths: z.number().int().positive(),
  boostAnchorMonth: MonthKeySchema,
});

export type TargetRule = z.infer<typeof TargetRuleSchema>;

/** Editable in the GEL-only rule form: the two amounts. */
export const TargetRuleDraftSchema = TargetRuleSchema.pick({
  baseAmount: true,
  boostAmount: true,
});
export type TargetRuleDraft = z.infer<typeof TargetRuleDraftSchema>;

export const DEFAULT_TARGET_RULE: TargetRule = {
  baseAmount: 60_000, // ₾600.00 (GEL)
  boostAmount: 90_000, // ₾900.00 (GEL)
  boostIntervalMonths: 6,
  boostAnchorMonth: '2026-06',
};
