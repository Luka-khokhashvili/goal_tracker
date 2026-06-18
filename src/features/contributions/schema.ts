import { z } from 'zod';
import { MoneySchema } from '@/types/money';

/**
 * A single deposit into a goal's fund. `date` is when the money was saved
 * (ISO datetime); the month it belongs to is derived from it. Contributions
 * can be logged any day — daily, weekly, or once a month.
 */
export const ContributionSchema = z.object({
  id: z.string().uuid(),
  goalId: z.string().uuid(),
  amount: MoneySchema,
  date: z.string().datetime(),
  note: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
});

export type Contribution = z.infer<typeof ContributionSchema>;

export const ContributionDraftSchema = ContributionSchema.pick({
  amount: true,
  date: true,
  note: true,
});

export type ContributionDraft = z.infer<typeof ContributionDraftSchema>;
