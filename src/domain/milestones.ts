import type { Money } from '@/types/money';
import type { Goal } from '@/features/goals/schema';
import type { Contribution } from '@/features/contributions/schema';
import { MILESTONE_THRESHOLDS } from '@/constants/milestones';
import { progressPercent, totalRequired } from './calculations';

export interface Milestone {
  /** 25 | 50 | 75 | 100 */
  percent: number;
  /** Amount saved that crosses this milestone (USD minor units). */
  amount: Money;
  /** Already reached at current progress? */
  reached: boolean;
}

/**
 * Generate the 25/50/75/100% milestones for a goal, each flagged reached or
 * upcoming based on current progress.
 */
export function buildMilestones(goal: Goal, contributions: Contribution[]): Milestone[] {
  const required = totalRequired(goal);
  const progress = progressPercent(goal, contributions);
  return MILESTONE_THRESHOLDS.map((percent) => ({
    percent,
    amount: Math.round((required * percent) / 100),
    reached: progress >= percent,
  }));
}

/** The next milestone not yet reached, or null when the goal is complete. */
export function nextMilestone(goal: Goal, contributions: Contribution[]): Milestone | null {
  return buildMilestones(goal, contributions).find((m) => !m.reached) ?? null;
}
