import type { HistoryCard, ReadingRoute } from "../types/index";

export type RouteCompletion = {
  routeId: string;
  routeTitle: string;
  cardCount: number;
  nextRouteId?: string;
  nextRouteTitle?: string;
};

export function findRouteForCard(routes: ReadingRoute[], cardId: string): ReadingRoute | undefined {
  return routes.find((r) => r.cardIds.includes(cardId));
}

/** Returns route info if marking `cardId` read would complete that route. */
export function detectRouteJustCompleted(
  cardId: string,
  readIds: string[],
  routes: ReadingRoute[],
  cards: HistoryCard[]
): RouteCompletion | null {
  if (readIds.includes(cardId)) return null;

  const route = findRouteForCard(routes, cardId);
  if (!route) return null;

  const routeCards = cards.filter((c) => route.cardIds.includes(c.id));
  const total = routeCards.length;
  if (total <= 0) return null;

  const doneBefore = routeCards.filter((c) => readIds.includes(c.id)).length;
  if (doneBefore + 1 !== total) return null;

  return { routeId: route.id, routeTitle: route.title, cardCount: total };
}

export function getNextIncompleteRoute(
  routes: ReadingRoute[],
  cards: HistoryCard[],
  readIds: string[],
  excludeRouteId?: string
): ReadingRoute | null {
  const candidates = routes
    .filter((r) => r.id !== excludeRouteId)
    .map((route) => {
      const routeCards = cards.filter((c) => route.cardIds.includes(c.id));
      const total = routeCards.length;
      const done = routeCards.filter((c) => readIds.includes(c.id)).length;
      return { route, done, total, pct: total ? done / total : 0 };
    })
    .filter((x) => x.total > 0 && x.done < x.total)
    .sort((a, b) => b.pct - a.pct || b.done - a.done);

  return candidates[0]?.route ?? null;
}
