import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartPoint } from '@/features/dashboard/useGoalCharts';
import { axisProps, compact, gridStroke, makeTooltip } from './chartTheme';
import { ChartEmpty } from './ChartEmpty';

/** Per-month contribution amounts. */
export function MonthlyContributionsChart({
  data,
  symbol,
}: {
  data: ChartPoint[];
  symbol: string;
}) {
  if (data.length === 0) return <ChartEmpty />;
  const Tip = makeTooltip(symbol);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis width={48} tickFormatter={compact(symbol)} {...axisProps} />
        <Tooltip content={<Tip />} cursor={{ fill: 'rgb(var(--color-surface-2))' }} />
        <Bar dataKey="value" fill="rgb(var(--color-brand))" radius={[6, 6, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  );
}
