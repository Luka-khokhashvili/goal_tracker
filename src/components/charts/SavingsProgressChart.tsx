import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartPoint } from '@/features/dashboard/useGoalCharts';
import { axisProps, compact, gridStroke, makeTooltip } from './chartTheme';
import { ChartEmpty } from './ChartEmpty';

/** Cumulative savings growth over time, with the goal total as a reference line. */
export function SavingsProgressChart({
  data,
  target,
  symbol,
}: {
  data: ChartPoint[];
  target: number;
  symbol: string;
}) {
  if (data.length === 0) return <ChartEmpty />;
  const Tip = makeTooltip(symbol);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(var(--color-brand))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="rgb(var(--color-brand))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis width={48} tickFormatter={compact(symbol)} {...axisProps} />
        <Tooltip content={<Tip />} />
        {target > 0 && (
          <ReferenceLine
            y={target}
            stroke="rgb(var(--color-success))"
            strokeDasharray="4 4"
            label={{ value: 'Goal', fill: 'rgb(var(--color-success))', fontSize: 11, position: 'insideTopRight' }}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke="rgb(var(--color-brand))"
          strokeWidth={2}
          fill="url(#savingsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
