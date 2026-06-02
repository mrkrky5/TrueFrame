import type { AccuracyType, HistoryCard, MediaType, SpoilerLevel } from "../types/index";
import { slugify } from "./slugify";

export interface MediaDossier {
  title: string;
  slug: string;
  mediaType: MediaType;
  cardIds: string[];
  cards: HistoryCard[];
  flagshipCount: number;
  totalReadingTime: number;
  accuracyDistribution: Record<AccuracyType, number>;
  spoilerSummary: SpoilerLevel;
  topTags: string[];
}

const EXCLUDED_TITLES = [
  "Günlük Hayat", "Daily Life", "Tarihi Yanılgı", "Historical Myth",
  "Popüler Kültür Yanılgıları", "Pop-Culture Misconceptions", "Büyük Değişim",
  "Great Change", "Büyük Dönüşüm", "Great Transformation", "Modern Tarih",
  "Modern History", "Atmosphere", "Period Films", "Turning Points",
  "Unknown", "Genel", "General", "Diğer", "Other",
];

export const NORMALIZATION_MAP: Record<string, string> = {
  "Assassin's Creed Mirage": "Assassin's Creed",
  "Assassin's Creed Valhalla": "Assassin's Creed",
  "Assassin's Creed Origins": "Assassin's Creed",
  "Assassin's Creed Odyssey": "Assassin's Creed",
  "Ghost of Tsushima / Shōgun": "Ghost of Tsushima",
  "Shōgun (2024) / Shogun 2": "Shōgun",
  Shgun: "Shōgun",
  Shogun: "Shōgun",
  "Mafia: Definitive Edition": "Mafia",
  "Red Dead Redemption 2": "Red Dead Redemption",
  "Kingdom Come: Deliverance II": "Kingdom Come: Deliverance",
  "Oppenheimer (Film)": "Oppenheimer",
  "The Crown (Dizi)": "The Crown",
  "Gladiator II": "Gladiator",
};

export function getDossierSlug(mediaTitle: string | undefined): string {
  if (!mediaTitle || EXCLUDED_TITLES.includes(mediaTitle)) return "";
  const normalizedTitle = NORMALIZATION_MAP[mediaTitle] || mediaTitle;
  return slugify(normalizedTitle);
}

export function getAllDossiers(cards: HistoryCard[]): MediaDossier[] {
  const dossiersMap: Record<string, MediaDossier> = {};

  cards.forEach((card) => {
    const slug = getDossierSlug(card.mediaTitle);
    if (!slug) return;

    let title = card.mediaTitle || "";
    if (NORMALIZATION_MAP[title]) title = NORMALIZATION_MAP[title];

    if (!dossiersMap[slug]) {
      dossiersMap[slug] = {
        title,
        slug,
        mediaType: card.mediaType,
        cardIds: [],
        cards: [],
        flagshipCount: 0,
        totalReadingTime: 0,
        accuracyDistribution: {
          real: 0,
          "partly-real": 0,
          fictionalized: 0,
          "inspired-by-reality": 0,
          fiction: 0,
        },
        spoilerSummary: "none",
        topTags: [],
      };
    }

    const d = dossiersMap[slug];
    if (!d.cardIds.includes(card.id)) {
      d.cardIds.push(card.id);
      d.cards.push(card);
      if (card.isFlagship) d.flagshipCount++;
      d.totalReadingTime += card.readingTimeMinutes;
      if (card.accuracyType) d.accuracyDistribution[card.accuracyType]++;
      if (card.spoilerLevel === "major") d.spoilerSummary = "major";
      else if (card.spoilerLevel === "minor" && d.spoilerSummary !== "major") {
        d.spoilerSummary = "minor";
      }
      if (card.tags) d.topTags = Array.from(new Set([...d.topTags, ...card.tags]));
    }
  });

  return Object.values(dossiersMap).sort((a, b) => {
    if (b.flagshipCount !== a.flagshipCount) return b.flagshipCount - a.flagshipCount;
    if (b.cardIds.length !== a.cardIds.length) return b.cardIds.length - a.cardIds.length;
    return b.totalReadingTime - a.totalReadingTime;
  });
}

export function getStrongDossiers(cards: HistoryCard[]): MediaDossier[] {
  return getAllDossiers(cards).filter(
    (d) => (d.cardIds.length >= 2 && d.flagshipCount >= 1) || d.cardIds.length >= 5
  );
}

export function getRouteById(routes: import("../types/index").ReadingRoute[], id: string) {
  return routes.find((r) => r.id === id);
}

export function getDossierBySlug(cards: HistoryCard[], slug: string): MediaDossier | undefined {
  return getAllDossiers(cards).find((d) => d.slug === slug);
}
