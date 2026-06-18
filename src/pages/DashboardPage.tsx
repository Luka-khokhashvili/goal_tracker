import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Modal,
  ProgressBar,
  Stat,
} from "@/components/ui";
import { useStore } from "@/app/store/StoreContext";
import { useGoals } from "@/features/goals/useGoals";
import { GoalForm } from "@/features/goals/GoalForm";
import { useContributions } from "@/features/contributions/useContributions";
import { ContributionForm } from "@/features/contributions/ContributionForm";
import { ContributionList } from "@/features/contributions/ContributionList";
import { useTargets } from "@/features/targets/useTargets";
import { TargetRuleForm } from "@/features/targets/TargetRuleForm";
import { useExchange } from "@/features/exchange/useExchange";
import { ExchangeRateForm } from "@/features/exchange/ExchangeRateForm";
import { useMoney } from "@/hooks/useMoney";
import { TARGET_CURRENCY } from "@/constants/currency";
import {
  contributionsByMonth,
  progressPercent,
  remainingAmount,
  totalRequired,
  totalSaved,
} from "@/domain/calculations";
import { currentMonthKey, formatMonthKey } from "@/utils/date";
import type { Contribution } from "@/features/contributions/schema";

export function DashboardPage() {
  const { status } = useStore();
  const { activeGoal, addGoal } = useGoals();

  if (status === "loading") {
    return <p className="py-20 text-center text-muted">Loading…</p>;
  }

  if (!activeGoal) {
    return <EmptyState onCreate={addGoal} />;
  }
  return <ActiveDashboard />;
}

function EmptyState({
  onCreate,
}: {
  onCreate: ReturnType<typeof useGoals>["addGoal"];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="mx-auto max-w-md text-center">
      <h2 className="text-lg font-semibold text-content">
        Start your savings goal
      </h2>
      <p className="mt-1 text-sm text-muted">
        Add the motorcycle you’re saving for and we’ll track every step to the
        finish line.
      </p>
      <Button className="mx-auto mt-4" onClick={() => setOpen(true)}>
        <Plus size={16} /> Create goal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="New goal">
        <GoalForm
          onSubmit={(draft) => {
            onCreate(draft);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </Card>
  );
}

function ActiveDashboard() {
  const { activeGoal, updateGoal } = useGoals();
  const {
    contributions,
    addContribution,
    updateContribution,
    deleteContribution,
  } = useContributions();
  const { rule, updateRule, targetForMonth, targetSource } = useTargets();
  const { rates, updateRates } = useExchange();
  const { format, formatFrom } = useMoney();

  const [editGoal, setEditGoal] = useState(false);
  const [editRule, setEditRule] = useState(false);
  const [contribModal, setContribModal] = useState<{
    open: boolean;
    editing?: Contribution;
  }>({
    open: false,
  });

  const goal = activeGoal!;
  const required = totalRequired(goal);
  const saved = totalSaved(contributions);
  const remaining = remainingAmount(goal, contributions);
  const percent = progressPercent(goal, contributions);

  const month = currentMonthKey();
  const targetGel = targetForMonth(month);
  const savedThisMonth = contributionsByMonth(contributions).get(month) ?? 0;
  const goalReached = targetGel === savedThisMonth ? true : false;
  const source = targetSource(month);

  return (
    <div className="flex flex-col gap-6">
      {/* Goal header + progress */}
      <Card>
        <CardHeader
          title={goal.name}
          subtitle={goal.motorcycleModel || "Motorcycle savings goal"}
          action={
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setEditGoal(true)}
            >
              <Pencil size={15} /> Edit
            </Button>
          }
        />
        <div className="flex items-end justify-between">
          <p className="text-sm text-muted">
            {format(saved)} of {format(required)}
          </p>
          <p className="text-sm font-semibold text-content">
            {Math.round(percent)}%
          </p>
        </div>
        <ProgressBar className="mt-2" value={percent} />
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total required" value={format(required)} />
        <Stat label="Saved so far" value={format(saved)} />
        <Stat label="Remaining" value={format(remaining)} />
        <Stat
          label={`This month (${formatMonthKey(month)})`}
          value={formatFrom(targetGel, TARGET_CURRENCY)}
          hint={
            <span className="flex items-center gap-1.5">
              {format(savedThisMonth)} saved
              <Badge tone={goalReached ? "success" : "neutral"}>
                {goalReached ? "Goal reached" : "In progress"}
              </Badge>
            </span>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contributions */}
        <Card>
          <CardHeader
            title="Contributions"
            subtitle={`${contributions.length} logged`}
            action={
              <Button size="sm" onClick={() => setContribModal({ open: true })}>
                <Plus size={15} /> Add
              </Button>
            }
          />
          <ContributionList
            contributions={contributions}
            onEdit={(c) => setContribModal({ open: true, editing: c })}
            onDelete={deleteContribution}
          />
        </Card>

        {/* Targets + Exchange */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader
              title="Monthly targets"
              subtitle="Set in GEL"
              action={
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => setEditRule(true)}
                >
                  <Pencil size={15} /> Edit
                </Button>
              }
            />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Normal month</dt>
                <dd className="text-content">
                  {formatFrom(rule.baseAmount, TARGET_CURRENCY)}
                  <span className="ml-1 text-muted">/ mo</span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Reserve-pay month (every 6th)</dt>
                <dd className="text-content">
                  {formatFrom(rule.boostAmount, TARGET_CURRENCY)}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader
              title="Exchange rates"
              subtitle="USD ⇄ GEL — used everywhere"
            />
            <ExchangeRateForm rates={rates} onSubmit={updateRates} />
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={editGoal}
        onClose={() => setEditGoal(false)}
        title="Edit goal"
      >
        <GoalForm
          goal={goal}
          onSubmit={(draft) => {
            updateGoal(goal.id, draft);
            setEditGoal(false);
          }}
          onCancel={() => setEditGoal(false)}
        />
      </Modal>

      <Modal
        open={editRule}
        onClose={() => setEditRule(false)}
        title="Edit monthly targets"
      >
        <TargetRuleForm
          rule={rule}
          onSubmit={(draft) => {
            updateRule(draft);
            setEditRule(false);
          }}
          onCancel={() => setEditRule(false)}
        />
      </Modal>

      <Modal
        open={contribModal.open}
        onClose={() => setContribModal({ open: false })}
        title={contribModal.editing ? "Edit contribution" : "Add contribution"}
      >
        <ContributionForm
          {...(contribModal.editing
            ? { contribution: contribModal.editing }
            : {})}
          onSubmit={(draft) => {
            if (contribModal.editing)
              updateContribution(contribModal.editing.id, draft);
            else addContribution(draft);
            setContribModal({ open: false });
          }}
          onCancel={() => setContribModal({ open: false })}
        />
      </Modal>
    </div>
  );
}
