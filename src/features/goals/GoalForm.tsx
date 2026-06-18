import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Field, Input, MoneyInput, Textarea } from '@/components/ui';
import { CURRENCIES, BASE_CURRENCY } from '@/constants/currency';
import { convert, toMajor, toMinor } from '@/utils/money';
import { useMoney } from '@/hooks/useMoney';
import type { Goal, GoalDraft } from './schema';

// Form values are MAJOR units in the user's display currency. Converted to the
// USD base draft on submit. All-required keeps RHF/Zod typing friction-free;
// empty fee inputs coerce to 0.
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
  const { displayCurrency, rates } = useMoney();
  const symbol = CURRENCIES[displayCurrency].symbol;

  // Stored money is USD base -> show it in the display currency for editing.
  const fromBase = (baseMinor: number) =>
    toMajor(convert(baseMinor, BASE_CURRENCY, displayCurrency, rates), displayCurrency);

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
          price: fromBase(goal.price),
          registrationFees: fromBase(goal.registrationFees),
          insuranceEstimate: fromBase(goal.insuranceEstimate),
          additionalFees: fromBase(goal.additionalFees),
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

  // Display-currency major -> USD base minor.
  const toBase = (major: number) =>
    convert(toMinor(major, displayCurrency), displayCurrency, BASE_CURRENCY, rates);

  const submit = handleSubmit((v) => {
    onSubmit({
      name: v.name.trim(),
      motorcycleModel: v.motorcycleModel.trim(),
      price: toBase(v.price),
      registrationFees: toBase(v.registrationFees),
      insuranceEstimate: toBase(v.insuranceEstimate),
      additionalFees: toBase(v.additionalFees),
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
        <Field label="Price" error={errors.price?.message}>
          <MoneyInput symbol={symbol} {...register('price')} />
        </Field>
        <Field label="Registration fees" error={errors.registrationFees?.message}>
          <MoneyInput symbol={symbol} {...register('registrationFees')} />
        </Field>
        <Field label="Insurance estimate" error={errors.insuranceEstimate?.message}>
          <MoneyInput symbol={symbol} {...register('insuranceEstimate')} />
        </Field>
        <Field label="Additional fees (gear, license…)" error={errors.additionalFees?.message}>
          <MoneyInput symbol={symbol} {...register('additionalFees')} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes">
        <Textarea id="notes" placeholder="Anything to remember…" {...register('notes')} />
      </Field>

      <p className="text-xs text-muted">
        Amounts are entered in {displayCurrency} and stored consistently — toggle the
        currency anytime.
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
