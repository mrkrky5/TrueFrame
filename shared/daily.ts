import type { HistoryCard } from "../types/index";

/** Strong first-impression cards — daily rotation prefers these over tf26 batch. */
const CURATED_DAILY_IDS = [
  "ac-origins-siwa",
  "ac-odyssey-athens",
  "ghost-tsushima-invasion",
  "kcd-bohemia",
  "rdr2-frontier",
  "chernobyl-disaster",
] as const;

export function getDailyCard(cards: HistoryCard[]): HistoryCard {
  const today = new Date();
  const dateSeed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const curated = CURATED_DAILY_IDS.map((id) => cards.find((c) => c.id === id)).filter(
    Boolean
  ) as HistoryCard[];

  const fallback = cards.filter((c) => c.isFlagship || c.quickRealityCheck);
  const pool = curated.length > 0 ? curated : fallback.length > 0 ? fallback : cards;
  if (pool.length === 0) return cards[0];

  const sorted = [...pool].sort((a, b) => a.id.localeCompare(b.id));
  return sorted[dateSeed % sorted.length];
}
