import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-20 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-sm text-content',
        'placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        className,
      )}
      {...props}
    />
  );
});
