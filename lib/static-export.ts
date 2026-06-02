import { i18n, type Locale } from "@/lib/i18n-config";
import { getCards, getRoutes } from "@/lib/get-content";
import { getAllDossiers } from "@/utils/dossier";
import { getCardAliasIds } from "@/lib/card-aliases";

export async function generateLangParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateCardPageParams() {
  const params: { lang: string; id: string }[] = [];

  for (const lang of i18n.locales) {
    const cards = await getCards(lang as Locale);
    const ids = new Set<string>();

    for (const card of cards) {
      ids.add(card.id);
    }

    for (const aliasId of getCardAliasIds()) {
      ids.add(aliasId);
    }

    for (const id of ids) {
      params.push({ lang, id });
    }
  }

  return params;
}

export async function generateMediaPageParams() {
  const params: { lang: string; slug: string }[] = [];

  for (const lang of i18n.locales) {
    const cards = await getCards(lang as Locale);
    const dossiers = getAllDossiers(cards);
    const slugs = new Set(dossiers.map((d) => d.slug));

    // Legacy slug used in production links
    slugs.add("shgun");

    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export async function generateRouteDetailParams() {
  const params: { lang: string; id: string }[] = [];

  for (const lang of i18n.locales) {
    const routes = await getRoutes(lang as Locale);
    for (const route of routes) {
      params.push({ lang, id: route.id });
    }
  }

  return params;
}
