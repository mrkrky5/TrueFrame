import type { AccuracyType } from "../types/index";

export type GuessVerdict = "correct" | "close" | "wrong";

/** Accuracy types ordered from most to least faithful to history. */
const SCALE: AccuracyType[] = [
  "real",
  "partly-real",
  "inspired-by-reality",
  "fictionalized",
  "fiction",
];

/**
 * Compare a player's accuracy guess against the card's real verdict.
 * Exact match → correct, one step away → close, further → wrong.
 */
export function scoreGuess(guess: AccuracyType, actual: AccuracyType): GuessVerdict {
  const gi = SCALE.indexOf(guess);
  const ai = SCALE.indexOf(actual);
  if (gi < 0 || ai < 0) return guess === actual ? "correct" : "wrong";
  const distance = Math.abs(gi - ai);
  if (distance === 0) return "correct";
  if (distance === 1) return "close";
  return "wrong";
}

export const XP_BY_VERDICT: Record<GuessVerdict, number> = {
  correct: 10,
  close: 5,
  wrong: 2,
};

export function xpForVerdict(verdict: GuessVerdict): number {
  return XP_BY_VERDICT[verdict];
}
