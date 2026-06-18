import { cn } from '@/utils/cn';

/** Horizontal progress bar. `value` is a 0..100 percentage (clamped). */
export function ProgressBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const done = pct >= 100;
  return (
    <div
      className={cn('h-2.5 w-full overflow-hidden rounded-full bg-surface-2', className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500',
          done ? 'bg-success' : 'bg-brand',
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
