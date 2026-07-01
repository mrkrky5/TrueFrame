import type { HistoryCard } from "../types/index";
import { getDailyCard } from "./daily";

/** Öne çıkan giriş kartları (locale’de yoksa günlük kart + flagship ile tamamlanır). */
export const START_HERE_CARD_IDS = [
  "oppenheimer-trinity",
  "shogun-edo",
  "ghost-tsushima-invasion",
  "gladiator-colosseum",
  "vikings-raid",
  "chernobyl-disaster",
  "ac-origins-siwa",
  "ryan-higgins-boats",
] as const;

/** Hand-picked entry cards for Explore “Start here”. */
export function getStartHereCards(cards: HistoryCard[], limit = 6): HistoryCard[] {
  if (cards.length === 0) return [];
  const byId = new Map(cards.map((c) => [c.id, c]));
  const daily = getDailyCard(cards);
  const out: HistoryCard[] = [];
  const seen = new Set<string>();

  const push = (c: HistoryCard | undefined) => {
    if (!c || seen.has(c.id)) return;
    seen.add(c.id);
    out.push(c);
  };

  push(daily);
  for (const id of START_HERE_CARD_IDS) {
    if (out.length >= limit) break;
    push(byId.get(id));
  }

  if (out.length < limit) {
    for (const c of cards.filter((x) => x.isFlagship)) {
      if (out.length >= limit) break;
      push(c);
    }
  }

  if (out.length < limit) {
    for (const c of cards) {
      if (out.length >= limit) break;
      push(c);
    }
  }

  return out.slice(0, limit);
}

export const EXPLORE_CATALOG_PREVIEW = 24;
export const EXPLORE_CATALOG_PAGE_SIZE = 50;

export type ExploreSearchSuggestion = {
  label: string;
  query?: string;
  tag?: string;
};

/** Chips shown when explore search/filter returns zero results. */
export function getExploreSearchSuggestions(locale: string): ExploreSearchSuggestion[] {
  if (locale === "tr") {
    return [
      { label: "Viking", query: "viking" },
      { label: "Mit", tag: "mitoloji" },
      { label: "Savaş", tag: "savas" },
    ];
  }
  return [
    { label: "Viking", query: "viking" },
    { label: "Myth", tag: "myth" },
    { label: "War", tag: "war" },
  ];
}
