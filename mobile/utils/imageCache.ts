import { Image } from "expo-image";

import type { HistoryCard } from "../../types/index";

const BATCH = 24;

function collectImageUrls(cards: HistoryCard[]): string[] {
  const urls = new Set<string>();
  for (const card of cards) {
    const thumb = card.images?.thumbnail?.src;
    const hero = card.images?.hero?.src;
    if (thumb) urls.add(thumb);
    if (hero) urls.add(hero);
  }
  return [...urls];
}

/** Arka planda kapak görsellerini diske yazar — çevrimdışı okuma için. */
export async function prefetchCardImages(cards: HistoryCard[]): Promise<void> {
  const urls = collectImageUrls(cards);
  for (let i = 0; i < urls.length; i += BATCH) {
    const slice = urls.slice(i, i + BATCH);
    await Promise.allSettled(slice.map((uri) => Image.prefetch(uri)));
  }
}
