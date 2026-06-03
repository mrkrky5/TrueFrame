#!/usr/bin/env node
/**
 * Apply all block patches for a tf26 batch (docs/tf26-batches.json).
 *
 *   node scripts/apply-tf26-batch.mjs 1
 *   node scripts/apply-tf26-batch.mjs 1 --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");
const batchArg = process.argv.slice(2).find((a) => !a.startsWith("-"));

if (!batchArg || !/^[123]$/.test(batchArg)) {
  console.error("Usage: node scripts/apply-tf26-batch.mjs <1|2|3> [--write]");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "docs/tf26-batches.json"), "utf8"));
const batch = manifest.batches.find((b) => b.id === Number(batchArg));
if (!batch) {
  console.error(`Batch ${batchArg} not found in docs/tf26-batches.json`);
  process.exit(1);
}

const FIELDS = [
  "subtitle",
  "whatWeSee",
  "quickRealityCheck",
  "realHistory",
  "mediaChanged",
  "whyItMatters",
  "accuracyNote",
  "mediaConnection",
  "misconception",
  "whyInteresting",
  "readingTimeMinutes",
  "sources",
  "relatedCardIds",
];

function applyLocale(locale, block, patches) {
  const rel = `data/cards.${locale}.json`;
  const cards = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  const map = new Map(cards.map((c) => [c.id, c]));
  let updated = 0;
  for (const [id, locales] of Object.entries(patches)) {
    if (!batch.cardIds.includes(id)) continue;
    const card = map.get(id);
    const delta = locales[locale];
    if (!card || !delta) continue;
    for (const key of FIELDS) {
      if (delta[key] !== undefined) card[key] = delta[key];
    }
    updated++;
  }
  if (write) {
    fs.writeFileSync(path.join(root, rel), `${JSON.stringify(cards, null, 2)}\n`, "utf8");
  }
  return updated;
}

let totalTr = 0;
let totalEn = 0;
const missing = [];

for (const block of batch.blocks) {
  const patchPath = path.join(root, "data", "tf26-patches", `${block}.json`);
  if (!fs.existsSync(patchPath)) {
    missing.push(block);
    continue;
  }
  const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
  const tr = applyLocale("tr", block, patch.patches);
  const en = applyLocale("en", block, patch.patches);
  totalTr += tr;
  totalEn += en;
  console.log(`${block}: TR ${tr}, EN ${en}`);
}

console.log(`\nBatch ${batchArg} (${batch.size} cards target)`);
console.log(`Patched TR: ${totalTr}, EN: ${totalEn}`);
if (missing.length) {
  console.warn(`Missing patch files: ${missing.join(", ")}`);
  process.exit(1);
}
if (!write) {
  console.log("\nDry run. Pass --write to apply.");
} else {
  console.log("\nRun: npm run content:audit-tf26");
}
