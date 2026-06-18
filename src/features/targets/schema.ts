import { z } from 'zod';
import { MoneySchema } from '@/types/money';

/** "YYYY-MM" — the month a target applies to, e.g. "2026-06". */
export const MonthKeySchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format');
export type MonthKey = z.infer<typeof MonthKeySchema>;

/**
 * A savings target the user sets for a specific month, e.g. June 2026 → $900
 * (a reserve-pay month). The dashboard compares contributions logged in that
 * month against this target to show "this month's progress". At most one
 * target per (goal, month) — the store enforces uniqueness.
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
