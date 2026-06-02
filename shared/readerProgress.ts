import type { HistoryCard } from "../types/index";

/** Estimated minutes left in a flagship guided journey. */
export function estimateReadingMinutesLeft(
  card: HistoryCard,
  currentStep: number,
  totalBlocks: number
): number {
  if (totalBlocks <= 0) return 0;
  const remainingSteps = Math.max(0, totalBlocks - currentStep - 1);
  if (remainingSteps === 0) return 0;
  const perStep = card.readingTimeMinutes / totalBlocks;
  return Math.max(1, Math.round(remainingSteps * perStep));
}
