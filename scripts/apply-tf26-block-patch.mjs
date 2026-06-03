#!/usr/bin/env node
/**
 * Apply block content patches from data/tf26-patches/<block>.json
 *
 *   node scripts/apply-tf26-block-patch.mjs red-dead-redemption
 *   node scripts/apply-tf26-block-patch.mjs red-dead-redemption --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");
const blockArg = process.argv.slice(2).find((a) => !a.startsWith("-"));

if (!blockArg) {
  console.error("Usage: node scripts/apply-tf26-block-patch.mjs <block-slug> [--write]");
  process.exit(1);
}

const patchPath = path.join(root, "data", "tf26-patches", `${blockArg}.json`);
if (!fs.existsSync(patchPath)) {
  console.error(`Patch file not found: ${patchPath}`);
  process.exit(1);
}

const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));
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

function applyLocale(locale) {
  const rel = `data/cards.${locale}.json`;
  const cards = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  const map = new Map(cards.map((c) => [c.id, c]));
  let updated = 0;

  for (const [id, locales] of Object.entries(patch.patches)) {
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

const tr = applyLocale("tr");
const en = applyLocale("en");
console.log(`Block: ${patch.block}`);
console.log(`TR: ${tr} cards patched`);
console.log(`EN: ${en} cards patched`);

if (!write) {
  console.log("\nDry run. Pass --write to apply.");
} else {
  console.log("\nRun: npm run content:audit-tf26");
}
