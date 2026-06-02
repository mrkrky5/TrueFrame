export type ReadStreakLabels = {
  readStreakOne: string;
  readStreakMany: string;
  readStreakToday: string;
  readStreakStart: string;
};

/** 1 day ≠ "üst üste"; 2+ uses consecutive-day phrasing. */
export function formatReadStreakLabel(
  streak: number,
  readToday: boolean,
  labels: ReadStreakLabels
): string {
  if (streak === 1) return labels.readStreakOne;
  if (streak >= 2) {
    return labels.readStreakMany.replace("{{count}}", String(streak));
  }
  if (readToday) return labels.readStreakToday;
  return labels.readStreakStart;
}
