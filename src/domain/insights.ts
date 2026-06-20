import type { Goal } from '@/features/goals/schema';
import type { Contribution } from '@/features/contributions/schema';
import type { MonthlyTarget, TargetRule } from '@/features/targets/schema';
import type { ExchangeRates } from '@/features/exchange/schema';
import { CONTRIBUTION_CURRENCY, type Currency } from '@/constants/currency';
import { convert, formatMoney } from '@/utils/money';
import { currentMonthKey, formatMonthKey } from '@/utils/date';
import { resolveMonthlyTarget } from './targets';
import {
  averageMonthlyContribution,
  contributionsByMonth,
  estimatedCompletionMonth,
  progressPercent,
  remainingAmount,
} from './calculations';

export type InsightTone = 'positive' | 'neutral' | 'warning';

export interface Insight {
  id: string;
  text: string;
  tone: InsightTone;
}

export interface InsightContext {
  goal: Goal;
  contributions: Contribution[];
  rule: TargetRule;
  overrides: MonthlyTarget[];
  rates: ExchangeRates;
  displayCurrency: Currency;
  now?: Date;
}

/**
 * Build the dashboard's narrative insights. Each money figure is converted
 * from its native currency (base USD, or GEL for targets) into the user's
 * display currency before formatting, so the sentences read consistently.
 */
export function generateInsights(ctx: InsightContext): Insight[] {
  const { goal, contributions, rule, overrides, rates, displayCurrency } = ctx;
  // All headline figures (required, remaining, targets, contributions) are in
  // GEL — format them into the display currency.
  const fmtGel = (minor: number) =>
    formatMoney(convert(minor, CONTRIBUTION_CURRENCY, displayCurrency, rates), displayCurrency);

  const insights: Insight[] = [];
  const percent = Math.round(progressPercent(goal, contributions, rates));
  const remaining = remainingAmount(goal, contributions, rates); // GEL
  const avg = averageMonthlyContribution(contributions); // GEL

  // 1. Headline progress.
  insights.push({
    id: 'progress',
    text:
      percent >= 100
        ? `🎉 Goal reached — you've fully funded ${goal.motorcycleModel || goal.name}.`
        : `You've completed ${percent}% of your goal.`,
    tone: percent >= 100 ? 'positive' : 'neutral',
  });

  // 2. Remaining amount.
  if (remaining > 0) {
    insights.push({
      id: 'remaining',
      text: `You need ${fmtGel(remaining)} more to reach your goal.`,
      tone: 'neutral',
    });
  }

  // 3. Pace / ETA.
  if (remaining > 0) {
    if (avg > 0) {
      const month = estimatedCompletionMonth(remaining, avg);
      insights.push({
        id: 'eta',
        text: month
          ? `At your current pace (~${fmtGel(avg)}/mo), you'll reach your goal around ${formatMonthKey(month as never)}.`
          : `Add a monthly contribution to project a completion date.`,
        tone: 'positive',
      });
    } else {
      insights.push({
        id: 'eta',
        text: 'Log your first contribution to see when you’ll reach your goal.',
        tone: 'neutral',
      });
    }
  }

  // 4. This month vs. target. Both target and contributions are GEL — compare directly.
  const monthKey = currentMonthKey(ctx.now);
  const targetGel = resolveMonthlyTarget(monthKey, rule, overrides);
  const savedThisMonth = contributionsByMonth(contributions).get(monthKey) ?? 0;
  if (targetGel > 0) {
    const hit = savedThisMonth >= targetGel;
    insights.push({
      id: 'month-target',
      text: hit
        ? `You've hit this month's ${fmtGel(targetGel)} savings target — nicely done.`
        : `This month: ${fmtGel(savedThisMonth)} saved of a ${fmtGel(targetGel)} target.`,
      tone: hit ? 'positive' : 'warning',
    });
  }

  // 5. Momentum vs. personal average.
  if (avg > 0 && savedThisMonth > 0) {
    const delta = Math.round(((savedThisMonth - avg) / avg) * 100);
    if (Math.abs(delta) >= 5) {
      insights.push({
        id: 'momentum',
        text:
          delta > 0
            ? `You saved ${delta}% more this month than your average.`
            : `You saved ${Math.abs(delta)}% less this month than your average.`,
        tone: delta > 0 ? 'positive' : 'warning',
      });
    }
  }

  return insights;
}
