import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input } from '@/components/ui';
import type { ExchangeRates, ExchangeRatesDraft } from './schema';

const formSchema = z.object({
  usdToGel: z.coerce.number().positive('Must be greater than 0'),
  gelToUsd: z.coerce.number().positive('Must be greater than 0'),
});
type FormValues = z.infer<typeof formSchema>;

const round = (n: number) => Math.round(n * 10000) / 10000;

export function ExchangeRateForm({
  rates,
  onSubmit,
}: {
  rates: ExchangeRates;
  onSubmit: (draft: ExchangeRatesDraft) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { usdToGel: rates.usdToGel, gelToUsd: rates.gelToUsd },
  });

  const usd = register('usdToGel');
  const gel = register('gelToUsd');

  const submit = handleSubmit((v) => onSubmit({ usdToGel: v.usdToGel, gelToUsd: v.gelToUsd }));

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field
        label="1 USD = ? GEL"
        error={errors.usdToGel?.message}
        hint="Editing this auto-fills the reverse rate — adjust it if you prefer."
      >
        <Input
          type="number"
          step="0.0001"
          {...usd}
          onChange={(e) => {
            void usd.onChange(e);
            const n = Number(e.target.value);
            if (Number.isFinite(n) && n > 0) {
              setValue('gelToUsd', round(1 / n), { shouldDirty: true });
            }
          }}
        />
      </Field>

      <Field label="1 GEL = ? USD" error={errors.gelToUsd?.message}>
        <Input
          type="number"
          step="0.0001"
          {...gel}
          onChange={(e) => {
            void gel.onChange(e);
            const n = Number(e.target.value);
            if (Number.isFinite(n) && n > 0) {
              setValue('usdToGel', round(1 / n), { shouldDirty: true });
            }
          }}
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty}>
          Save rates
        </Button>
      </div>
    </form>
  );
}
