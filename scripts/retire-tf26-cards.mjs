#!/usr/bin/env node
/**
 * Remove tf26 retire_duplicate cards (legacy already covers topic).
 * Archives removed JSON to data/archive/retired-tf26-<locale>.json
 *
 *   node scripts/retire-tf26-cards.mjs              # dry run
 *   node scripts/retire-tf26-cards.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

const audit = readJson("docs/tf26-audit.json");
const retireRows = audit.cards.filter((c) => c.action === "retire_duplicate");
if (!retireRows.length) {
  console.error("No retire_duplicate rows in docs/tf26-audit.json — run: npm run content:audit-tf26");
  process.exit(1);
}

const retireIds = new Set(retireRows.map((r) => r.id));
const replaceWith = new Map(
  retireRows.filter((r) => r.legacyDuplicate).map((r) => [r.id, r.legacyDuplicate])
);

function processLocale(locale) {
  const rel = `data/cards.${locale}.json`;
  const cards = readJson(rel);
  const removed = cards.filter((c) => retireIds.has(c.id));
  const kept = cards.filter((c) => !retireIds.has(c.id));

  let relatedFixed = 0;
  for (const card of kept) {
    if (!Array.isArray(card.relatedCardIds) || !card.relatedCardIds.length) continue;
    const next = [];
    const seen = new Set();
    for (const rid of card.relatedCardIds) {
      if (retireIds.has(rid)) {
        const leg = replaceWith.get(rid);
        if (leg && !seen.has(leg)) {
          next.push(leg);
          seen.add(leg);
        }
        relatedFixed++;
        continue;
      }
      if (!seen.has(rid)) {
        next.push(rid);
        seen.add(rid);
      }
    }
    if (next.join() !== card.relatedCardIds.join()) {
      card.relatedCardIds = next;
    }
  }

  return { rel, removed, kept, relatedFixed };
}

const archiveDir = path.join(root, "data", "archive");
const results = [];

for (const locale of ["tr", "en"]) {
  const { rel, removed, kept, relatedFixed } = processLocale(locale);
  results.push({ locale, removed: removed.length, relatedFixed, remaining: kept.length });

  console.log(
    `${locale}: remove ${removed.length} cards, fix ${relatedFixed} relatedCardIds refs → ${kept.length} cards`
  );
  if (!write) continue;

  fs.mkdirSync(archiveDir, { recursive: true });
  fs.writeFileSync(
    path.join(archiveDir, `retired-tf26-${locale}.json`),
    `${JSON.stringify({ retiredAt: new Date().toISOString(), cards: removed }, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(path.join(root, rel), `${JSON.stringify(kept, null, 2)}\n`, "utf8");
}

// Routes (tf26 should already be gone)
for (const rel of ["data/routes.tr.json", "data/routes.en.json"]) {
  const routes = readJson(rel);
  let hit = 0;
  for (const route of routes) {
    const before = route.cardIds?.length ?? 0;
    route.cardIds = (route.cardIds ?? []).filter((id) => !retireIds.has(id));
    hit += before - route.cardIds.length;
  }
  if (hit) {
    console.log(`${rel}: stripped ${hit} retire ids from routes`);
    if (write) fs.writeFileSync(path.join(root, rel), `${JSON.stringify(routes, null, 2)}\n`, "utf8");
  }
}

const manifest = {
  retiredAt: new Date().toISOString(),
  count: retireIds.size,
  cards: retireRows.map((r) => ({
    id: r.id,
    title: r.title,
    keepInstead: r.legacyDuplicate,
    legacyTitle: r.legacyTitle,
  })),
};

if (write) {
  fs.writeFileSync(
    path.join(archiveDir, "retired-tf26-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
}

console.log("\nRetire list:");
for (const row of manifest.cards) {
  console.log(`  ${row.id} → ${row.keepInstead}`);
}

if (!write) {
  console.log("\nDry run. Pass --write to apply.");
} else {
  console.log(`\nArchived under data/archive/retired-tf26-*.json`);
  console.log("Re-run: npm run content:audit-tf26");
}
