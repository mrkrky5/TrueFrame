export const DAILY_GOAL_OPTIONS = [1, 2, 3] as const;
export type DailyGoalCards = (typeof DAILY_GOAL_OPTIONS)[number];

export const DEFAULT_DAILY_GOAL: DailyGoalCards = 1;

export function normalizeDailyGoal(value: number | null | undefined): DailyGoalCards {
  if (value === 2 || value === 3) return value;
  return DEFAULT_DAILY_GOAL;
}

export function dailyGoalProgress(readsToday: number, goal: DailyGoalCards) {
  const done = Math.min(readsToday, goal);
  const pct = goal > 0 ? Math.round((done / goal) * 100) : 0;
  const met = readsToday >= goal;
  return { done, goal, pct, met };
}
