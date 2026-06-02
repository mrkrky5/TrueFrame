import type { HistoryCard } from "../types/index";

/**
 * Keşfet "ruh hali" chip'leri — kart etiketleriyle tam örtüşmeyebilir.
 * Filtre bu alias listelerini kullanır.
 */
export const MOOD_TAG_ALIASES: Record<string, string[]> = {
  savas: ["savas", "1917", "denizcilik", "ww1", "ww2", "soguk-savas", "cold-war"],
  mitoloji: ["mitoloji", "mit", "efsane", "myth"],
  samuray: ["samuray", "japonya", "shogun", "tokugawa", "tsushima", "sengoku"],
  su: ["su", "crime", "mafya", "mafia"],
  "soguk-savas": ["soguk-savas", "cold-war", "nuclear", "oppenheimer", "chernobyl"],
  "antik-dnya": ["antik-dnya", "antik-misir", "antik-yunan", "roma", "misir", "yunanistan", "antik", "antik-mısır"],
  imparatorluklar: ["imparatorluklar", "imparatorluk", "empire", "roma", "ottoman", "persian"],
  propaganda: ["propaganda", "napoleon", "devlet"],
  "gnlk-hayat": ["gnlk-hayat", "daily-life", "gunluk", "hayat", "sehir"],
  bilim: ["bilim", "science", "bilim-tech", "science-tech", "teknoloji"],
  war: ["war", "savas", "1917"],
  myth: ["myth", "mitoloji", "mit"],
  samurai: ["samurai", "samuray", "japonya"],
  crime: ["crime", "su", "mafya"],
  "cold-war": ["cold-war", "soguk-savas"],
  "ancient-world": ["ancient-world", "antik-dnya", "antik-misir", "antik-yunan", "roma", "misir"],
  empires: ["empires", "imparatorluklar", "imparatorluk"],
  "daily-life": ["daily-life", "gnlk-hayat", "gunluk"],
  science: ["science", "bilim"],
};

export function cardMatchesMoodTag(card: HistoryCard, moodTag: string): boolean {
  const tags = card.tags ?? [];
  const aliases = MOOD_TAG_ALIASES[moodTag];
  if (aliases) return tags.some((t) => aliases.includes(t));
  return tags.includes(moodTag);
}
