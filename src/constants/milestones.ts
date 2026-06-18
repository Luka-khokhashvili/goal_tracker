/** The percentage checkpoints the app celebrates on the way to a goal. */
export const MILESTONE_THRESHOLDS = [25, 50, 75, 100] as const;

export type MilestoneThreshold = (typeof MILESTONE_THRESHOLDS)[number];
