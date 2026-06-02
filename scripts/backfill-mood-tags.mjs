#!/usr/bin/env node
/**
 * Keşfet ruh hali filtreleri için alias etiketleri karta ekler (duplicate yok).
 *   node scripts/backfill-mood-tags.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

const MOOD_ALIASES = {
  "antik-dnya": ["antik-misir", "antik-yunan", "roma", "misir", "yunanistan"],
  savas: ["1917", "denizcilik", "ww1", "ww2"],
  samuray: ["japonya", "shogun", "tokugawa", "tsushima"],
  mitoloji: ["mit", "efsane"],
  imparatorluklar: ["imparatorluk"],
  propaganda: ["devlet"],
  bilim: ["teknoloji", "oppenheimer", "chernobyl"],
  "gnlk-hayat": ["gunluk", "hayat"],
};

function backfillLocale(locale) {
  const p = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(p, "utf8"));
  let touched = 0;

  for (const card of cards) {
    const tags = new Set(card.tags ?? []);
    const before = tags.size;
    for (const [mood, aliases] of Object.entries(MOOD_ALIASES)) {
      if (aliases.some((a) => tags.has(a))) tags.add(mood);
    }
    if (tags.size > before) {
      card.tags = [...tags];
      touched++;
    }
  }

  if (write) fs.writeFileSync(p, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
  return touched;
}

const tr = backfillLocale("tr");
const en = backfillLocale("en");
console.log(`Mood alias etiketleri: TR ${tr} kart, EN ${en} kart güncellendi.`);
if (!write) console.log("Yazmak için: node scripts/backfill-mood-tags.mjs --write");
