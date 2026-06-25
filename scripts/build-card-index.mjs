#!/usr/bin/env node
/**
 * Hafif kart kataloğu — liste/keşfet için tam JSON yerine index üretir.
 *   node scripts/build-card-index.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");

const INDEX_KEYS = [
  "id",
  "title",
  "subtitle",
  "mediaType",
  "mediaTitle",
  "whatWeSee",
  "quickRealityCheck",
  "themes",
  "readingTimeMinutes",
  "relatedCardIds",
  "spoilerLevel",
  "accuracyType",
  "isFlagship",
  "tags",
  "verificationStatus",
];

function truncate(str, max) {
  if (typeof str !== "string") return "";
  const t = str.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

function buildSearchBlob(card) {
  const blob = [
    card.title,
    card.subtitle,
    card.mediaTitle,
    truncate(card.whatWeSee, 120),
    truncate(card.quickRealityCheck, 120),
    truncate(card.realHistory, 180),
    ...(card.tags ?? []),
    ...(card.themes ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  return truncate(blob, 320);
}

function toIndexEntry(card) {
  const entry = {};
  for (const key of INDEX_KEYS) {
    if (card[key] !== undefined && card[key] !== null) entry[key] = card[key];
  }
  if (typeof entry.whatWeSee === "string") entry.whatWeSee = truncate(entry.whatWeSee, 160);
  if (typeof entry.quickRealityCheck === "string") {
    entry.quickRealityCheck = truncate(entry.quickRealityCheck, 160);
  }
  entry.searchBlob = buildSearchBlob(card);
  return entry;
}

for (const locale of ["tr", "en"]) {
  const srcPath = path.join(dataDir, `cards.${locale}.json`);
  const outPath = path.join(dataDir, `cards.index.${locale}.json`);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Skip: ${srcPath} yok`);
    continue;
  }
  const cards = JSON.parse(fs.readFileSync(srcPath, "utf8"));
  const index = cards.map(toIndexEntry);
  fs.writeFileSync(outPath, JSON.stringify(index));
  const srcKb = (fs.statSync(srcPath).size / 1024).toFixed(0);
  const outKb = (fs.statSync(outPath).size / 1024).toFixed(0);
  console.log(`cards.index.${locale}.json — ${index.length} kart (${outKb} KB, kaynak ${srcKb} KB)`);
}
