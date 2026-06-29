import indexTr from "../data/cards.index.tr.json";
import indexEn from "../data/cards.index.en.json";
import routesTr from "../data/routes.tr.json";
import routesEn from "../data/routes.en.json";
import type { HistoryCard, ReadingRoute } from "../types/index";
import type { Locale } from "./i18n";
import { resolveCardId } from "./cardAliases";

export type CardCatalogEntry = HistoryCard & { searchBlob?: string };

type FullCache = Partial<Record<Locale, HistoryCard[]>>;
type Loaders = Partial<Record<Locale, Promise<HistoryCard[]>>>;

const fullCache: FullCache = {};
const loaders: Loaders = {};

function getIndex(locale: Locale): CardCatalogEntry[] {
  return (locale === "en" ? indexEn : indexTr) as CardCatalogEntry[];
}

export function isFullCatalogLoaded(locale: Locale): boolean {
  return Boolean(fullCache[locale]);
}

export function getCards(locale: Locale): HistoryCard[] {
  return fullCache[locale] ?? (getIndex(locale) as HistoryCard[]);
}

export async function preloadCatalog(locale: Locale): Promise<HistoryCard[]> {
  if (fullCache[locale]) return fullCache[locale]!;

  if (!loaders[locale]) {
    loaders[locale] = (locale === "en"
      ? import("../data/cards.runtime.en.json")
      : import("../data/cards.runtime.tr.json")
    ).then((mod) => {
      const cards = ((mod as { default?: HistoryCard[] }).default ?? mod) as HistoryCard[];
      fullCache[locale] = cards;
      return cards;
    });
  }

  return loaders[locale]!;
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
  const full = fullCache[locale];
  if (full) return full.find((c) => c.id === canonical);
  return getIndex(locale).find((c) => c.id === canonical) as HistoryCard | undefined;
}

/** Reader needs body fields — false when only index slice is loaded. */
export function isCardBodyReady(card: HistoryCard | undefined): boolean {
  if (!card) return false;
  if (card.realHistory?.trim()) return true;
  if (card.isFlagship && card.contentBlocks?.length) return true;
  return false;
}
