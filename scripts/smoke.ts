import { DEFAULT_TARGET_RULE } from '@/features/targets/schema';
import { DEFAULT_EXCHANGE_RATES } from '@/features/exchange/schema';
import { isBoostMonth, resolveMonthlyTarget } from '@/domain/targets';
import { convert, formatMoney, parseMoney } from '@/utils/money';
import {
  totalRequired,
  totalSaved,
  remainingAmount,
  progressPercent,
  averageMonthlyContribution,
  estimatedCompletionMonth,
} from '@/domain/calculations';
import { monthsToGoal } from '@/domain/forecast';
import type { Goal } from '@/features/goals/schema';
import type { Contribution } from '@/features/contributions/schema';

let pass = 0;
let fail = 0;
function check(label: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? '✓' : '✗'} ${label}  got=${JSON.stringify(got)}${ok ? '' : ` want=${JSON.stringify(want)}`}`);
  ok ? pass++ : fail++;
}

const rule = DEFAULT_TARGET_RULE; // base ₾600, boost ₾900 every 6mo, anchor 2026-06
// Boost months: every 6th from June 2026, both directions.
check('June 2026 is boost', isBoostMonth('2026-06', rule), true);
check('Dec 2026 is boost', isBoostMonth('2026-12', rule), true);
check('July 2026 not boost', isBoostMonth('2026-07', rule), false);
check('Dec 2025 is boost (before anchor)', isBoostMonth('2025-12', rule), true);

// Target resolution (GEL minor units): boost month -> 90000, normal -> 60000.
check('target June 2026 = ₾900', resolveMonthlyTarget('2026-06', rule, []), 90_000);
check('target July 2026 = ₾600', resolveMonthlyTarget('2026-07', rule, []), 60_000);
check(
  'override wins',
  resolveMonthlyTarget('2026-07', rule, [
    { id: 'x', goalId: 'g', month: '2026-07', amount: 75_000, createdAt: '2026-06-18T00:00:00.000Z' },
  ]),
  75_000,
);

// Currency conversion with default rates (usdToGel 2.7, gelToUsd 0.37).
check('₾900 -> USD cents', convert(90_000, 'GEL', 'USD', DEFAULT_EXCHANGE_RATES), 33_300);
check('$600 -> GEL tetri', convert(60_000, 'USD', 'GEL', DEFAULT_EXCHANGE_RATES), 162_000);

// Formatting (no cents when whole, 2 dp otherwise).
check('format $600', formatMoney(60_000, 'USD'), '$600');
check('format ₾900.50', formatMoney(90_050, 'GEL'), '₾900.50');
check('parse "1,250.50" USD', parseMoney('1,250.50', 'USD'), 125_050);

// Goal math (USD base). Bike $3,500 + $200 fees = $3,700 required.
const goal = {
  id: 'g', name: 'R3', motorcycleModel: 'Yamaha R3', price: 350_000,
  registrationFees: 10_000, insuranceEstimate: 5_000, additionalFees: 5_000,
  notes: '', status: 'active', createdAt: '', updatedAt: '',
} as Goal;
const contribs: Contribution[] = [
  { id: 'c1', goalId: 'g', amount: 60_000, date: '2026-04-15T00:00:00.000Z', createdAt: '' },
  { id: 'c2', goalId: 'g', amount: 90_000, date: '2026-05-15T00:00:00.000Z', createdAt: '' },
];
check('totalRequired = $3,700', totalRequired(goal), 370_000);
check('totalSaved = $1,500', totalSaved(contribs), 150_000);
check('remaining = $2,200', remainingAmount(goal, contribs), 220_000);
check('progress ~40.5%', Math.round(progressPercent(goal, contribs) * 10) / 10, 40.5);
check('avg/month = $750', averageMonthlyContribution(contribs), 75_000);
check('months to goal @ $750', monthsToGoal(220_000, 75_000), 3);
check('ETA from 2026-06', estimatedCompletionMonth(220_000, 75_000, '2026-06'), '2026-09');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
