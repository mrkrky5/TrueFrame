import type { HistoryCard } from "../types/index";

export function getDailyCard(cards: HistoryCard[]): HistoryCard {
  const today = new Date();
  const dateSeed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const candidates = cards.filter((c) => c.isFlagship || c.quickRealityCheck);
  if (candidates.length === 0) return cards[0];

  const sorted = [...candidates].sort((a, b) => a.id.localeCompare(b.id));
  return sorted[dateSeed % sorted.length];
}
