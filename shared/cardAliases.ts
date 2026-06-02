/** Legacy ids → canonical card id (URLs, routes, cross-references) */
export const CARD_ID_ALIASES: Record<string, string> = {
  "ac-mirage-baghdad": "house-wisdom-baghdad",
  "crown-aberfan": "the-crown-aberfan-tragedy-real",
  "crown-suez-crisis": "the-crown-suez-crisis-empire-end",
  "oppenheimer-hearing-1954": "oppenheimer-gray-board-1954-real",
  "oppenheimer-downwinders": "oppenheimer-rad-downwinders",
  "mafia-rico-law": "mafia-rico-law-impact-real",
  "mafia-immigration": "mafia-immigration-crime",
  "rome-collapse-attila": "total-war-attila-collapse",
  "constantinople-1453": "constantinople-fall-turning-new",
  "mesopotamia-banking": "mesopotamian-markets-new",
  "mongol-yam-system": "aoe4-mongol-logistics",
  "medieval-castles-power": "aoe2-castles-politics",
  "medieval-justice-kcd": "kcd2-medieval-law",
  "last-emperor-eunuchs": "last-emperor-forbidden-city-eunuchs-real",
  "crown-empire-transition": "crown-commonwealth-empire",
  "last-samurai-satsuma": "last-samurai-rebellion",
  "chernobyl-pripyat-evacuation-real": "chernobyl-pripyat-delay",
  // Stale route ids (cards renamed or merged)
  "shogun-real-shinobi": "shogun2-shinobi",
  "battlefield-harlem-hellfighters": "bf1-harlem-hellfighters",
  "total-war-shogun2-daimyo": "shogun2-shinobi",
  "horn-helm-myth": "viking-horned-helmet",
  "medieval-hygiene-myth": "medieval-hygiene",
  "great-fire-plague-myth": "london-fire-plague",
  "constantinople-fall-impact": "constantinople-fall-turning-new",
  "ac-mirage-urban-life": "baghdad-daily-life-new",
  "kcd-medieval-crime": "kcd2-medieval-law",
  "total-war-three-kingdoms-warlords": "three-kingdoms-legend",
  "civ-great-leaders-simplification": "civ-great-library-alexandria-real",
  "civ-linear-history": "civ-alphabet-revolution-real",
  "crown-monarchy-symbol": "the-crown-monarchy",
  "last-emperor-court-ritual": "last-emperor-forbidden-city-eunuchs-real",
  "modern-propaganda-origins": "cold-war-fear-system",
  "medieval-road-travel": "silk-road-travel-new",
  "ottoman-bazaar-shopping": "ottoman-beyond-war",
};

export function resolveCardId(id: string): string {
  return CARD_ID_ALIASES[id] || id;
}

export function normalizeCardIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of ids) {
    const id = resolveCardId(raw);
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}
