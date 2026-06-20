/** Placeholder shown when a chart has no data yet. */
export function ChartEmpty({ message = 'No data yet — add a contribution to see this chart.' }) {
  return (
    <div className="grid h-[240px] place-items-center rounded-xl border border-dashed border-border text-sm text-muted">
      {message}
    </div>
  );
}
