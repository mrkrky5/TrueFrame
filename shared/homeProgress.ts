import type { MediaDossier } from "./dossier";
import type { HistoryCard, ReadingRoute } from "../types/index";

export type ProgressItem =
  | { kind: "route"; id: string; title: string; done: number; total: number; pct: number }
  | { kind: "dossier"; slug: string; title: string; done: number; total: number; pct: number };

function progressScore(done: number, total: number): number {
  if (total <= 0 || done <= 0 || done >= total) return -1;
  return done / total;
}

export function getIncompleteRoutes(
  routes: ReadingRoute[],
  cards: HistoryCard[],
  readIds: string[],
  limit = 2
): ProgressItem[] {
  return routes
    .map((route) => {
      const routeCards = cards.filter((c) => route.cardIds.includes(c.id));
      const total = routeCards.length;
      const done = routeCards.filter((c) => readIds.includes(c.id)).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      return {
        kind: "route" as const,
        id: route.id,
        title: route.title,
        done,
        total,
        pct,
        score: progressScore(done, total),
      };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || b.done - a.done)
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item);
}

export function getIncompleteDossiers(
  dossiers: MediaDossier[],
  readIds: string[],
  limit = 2
): ProgressItem[] {
  return dossiers
    .map((dossier) => {
      const total = dossier.cardIds.length;
      const done = dossier.cardIds.filter((id) => readIds.includes(id)).length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      return {
        kind: "dossier" as const,
        slug: dossier.slug,
        title: dossier.title,
        done,
        total,
        pct,
        score: progressScore(done, total),
      };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || b.done - a.done)
    .slice(0, limit)
    .map(({ score: _score, ...item }) => item);
}

export function getHomeContinueItems(
  routes: ReadingRoute[],
  dossiers: MediaDossier[],
  cards: HistoryCard[],
  readIds: string[],
  maxItems = 3
): ProgressItem[] {
  const routesProgress = getIncompleteRoutes(routes, cards, readIds, maxItems);
  const dossiersProgress = getIncompleteDossiers(dossiers, readIds, maxItems);
  return [...routesProgress, ...dossiersProgress]
    .sort((a, b) => b.pct - a.pct || b.done - a.done)
    .slice(0, maxItems);
}

export type PrimaryHomeContinue = ProgressItem & {
  href: string;
  nextCardTitle?: string;
};

/** Single dominant “resume” target for the home hero CTA. */
export function getPrimaryHomeContinue(
  routes: ReadingRoute[],
  dossiers: MediaDossier[],
  cards: HistoryCard[],
  readIds: string[]
): PrimaryHomeContinue | null {
  const item = getHomeContinueItems(routes, dossiers, cards, readIds, 1)[0];
  if (!item) return null;

  if (item.kind === "route") {
    const route = routes.find((r) => r.id === item.id);
    const next = route ? getNextUnreadInRoute(route, cards, readIds) : undefined;
    return {
      ...item,
      href: next ? `/card/${next.id}` : `/routes/${item.id}`,
      nextCardTitle: next?.title,
    };
  }

  const dossier = dossiers.find((d) => d.slug === item.slug);
  const next = dossier?.cards.find((c) => !readIds.includes(c.id));
  return {
    ...item,
    href: next ? `/card/${next.id}` : `/explore/media/${item.slug}`,
    nextCardTitle: next?.title,
  };
}

export function getNextUnreadInRoute(
  route: ReadingRoute,
  cards: HistoryCard[],
  readIds: string[]
): HistoryCard | undefined {
  const routeCards = cards.filter((c) => route.cardIds.includes(c.id));
  return routeCards.find((c) => !readIds.includes(c.id));
}

export function getDossierReadProgress(dossier: MediaDossier, readIds: string[]) {
  const done = dossier.cardIds.filter((id) => readIds.includes(id)).length;
  const total = dossier.cardIds.length;
  return { done, total, left: Math.max(0, total - done) };
}
