import { z } from 'zod';
import { MoneySchema } from '@/types/money';

export const GoalStatusSchema = z.enum(['active', 'archived']);
export type GoalStatus = z.infer<typeof GoalStatusSchema>;

/**
 * A savings goal = a motorcycle plus all the money it really takes to ride it
 * away (registration, insurance, gear/licence/lessons). The "total required"
 * is derived from these parts in the domain layer — never stored.
 */
export const GoalSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Give the goal a name').max(80),
  motorcycleModel: z.string().max(120).default(''),
  price: MoneySchema,
  registrationFees: MoneySchema.default(0),
  insuranceEstimate: MoneySchema.default(0),
  additionalFees: MoneySchema.default(0),
  notes: z.string().max(2000).default(''),
  status: GoalStatusSchema.default('active'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Goal = z.infer<typeof GoalSchema>;

/**
 * What a form supplies when creating/editing a goal: the user-editable fields
 * only. id/timestamps/status are managed by the store, not typed by hand.
 */
export const GoalDraftSchema = GoalSchema.pick({
  name: true,
  motorcycleModel: true,
  price: true,
  registrationFees: true,
  insuranceEstimate: true,
  additionalFees: true,
  notes: true,
});

export type GoalDraft = z.infer<typeof GoalDraftSchema>;
