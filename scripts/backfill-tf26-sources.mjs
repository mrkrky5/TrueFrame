#!/usr/bin/env node
/**
 * Add 2nd source (and fix wrong 1st) for tf26 script_sources cards.
 *
 *   npm run content:build-tf26-sources   # regenerate catalog JSON
 *   npm run content:backfill-tf26-sources
 *   npm run content:backfill-tf26-sources -- --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "data/tf26-source-backfill.json"), "utf8")
);

const GENERIC_PRIMARY = [
  "www.archives.gov/milestone-documents/homestead-act",
  "www.nps.gov/gosp/learn/historyculture/the-transcontinental-railroad",
];

function isGenericPrimary(url) {
  if (!url) return false;
  return GENERIC_PRIMARY.some((frag) => url.includes(frag));
}

function sourceKey(s) {
  return `${s.url}::${s.title}`;
}

function applySource(card, spec, verified = true) {
  return {
    title: spec.title,
    url: spec.url,
    type: spec.type || "article",
    verified: spec.verified ?? verified,
  };
}

function processCards(cards, locale) {
  const stats = { secondAdded: 0, primaryFixed: 0, alreadyOk: 0, skipped: 0 };

  for (const card of cards) {
    if (!card.id.startsWith("tf26-")) continue;
    const plan = catalog[card.id];
    if (!plan) continue;

    const needsPrimaryFix =
      plan.primaryFix && card.sources?.[0] && isGenericPrimary(card.sources[0].url);
    const needsSecond = (card.sources?.length ?? 0) < 2;
    if (!needsPrimaryFix && !needsSecond) {
      stats.alreadyOk++;
      continue;
    }

    if (!Array.isArray(card.sources)) card.sources = [];
    const urls = new Set(card.sources.map((s) => s.url));

    if (plan.primaryFix && card.sources[0] && isGenericPrimary(card.sources[0].url)) {
      card.sources[0] = applySource(card, plan.primaryFix);
      urls.clear();
      for (const s of card.sources) urls.add(s.url);
      stats.primaryFixed++;
    }

    const second = applySource(card, plan.second);
    if (!urls.has(second.url)) {
      card.sources.push(second);
      stats.secondAdded++;
    } else if (card.sources.length >= 2) {
      stats.alreadyOk++;
    }

    if (card.sources.length >= 2) {
      card.sourceQuality = card.sourceQuality || "strong";
    }
  }

  return stats;
}

const results = [];
for (const locale of ["tr", "en"]) {
  const rel = `data/cards.${locale}.json`;
  const cards = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  const stats = processCards(cards, locale);
  results.push({ locale, ...stats, total: cards.length });
  console.log(`${locale}: +${stats.secondAdded} second, ${stats.primaryFixed} primary fixed, ${stats.alreadyOk} already 2+`);

  if (write) {
    fs.writeFileSync(path.join(root, rel), `${JSON.stringify(cards, null, 2)}\n`, "utf8");
  }
}

if (write) {
  console.log("\nApplied. Run: npm run content:audit-tf26");
} else {
  console.log("\nDry run. Pass --write to apply.");
}
