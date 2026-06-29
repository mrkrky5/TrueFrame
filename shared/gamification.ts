import type { AccuracyType, HistoryCard } from "../types/index";
import { scoreGuess, xpForVerdict } from "./accuracyScore";

export const XP_PER_READ = 5;
export const XP_PER_LEVEL = 100;

export type GameStats = {
  xp: number;
  level: number;
  /** XP accumulated within the current level (0..XP_PER_LEVEL). */
  xpInLevel: number;
  xpForNextLevel: number;
  readCount: number;
  guessCount: number;
  correctCount: number;
  closeCount: number;
  /** Share of exact-correct guesses, 0..100. */
  accuracyPct: number;
};

/**
 * Derive all gamification stats from data the app already persists
 * (accuracy guesses + read history). No extra storage needed.
 */
export function computeGameStats(opts: {
  guesses: Record<string, AccuracyType>;
  cardsById: Map<string, HistoryCard>;
  readIds: string[];
}): GameStats {
  let guessXp = 0;
  let guessCount = 0;
  let correctCount = 0;
  let closeCount = 0;

  for (const [id, guess] of Object.entries(opts.guesses)) {
    const actual = opts.cardsById.get(id)?.accuracyType;
    if (!actual) continue;
    guessCount += 1;
    const verdict = scoreGuess(guess, actual);
    if (verdict === "correct") correctCount += 1;
    else if (verdict === "close") closeCount += 1;
    guessXp += xpForVerdict(verdict);
  }

  const readCount = opts.readIds.length;
  const xp = guessXp + readCount * XP_PER_READ;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const accuracyPct = guessCount > 0 ? Math.round((correctCount / guessCount) * 100) : 0;

  return {
    xp,
    level,
    xpInLevel,
    xpForNextLevel: XP_PER_LEVEL,
    readCount,
    guessCount,
    correctCount,
    closeCount,
    accuracyPct,
  };
}

/** Pick a level title from a localized list, capping at the final title. */
export function levelTitle(level: number, titles: string[]): string {
  if (!titles || titles.length === 0) return String(level);
  return titles[Math.min(Math.max(level - 1, 0), titles.length - 1)];
}
