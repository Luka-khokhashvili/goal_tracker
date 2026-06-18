import type { MonthKey } from '@/features/targets/schema';

/**
 * Date helpers centered on the "month key" ("YYYY-MM"), the unit savings
 * targets and monthly rollups are keyed by. All month math is done on the key
 * so we never trip over timezones or day-of-month edge cases.
 */

/** Date (or ISO string) -> "YYYY-MM". */
export function toMonthKey(date: Date | string): MonthKey {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}` as MonthKey;
}

/** The current month as a key. */
export function currentMonthKey(now: Date = new Date()): MonthKey {
  return toMonthKey(now);
}

function parseKey(key: MonthKey): { year: number; month: number } {
  const [y, m] = key.split('-');
  return { year: Number(y), month: Number(m) };
}

/** Whole-month distance b - a (can be negative). */
export function monthsBetween(a: MonthKey, b: MonthKey): number {
  const pa = parseKey(a);
  const pb = parseKey(b);
  return (pb.year - pa.year) * 12 + (pb.month - pa.month);
}

/** Add n months to a month key (n may be negative). */
export function addMonths(key: MonthKey, n: number): MonthKey {
  const { year, month } = parseKey(key);
  const zeroBased = year * 12 + (month - 1) + n;
  const newYear = Math.floor(zeroBased / 12);
  const newMonth = (zeroBased % 12) + 1;
  return `${newYear}-${String(newMonth).padStart(2, '0')}` as MonthKey;
}

/** "2026-06" -> "June 2026". */
export function formatMonthKey(key: MonthKey): string {
  const { year, month } = parseKey(key);
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/** ISO datetime -> "Jun 18, 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
