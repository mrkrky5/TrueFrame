/** Local calendar date YYYY-MM-DD */
export function formatReadDay(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addReadDay(days: string[], day = formatReadDay()): string[] {
  if (days.includes(day)) return days;
  return [...days, day].sort();
}

/** Consecutive calendar days with at least one read, ending today or yesterday. */
export function computeReadStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const cursor = new Date();
  const today = formatReadDay(cursor);

  if (!set.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(formatReadDay(cursor))) return 0;
  }

  let streak = 0;
  while (set.has(formatReadDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
