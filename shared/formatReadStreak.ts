export type ReadStreakLabels = {
  readStreakTodayOne: string;
  readStreakTodayMany: string;
  readStreakDaysSuffix: string;
  readStreakMany: string;
  readStreakToday: string;
  readStreakStart: string;
};

/**
 * Home pill: today's card count (not confused with consecutive-day streak).
 */
export function formatReadStreakLabel(
  streak: number,
  readToday: boolean,
  readsTodayCount: number,
  labels: ReadStreakLabels
): string {
  if (readsTodayCount > 0) {
    const base =
      readsTodayCount === 1
        ? labels.readStreakTodayOne
        : labels.readStreakTodayMany.replace("{{count}}", String(readsTodayCount));
    if (streak >= 2) {
      return `${base}${labels.readStreakDaysSuffix.replace("{{count}}", String(streak))}`;
    }
    return base;
  }
  if (streak >= 2) {
    return labels.readStreakMany.replace("{{count}}", String(streak));
  }
  if (readToday) return labels.readStreakToday;
  return labels.readStreakStart;
}

/** Cards marked with "learned" reflection. */
export function countLearnedReflections(reflections: Record<string, string[]>): number {
  return Object.values(reflections).filter((tags) => tags.includes("learned")).length;
}
