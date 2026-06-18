import { useMemo } from 'react';
import { useStore } from '@/app/store/StoreContext';
import type { Goal, GoalDraft } from './schema';

/** Read + mutate goals. Drafts carry money in BASE_CURRENCY minor units (USD). */
export function useGoals() {
  const { state, dispatch } = useStore();

  const activeGoal = useMemo(
    () => state.goals.find((g) => g.id === state.settings.activeGoalId) ?? null,
    [state.goals, state.settings.activeGoalId],
  );

  const activeGoals = useMemo(
    () => state.goals.filter((g) => g.status === 'active'),
    [state.goals],
  );

  function addGoal(draft: GoalDraft): Goal {
    const now = new Date().toISOString();
    const goal: Goal = {
      ...draft,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'ADD_GOAL', goal });
    return goal;
  }

  function updateGoal(id: string, draft: GoalDraft): void {
    const existing = state.goals.find((g) => g.id === id);
    if (!existing) return;
    dispatch({
      type: 'UPDATE_GOAL',
      goal: { ...existing, ...draft, updatedAt: new Date().toISOString() },
    });
  }

  function archiveGoal(id: string): void {
    dispatch({ type: 'ARCHIVE_GOAL', id, updatedAt: new Date().toISOString() });
  }

  function deleteGoal(id: string): void {
    dispatch({ type: 'DELETE_GOAL', id });
  }

  function setActiveGoal(id: string | null): void {
    dispatch({ type: 'SET_ACTIVE_GOAL', id });
  }

  return {
    goals: state.goals,
    activeGoals,
    activeGoal,
    addGoal,
    updateGoal,
    archiveGoal,
    deleteGoal,
    setActiveGoal,
  };
}
