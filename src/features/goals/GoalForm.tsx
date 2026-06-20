import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input, MoneyInput, Textarea } from '@/components/ui';
import { CURRENCIES, FEE_CURRENCY, GOAL_CURRENCY } from '@/constants/currency';
import { toMajor, toMinor } from '@/utils/money';
import type { Goal, GoalDraft } from './schema';

// The bike PRICE is entered in USD; all FEES (registration, insurance, gear,
// license, preps) are entered in GEL. Each is stored exactly in its own
// currency — no conversion, so values never drift. All-required keeps RHF/Zod
// typing friction-free; empty inputs coerce to 0.
const formSchema = z.object({
  name: z.string().min(1, 'Give the goal a name'),
  motorcycleModel: z.string(),
  price: z.coerce.number().nonnegative('Must be ≥ 0'),
  registrationFees: z.coerce.number().nonnegative('Must be ≥ 0'),
  insuranceEstimate: z.coerce.number().nonnegative('Must be ≥ 0'),
  additionalFees: z.coerce.number().nonnegative('Must be ≥ 0'),
  notes: z.string(),
});
type FormValues = z.infer<typeof formSchema>;

export function GoalForm({
  goal,
  onSubmit,
  onCancel,
}: {
  goal?: Goal;
  onSubmit: (draft: GoalDraft) => void;
  onCancel?: () => void;
}) {
  const usdSymbol = CURRENCIES[GOAL_CURRENCY].symbol; // $
  const gelSymbol = CURRENCIES[FEE_CURRENCY].symbol; // ₾

  // Stored exactly in each native currency -> show major units for editing.
  const fromUsd = (usdMinor: number) => toMajor(usdMinor, GOAL_CURRENCY);
  const fromGel = (gelMinor: number) => toMajor(gelMinor, FEE_CURRENCY);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: goal
      ? {
          name: goal.name,
          motorcycleModel: goal.motorcycleModel,
          price: fromUsd(goal.price),
          registrationFees: fromGel(goal.registrationFees),
          insuranceEstimate: fromGel(goal.insuranceEstimate),
          additionalFees: fromGel(goal.additionalFees),
          notes: goal.notes,
        }
      : {
          name: '',
          motorcycleModel: '',
          price: 0,
          registrationFees: 0,
          insuranceEstimate: 0,
          additionalFees: 0,
          notes: '',
        },
  });

  // Major -> minor in each native currency (stored exactly).
  const toUsd = (major: number) => toMinor(major, GOAL_CURRENCY);
  const toGel = (major: number) => toMinor(major, FEE_CURRENCY);

  const submit = handleSubmit((v) => {
    onSubmit({
      name: v.name.trim(),
      motorcycleModel: v.motorcycleModel.trim(),
      price: toUsd(v.price),
      registrationFees: toGel(v.registrationFees),
      insuranceEstimate: toGel(v.insuranceEstimate),
      additionalFees: toGel(v.additionalFees),
      notes: v.notes.trim(),
    });
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Goal name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder="My first motorcycle" {...register('name')} />
      </Field>

      <Field label="Motorcycle model" htmlFor="model">
        <Input id="model" placeholder="Yamaha R3 (2018–2024, ABS)" {...register('motorcycleModel')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Bike price (USD)" error={errors.price?.message}>
          <MoneyInput symbol={usdSymbol} {...register('price')} />
        </Field>
        <Field label="Registration fees (GEL)" error={errors.registrationFees?.message}>
          <MoneyInput symbol={gelSymbol} {...register('registrationFees')} />
        </Field>
        <Field label="Insurance estimate (GEL)" error={errors.insuranceEstimate?.message}>
          <MoneyInput symbol={gelSymbol} {...register('insuranceEstimate')} />
        </Field>
        <Field label="Gear, license, preps (GEL)" error={errors.additionalFees?.message}>
          <MoneyInput symbol={gelSymbol} {...register('additionalFees')} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" placeholder="Anything to remember…" {...register('notes')} />
      </Field>

      <p className="text-xs text-muted">
        Only the <strong className="text-content">bike price</strong> is in USD. All
        fees (registration, insurance, gear, license, preps) are in{' '}
        <strong className="text-content">GEL</strong>. Each is stored exactly.
      </p>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{goal ? 'Save changes' : 'Create goal'}</Button>
      </div>
    </form>
  );
}
