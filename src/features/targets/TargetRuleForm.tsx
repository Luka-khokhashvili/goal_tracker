import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, MoneyInput } from '@/components/ui';
import { CURRENCIES, TARGET_CURRENCY } from '@/constants/currency';
import { convert, formatMoney, toMajor, toMinor } from '@/utils/money';
import { useExchange } from '@/features/exchange/useExchange';
import type { ExchangeRates } from '@/features/exchange/schema';
import type { TargetRule, TargetRuleDraft } from './schema';

const formSchema = z.object({
  baseAmount: z.coerce.number().positive('Enter an amount'),
  boostAmount: z.coerce.number().positive('Enter an amount'),
});
type FormValues = z.infer<typeof formSchema>;

/** GEL major -> USD string, the read-only conversion preview. */
function usdPreview(gelMajor: number, rates: ExchangeRates): string {
  const gelMinor = toMinor(gelMajor || 0, TARGET_CURRENCY);
  return formatMoney(convert(gelMinor, TARGET_CURRENCY, 'USD', rates), 'USD');
}

export function TargetRuleForm({
  rule,
  onSubmit,
  onCancel,
}: {
  rule: TargetRule;
  onSubmit: (draft: TargetRuleDraft) => void;
  onCancel?: () => void;
}) {
  const { rates } = useExchange();
  const gel = CURRENCIES[TARGET_CURRENCY].symbol; // ₾

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseAmount: toMajor(rule.baseAmount, TARGET_CURRENCY),
      boostAmount: toMajor(rule.boostAmount, TARGET_CURRENCY),
    },
  });

  const watchBase = watch('baseAmount');
  const watchBoost = watch('boostAmount');

  const submit = handleSubmit((v) => {
    onSubmit({
      baseAmount: toMinor(v.baseAmount, TARGET_CURRENCY),
      boostAmount: toMinor(v.boostAmount, TARGET_CURRENCY),
    });
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Monthly savings targets are set in <strong className="text-content">GEL</strong>{' '}
        (your real income currency). The dollar figure is just a preview from your saved
        exchange rate.
      </p>

      <Field
        label="Normal month target (GEL)"
        error={errors.baseAmount?.message}
        hint={`≈ ${usdPreview(Number(watchBase), rates)} at your current rate`}
      >
        <MoneyInput symbol={gel} {...register('baseAmount')} />
      </Field>

      <Field
        label="Reserve-pay month target (every 6th month, GEL)"
        error={errors.boostAmount?.message}
        hint={`≈ ${usdPreview(Number(watchBoost), rates)} at your current rate`}
      >
        <MoneyInput symbol={gel} {...register('boostAmount')} />
      </Field>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">Save targets</Button>
      </div>
    </form>
  );
}
