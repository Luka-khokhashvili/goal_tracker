import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const base =
  'h-10 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm text-content ' +
  'placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(base, className)} {...props} />;
  },
);

/** Input with a leading currency symbol (e.g. "$" / "₾"). */
export const MoneyInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { symbol: string }
>(function MoneyInput({ className, symbol, ...props }, ref) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
        {symbol}
      </span>
      <input
        ref={ref}
        inputMode="decimal"
        className={cn(base, 'pl-7', className)}
        {...props}
      />
    </div>
  );
});
