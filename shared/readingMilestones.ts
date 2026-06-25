export type MilestoneId =
  | "first_read"
  | "reads_10"
  | "reads_25"
  | "streak_3"
  | "streak_7";

export type Milestone = {
  id: MilestoneId;
  icon: "sparkles" | "book" | "library" | "flame" | "trophy";
  threshold: number;
  kind: "reads" | "streak";
};

export const READING_MILESTONES: Milestone[] = [
  { id: "first_read", icon: "sparkles", threshold: 1, kind: "reads" },
  { id: "reads_10", icon: "book", threshold: 10, kind: "reads" },
  { id: "reads_25", icon: "library", threshold: 25, kind: "reads" },
  { id: "streak_3", icon: "flame", threshold: 3, kind: "streak" },
  { id: "streak_7", icon: "trophy", threshold: 7, kind: "streak" },
];

export function getUnlockedMilestones(readCount: number, readStreak: number): Milestone[] {
  return READING_MILESTONES.filter((m) =>
    m.kind === "reads" ? readCount >= m.threshold : readStreak >= m.threshold
  );
}

export function getNextMilestone(readCount: number, readStreak: number): Milestone | null {
  for (const m of READING_MILESTONES) {
    const value = m.kind === "reads" ? readCount : readStreak;
    if (value < m.threshold) return m;
  }
  return null;
}

/** Show milestone hint only when user is within `within` of the next threshold. */
export function isMilestoneClose(
  readCount: number,
  readStreak: number,
  milestone: Milestone,
  within = 2
): boolean {
  const value = milestone.kind === "reads" ? readCount : readStreak;
  return milestone.threshold - value <= within && value < milestone.threshold;
}
