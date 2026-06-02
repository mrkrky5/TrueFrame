import type { HistoryCard, ReadingRoute } from "../types/index";
import type { MediaDossier } from "./dossier";

export function findBestRouteForDossier(
  dossier: MediaDossier,
  routes: ReadingRoute[]
): ReadingRoute | undefined {
  const dossierSet = new Set(dossier.cardIds);
  let best: { route: ReadingRoute; overlap: number } | undefined;

  for (const route of routes) {
    const overlap = route.cardIds.filter((id) => dossierSet.has(id)).length;
    if (overlap < 2) continue;
    if (!best || overlap > best.overlap) {
      best = { route, overlap };
    }
  }

  return best?.route;
}

export function findBestRouteForCard(
  card: HistoryCard,
  routes: ReadingRoute[]
): ReadingRoute | undefined {
  return routes.find((r) => r.cardIds.includes(card.id));
}
