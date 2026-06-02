import cardsTr from "../data/cards.tr.json";
import cardsEn from "../data/cards.en.json";
import routesTr from "../data/routes.tr.json";
import routesEn from "../data/routes.en.json";
import type { HistoryCard, ReadingRoute } from "../types/index";
import type { Locale } from "./i18n";
import { resolveCardId } from "./cardAliases";

export function getCards(locale: Locale): HistoryCard[] {
  return (locale === "en" ? cardsEn : cardsTr) as HistoryCard[];
}

export function getRoutes(locale: Locale): ReadingRoute[] {
  const routes = (locale === "en" ? routesEn : routesTr) as ReadingRoute[];
  const available = new Set(getCards(locale).map((c) => c.id));
  return routes
    .map((route) => ({
      ...route,
      cardIds: route.cardIds.filter((id) => available.has(id)),
    }))
    .filter((route) => route.cardIds.length > 0);
}

export function getCardById(locale: Locale, id: string): HistoryCard | undefined {
  const canonical = resolveCardId(id);
  return getCards(locale).find((c) => c.id === canonical);
}
