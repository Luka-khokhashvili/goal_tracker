import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartPoint } from '@/features/dashboard/useGoalCharts';
import { axisProps, compact, gridStroke, makeTooltip } from './chartTheme';
import { ChartEmpty } from './ChartEmpty';

/** Projected savings from now until the goal is met, at the average saving rate. */
export function ForecastChart({
  data,
  target,
  symbol,
}: {
  data: ChartPoint[];
  target: number;
  symbol: string;
}) {
  if (data.length <= 1) {
    return <ChartEmpty message="Log a couple of contributions to project a finish date." />;
  }
  const Tip = makeTooltip(symbol);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
        <Line
          type="monotone"
          dataKey="value"
          stroke="rgb(var(--color-brand))"
          strokeWidth={2}
          strokeDasharray="5 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
