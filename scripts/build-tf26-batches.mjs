#!/usr/bin/env node
/**
 * Split non-defer tf26 cards into 3 batches (20 + 20 + 23) by audit priority.
 *
 *   node scripts/build-tf26-batches.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SIZES = [20, 20, 23];

const audit = JSON.parse(fs.readFileSync(path.join(root, "docs/tf26-audit.json"), "utf8"));
const need = audit.cards
  .filter((c) => c.action !== "defer")
  .sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.id.localeCompare(b.id));

if (need.length !== SIZES.reduce((a, b) => a + b, 0)) {
  console.warn(`Expected ${SIZES.reduce((a, b) => a + b, 0)} cards, got ${need.length}`);
}

const batches = [];
let i = 0;
for (let n = 0; n < SIZES.length; n++) {
  const slice = need.slice(i, i + SIZES[n]);
  i += SIZES[n];
  const blocks = [...new Set(slice.map((c) => c.block))].sort();
  batches.push({
    id: n + 1,
    label: `batch-${n + 1}`,
    size: slice.length,
    cardIds: slice.map((c) => c.id),
    blocks,
    cards: slice.map((c) => ({
      id: c.id,
      title: c.title,
      block: c.block,
      action: c.action,
      priority: c.priority,
    })),
  });
}

const out = {
  generatedAt: new Date().toISOString(),
  totalNeedingPatch: need.length,
  sizes: SIZES,
  batches,
};

const outPath = path.join(root, "docs/tf26-batches.json");
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath}`);
for (const b of batches) {
  console.log(`  ${b.label}: ${b.size} cards, ${b.blocks.length} blocks`);
}
