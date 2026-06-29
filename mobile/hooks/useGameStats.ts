import { useMemo } from "react";

import { useCards } from "@/context/ContentContext";
import { useHistory } from "@/context/HistoryContext";
import { useLearning } from "@/context/LearningContext";
import { computeGameStats, type GameStats } from "@shared/gamification";

/** Live gamification stats (XP, level, accuracy) derived from saved data. */
export function useGameStats(): GameStats {
  const { guesses } = useLearning();
  const { readIds } = useHistory();
  const cards = useCards();

  const cardsById = useMemo(() => {
    const map = new Map<string, (typeof cards)[number]>();
    for (const c of cards) map.set(c.id, c);
    return map;
  }, [cards]);

  return useMemo(
    () => computeGameStats({ guesses, cardsById, readIds }),
    [guesses, cardsById, readIds]
  );
}
