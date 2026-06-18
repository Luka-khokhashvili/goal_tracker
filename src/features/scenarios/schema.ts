import { z } from 'zod';
import { MoneySchema } from '@/types/money';

/**
 * A "what if I saved X per month" experiment. Pure projection input — the
 * forecast logic (Phase 5) turns each scenario's monthly amount into a
 * projected completion date.
 */
export const ScenarioSchema = z.object({
  id: z.string().uuid(),
  goalId: z.string().uuid(),
  label: z.string().min(1, 'Give the scenario a label').max(60),
  monthlyAmount: MoneySchema,
});

export type Scenario = z.infer<typeof ScenarioSchema>;

export const ScenarioDraftSchema = ScenarioSchema.pick({
  label: true,
  monthlyAmount: true,
});

export type ScenarioDraft = z.infer<typeof ScenarioDraftSchema>;
