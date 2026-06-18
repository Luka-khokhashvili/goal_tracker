import { useMemo } from 'react';
import { useStore } from '@/app/store/StoreContext';
import { resolveMonthlyTarget, resolveMonthlyTargetSource } from '@/domain/targets';
import type { MonthKey, MonthlyTarget, TargetRuleDraft } from './schema';

/**
 * The savings-target rule and per-month overrides. All amounts here are in GEL
 * minor units (tetri) — targets are GEL-native and edited in GEL only.
 */
export function useTargets() {
  const { state, dispatch } = useStore();
  const goalId = state.settings.activeGoalId;

  const overrides = useMemo(
    () => state.monthlyTargets.filter((t) => t.goalId === goalId),
    [state.monthlyTargets, goalId],
  );

  /** Update just the GEL amounts of the rule; interval/anchor are preserved. */
  function updateRule(draft: TargetRuleDraft): void {
    dispatch({
      type: 'UPDATE_TARGET_RULE',
      rule: { ...state.targetRule, ...draft },
    });
  }

  /** Set (or replace) the GEL override for a specific month. */
  function setMonthlyTarget(month: MonthKey, amountGel: number, note?: string): void {
    if (!goalId) return;
    const target: MonthlyTarget = {
      id: crypto.randomUUID(),
      goalId,
      month,
      amount: amountGel,
      ...(note ? { note } : {}),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPSERT_MONTHLY_TARGET', target });
  }

  function deleteMonthlyTarget(id: string): void {
    dispatch({ type: 'DELETE_MONTHLY_TARGET', id });
  }

  /** Effective GEL target for a month, applying overrides then the rule. */
  function targetForMonth(month: MonthKey): number {
    return resolveMonthlyTarget(month, state.targetRule, overrides);
  }

  function targetSource(month: MonthKey) {
    return resolveMonthlyTargetSource(month, state.targetRule, overrides);
  }

  return {
    rule: state.targetRule,
    overrides,
    updateRule,
    setMonthlyTarget,
    deleteMonthlyTarget,
    targetForMonth,
    targetSource,
  };
}
