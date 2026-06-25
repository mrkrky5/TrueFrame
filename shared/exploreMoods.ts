import type { HistoryCard } from "../types/index";
import { MOOD_TAG_ALIASES } from "./moodTags";

export type ExploreMood = { id: string; label: string; tag: string };

const TR_MOODS: Array<{ id: string; labelKey: string; tag: string }> = [
  { id: "war", labelKey: "war", tag: "savas" },
  { id: "myth", labelKey: "myth", tag: "mitoloji" },
  { id: "samurai", labelKey: "samurai", tag: "samuray" },
  { id: "crime", labelKey: "crime", tag: "su" },
  { id: "cold-war", labelKey: "cold-war", tag: "soguk-savas" },
  { id: "ancient-world", labelKey: "ancient-world", tag: "antik-dnya" },
  { id: "empires", labelKey: "empires", tag: "imparatorluklar" },
  { id: "propaganda", labelKey: "propaganda", tag: "propaganda" },
  { id: "daily-life", labelKey: "daily-life", tag: "gnlk-hayat" },
  { id: "science-tech", labelKey: "science-tech", tag: "bilim" },
];

const EN_MOODS: Array<{ id: string; labelKey: string; tag: string }> = [
  { id: "war", labelKey: "war", tag: "war" },
  { id: "myth", labelKey: "myth", tag: "myth" },
  { id: "samurai", labelKey: "samurai", tag: "samurai" },
  { id: "crime", labelKey: "crime", tag: "crime" },
  { id: "cold-war", labelKey: "cold-war", tag: "cold-war" },
  { id: "ancient-world", labelKey: "ancient-world", tag: "ancient-world" },
  { id: "empires", labelKey: "empires", tag: "empires" },
  { id: "propaganda", labelKey: "propaganda", tag: "propaganda" },
  { id: "daily-life", labelKey: "daily-life", tag: "daily-life" },
  { id: "science-tech", labelKey: "science-tech", tag: "science" },
];

type MoodLabels = Record<string, string>;

export function buildExploreMoods(
  locale: string,
  moodLabels: MoodLabels,
  allCards: HistoryCard[]
): ExploreMood[] {
  const defs = locale === "tr" ? TR_MOODS : EN_MOODS;
  const moods = defs.map((m) => ({
    id: m.id,
    label: moodLabels[m.labelKey] ?? m.labelKey,
    tag: m.tag,
  }));

  if (locale === "tr") return moods;

  return moods.filter((m) => {
    const aliases = MOOD_TAG_ALIASES[m.tag];
    if (aliases) return allCards.some((c) => c.tags?.some((t) => aliases.includes(t)));
    return allCards.some((c) => c.tags?.includes(m.tag));
  });
}
