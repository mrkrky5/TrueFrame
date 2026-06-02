import type { HistoryCard } from "../types/index";

export type ReadSortGroup = "inProgress" | "unread" | "read";

const GROUP_ORDER: Record<ReadSortGroup, number> = {
  inProgress: 0,
  unread: 1,
  read: 2,
};

export function getReadSortGroup(
  cardId: string,
  readIds: string[],
  inProgressIds?: Set<string>
): ReadSortGroup {
  if (readIds.includes(cardId)) return "read";
  if (inProgressIds?.has(cardId)) return "inProgress";
  return "unread";
}

/** Unread and in-progress first; read cards sink to the bottom (stable within each group). */
export function sortCardsByReadState<T extends Pick<HistoryCard, "id">>(
  cards: T[],
  readIds: string[],
  inProgressIds?: Set<string>
): T[] {
  const indexed = cards.map((card, index) => ({ card, index }));
  indexed.sort((a, b) => {
    const ga = GROUP_ORDER[getReadSortGroup(a.card.id, readIds, inProgressIds)];
    const gb = GROUP_ORDER[getReadSortGroup(b.card.id, readIds, inProgressIds)];
    if (ga !== gb) return ga - gb;
    return a.index - b.index;
  });
  return indexed.map((x) => x.card);
}

export function isCardRead(cardId: string, readIds: string[]): boolean {
  return readIds.includes(cardId);
}
