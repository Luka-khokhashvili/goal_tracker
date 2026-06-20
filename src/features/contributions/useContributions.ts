import { useMemo } from 'react';
import { useStore } from '@/app/store/StoreContext';
import type { Contribution, ContributionDraft } from './schema';

/**
 * Contributions for the active goal. Drafts carry money in CONTRIBUTION_CURRENCY
 * minor units (GEL), stored exactly as entered — no conversion.
 */
export function useContributions() {
  const { state, dispatch } = useStore();
  const goalId = state.settings.activeGoalId;

  const contributions = useMemo(
    () =>
      state.contributions
        .filter((c) => c.goalId === goalId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [state.contributions, goalId],
  );

  function addContribution(draft: ContributionDraft): Contribution | null {
    if (!goalId) return null;
    const contribution: Contribution = {
      ...draft,
      id: crypto.randomUUID(),
      goalId,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_CONTRIBUTION', contribution });
    return contribution;
  }

  function updateContribution(id: string, draft: ContributionDraft): void {
    const existing = state.contributions.find((c) => c.id === id);
    if (!existing) return;
    dispatch({ type: 'UPDATE_CONTRIBUTION', contribution: { ...existing, ...draft } });
  }

  function deleteContribution(id: string): void {
    dispatch({ type: 'DELETE_CONTRIBUTION', id });
  }

  return { contributions, addContribution, updateContribution, deleteContribution };
}
