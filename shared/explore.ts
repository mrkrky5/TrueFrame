import type { AccuracyType, HistoryCard, MediaType } from "../types/index";
import { cardMatchesMoodTag } from "./moodTags";

export interface ExploreFilters {
  query: string;
  media: MediaType | "all";
  accuracy: AccuracyType | "all";
  tag: string | null;
  onlyFlagships: boolean;
  spoilerFree?: boolean;
}

export function filterCards(cards: HistoryCard[], filters: ExploreFilters): HistoryCard[] {
  const q = filters.query.trim().toLowerCase();

  return cards.filter((card) => {
    if (filters.media !== "all" && card.mediaType !== filters.media) return false;
    if (filters.accuracy !== "all" && card.accuracyType !== filters.accuracy) return false;
    if (filters.onlyFlagships && !card.isFlagship) return false;
    if (filters.spoilerFree && (card.spoilerLevel === "major" || card.spoilerLevel === "minor")) {
      return false;
    }
    if (filters.tag && !cardMatchesMoodTag(card, filters.tag)) {
      return false;
    }
    if (!q) return true;

    const haystack = [
      card.title,
      card.subtitle,
      card.mediaTitle,
      card.whatWeSee,
      card.realHistory,
      card.quickRealityCheck,
      ...(card.tags ?? []),
      ...(card.themes ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function countUnreadCards(cards: HistoryCard[], readIds: string[]): number {
  return cards.filter((c) => !readIds.includes(c.id)).length;
}

export function getCardPreviewLine(card: HistoryCard): string {
  return (card.quickRealityCheck || card.subtitle || card.whatWeSee || "").trim();
}

export function getPopularTags(cards: HistoryCard[], limit = 12): string[] {
  const counts = new Map<string, number>();
  for (const card of cards) {
    for (const tag of card.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}
