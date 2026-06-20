import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useMoney } from '@/hooks/useMoney';
import { CONTRIBUTION_CURRENCY } from '@/constants/currency';
import { formatDate } from '@/utils/date';
import type { Contribution } from './schema';

export function ContributionList({
  contributions,
  onEdit,
  onDelete,
}: {
  contributions: Contribution[];
  onEdit: (c: Contribution) => void;
  onDelete: (id: string) => void;
}) {
  const { formatRaw } = useMoney();

  if (contributions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
        No contributions yet. Add your first one to start tracking progress.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {contributions.map((c) => (
        <li key={c.id} className="flex items-center justify-between gap-3 py-3">
          <div>
            <p className="font-medium text-content">
              {formatRaw(c.amount, CONTRIBUTION_CURRENCY)}
            </p>
            <p className="text-xs text-muted">
              {formatDate(c.date)}
              {c.note ? ` · ${c.note}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={() => onEdit(c)} aria-label="Edit">
              <Pencil size={15} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(c.id)} aria-label="Delete">
              <Trash2 size={15} />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
