import type { TooltipProps } from 'recharts';

/** Theme-aware axis styling shared by all charts (reads CSS variables). */
export const axisProps = {
  tick: { fill: 'rgb(var(--color-muted))', fontSize: 11 },
  axisLine: { stroke: 'rgb(var(--color-border))' },
  tickLine: { stroke: 'rgb(var(--color-border))' },
} as const;

export const gridStroke = 'rgb(var(--color-border))';

/** Compact axis tick: 1234 -> "1.2k". */
export function compact(symbol: string) {
  return (n: number) => {
    if (Math.abs(n) >= 1000) return `${symbol}${(n / 1000).toFixed(1)}k`;
    return `${symbol}${n}`;
  };
}

/** Tooltip that matches the app surface and shows the symbol-prefixed value. */
export function makeTooltip(symbol: string) {
  return function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null;
    const value = payload[0]?.value ?? 0;
    return (
      <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
        <p className="font-medium text-content">{label}</p>
        <p className="text-muted">
          {symbol}
          {Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })}
        </p>
      </div>
    );
  };
}
