import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, MoneyInput } from '@/components/ui';
import { CURRENCIES } from '@/constants/currency';
import { toMajor, toMinor } from '@/utils/money';

const formSchema = z.object({
  amount: z.coerce.number().nonnegative('Must be ≥ 0'),
});
type FormValues = z.infer<typeof formSchema>;

/** Edit the USD-held figure. Entered and stored in USD, exactly. */
export function HoldingsForm({
  usdHoldings,
  onSubmit,
  onCancel,
}: {
  usdHoldings: number;
  onSubmit: (usdMinor: number) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: toMajor(usdHoldings, 'USD') },
  });

  const submit = handleSubmit((v) => onSubmit(toMinor(v.amount, 'USD')));

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Of your total saved cash, how much do you currently hold as physical US dollars?
        This is just for your reference — it doesn’t change your savings total.
      </p>
      <Field label="Held in USD" error={errors.amount?.message}>
        <MoneyInput symbol={CURRENCIES.USD.symbol} {...register('amount')} />
      </Field>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
