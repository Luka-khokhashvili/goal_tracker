import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input, MoneyInput } from '@/components/ui';
import { CONTRIBUTION_CURRENCY, CURRENCIES } from '@/constants/currency';
import { toMajor, toMinor } from '@/utils/money';
import type { Contribution, ContributionDraft } from './schema';

const formSchema = z.object({
  amount: z.coerce.number().positive('Enter an amount'),
  date: z.string().min(1, 'Pick a date'),
  note: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

/** "2026-06-18" for a date input's default value. */
function isoToDateInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

export function ContributionForm({
  contribution,
  onSubmit,
  onCancel,
}: {
  contribution?: Contribution;
  onSubmit: (draft: ContributionDraft) => void;
  onCancel?: () => void;
}) {
  // Contributions are entered and stored in GEL exactly — no conversion.
  const symbol = CURRENCIES[CONTRIBUTION_CURRENCY].symbol; // ₾

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: contribution ? toMajor(contribution.amount, CONTRIBUTION_CURRENCY) : 0,
      date: contribution ? isoToDateInput(contribution.date) : isoToDateInput(new Date().toISOString()),
      note: contribution?.note ?? '',
    },
  });

  const submit = handleSubmit((v) => {
    const draft: ContributionDraft = {
      amount: toMinor(v.amount, CONTRIBUTION_CURRENCY),
      // Anchor at local noon so the calendar day never shifts across timezones.
      date: new Date(`${v.date}T12:00:00`).toISOString(),
      ...(v.note.trim() ? { note: v.note.trim() } : {}),
    };
    onSubmit(draft);
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={`Amount (${CONTRIBUTION_CURRENCY})`} error={errors.amount?.message}>
          <MoneyInput symbol={symbol} {...register('amount')} />
        </Field>
        <Field label="Date" error={errors.date?.message}>
          <Input type="date" {...register('date')} />
        </Field>
      </div>
      <Field label="Note (optional)" htmlFor="note">
        <Input id="note" placeholder="e.g. reserve pay" {...register('note')} />
      </Field>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{contribution ? 'Save' : 'Add contribution'}</Button>
      </div>
    </form>
  );
}
