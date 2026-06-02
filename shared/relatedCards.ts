import type { HistoryCard } from "../types/index";

const MIN_RELATED_SCORE = 6;

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/** True when two cards likely repeat the same takeaway (not just the same topic). */
export function isLikelyDuplicateContent(a: HistoryCard, b: HistoryCard): boolean {
  if (a.id === b.id) return true;

  if (a.quickRealityCheck && b.quickRealityCheck) {
    const qa = normalizeText(a.quickRealityCheck);
    const qb = normalizeText(b.quickRealityCheck);
    if (qa === qb) return true;
    if (qa.length > 48 && qb.length > 48) {
      const sliceA = qa.slice(0, 72);
      const sliceB = qb.slice(0, 72);
      if (qa.includes(sliceB) || qb.includes(sliceA)) return true;
    }
  }

  if (normalizeText(a.title) === normalizeText(b.title)) return true;

  return false;
}

function scoreRelated(source: HistoryCard, candidate: HistoryCard): number {
  if (source.id === candidate.id) return -1;

  let score = 0;

  if (source.relatedCardIds?.includes(candidate.id)) score += 12;
  if (candidate.relatedCardIds?.includes(source.id)) score += 8;

  const sourceTags = new Set([...(source.tags ?? []), ...(source.themes ?? [])]);
  let sharedTags = 0;
  for (const tag of [...(candidate.tags ?? []), ...(candidate.themes ?? [])]) {
    if (sourceTags.has(tag)) sharedTags += 1;
  }
  score += sharedTags * 4;

  if (source.era && candidate.era && source.era === candidate.era) score += 2;
  if (source.region && candidate.region && source.region === candidate.region) score += 1;

  // Prefer a different media angle on the same topic.
  if (source.mediaTitle !== candidate.mediaTitle) score += 2;
  else score -= 2;

  return score;
}

/**
 * Topic-related cards: explicit links + shared tags/themes, minus duplicate content.
 */
export function getSmartRelatedCards(
  card: HistoryCard,
  allCards: HistoryCard[],
  readIds: string[] = [],
  limit = 3
): HistoryCard[] {
  const ranked = allCards
    .filter((c) => c.id !== card.id)
    .map((candidate) => ({ card: candidate, score: scoreRelated(card, candidate) }))
    .filter(({ score }) => score >= MIN_RELATED_SCORE)
    .filter(({ card: candidate }) => !isLikelyDuplicateContent(card, candidate))
    .sort((a, b) => b.score - a.score);

  const picked: HistoryCard[] = [];
  for (const entry of ranked) {
    if (picked.some((existing) => isLikelyDuplicateContent(existing, entry.card))) continue;
    picked.push(entry.card);
    if (picked.length >= limit) break;
  }

  return picked.sort((a, b) => {
    const aRead = readIds.includes(a.id) ? 1 : 0;
    const bRead = readIds.includes(b.id) ? 1 : 0;
    if (aRead !== bRead) return aRead - bRead;
    return 0;
  });
}
