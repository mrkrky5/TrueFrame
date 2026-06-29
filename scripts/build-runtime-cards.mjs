#!/usr/bin/env node
/**
 * Build slim runtime card catalogs for the app bundle.
 *
 *   node scripts/build-runtime-cards.mjs
 *
 * The app only ever needs a subset of card fields at runtime. The full
 * data/cards.<locale>.json files remain the editorial source of truth (and are
 * still consumed by the content-quality/audit tooling), but they also carry
 * editorial/QA metadata that the mobile/web reader never renders. This script
 * emits data/cards.runtime.<locale>.json with those unused fields removed so the
 * shipped JS bundle stays smaller. Source files are never modified.
 *
 * DROP list = fields verified to have ZERO runtime references in mobile/, shared/,
 * lib/ and to not be behaviour-gating (see scripts/_tmp-field-scan analysis).
 * It is a drop-list (not an allow-list) so any new field is kept by default.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");

// Editorial / QA-only fields the runtime reader never accesses.
const DROP_FIELDS = [
  "whyInteresting",
  "misconception",
  "nextTopics",
  "similarMedia",
  "difficulty",
  "sourceQuality",
  "lastReviewedAt",
  "reviewerNote",
  "mediaConnection",
  "images",
  "spoilerLine",
];

let totalSaved = 0;
for (const locale of ["tr", "en"]) {
  const srcPath = path.join(dataDir, `cards.${locale}.json`);
  const outPath = path.join(dataDir, `cards.runtime.${locale}.json`);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Skip: ${srcPath} yok`);
    continue;
  }
  const cards = JSON.parse(fs.readFileSync(srcPath, "utf8"));
  const slim = cards.map((card) => {
    const out = {};
    for (const [k, v] of Object.entries(card)) {
      if (!DROP_FIELDS.includes(k)) out[k] = v;
    }
    return out;
  });
  fs.writeFileSync(outPath, JSON.stringify(slim) + "\n", "utf8");
  // Honest field-drop saving: compare minified full vs minified slim (Metro
  // minifies JSON in the bundle regardless of source pretty-printing).
  const fullMinKb = Buffer.byteLength(JSON.stringify(cards), "utf8") / 1024;
  const slimMinKb = Buffer.byteLength(JSON.stringify(slim), "utf8") / 1024;
  totalSaved += fullMinKb - slimMinKb;
  console.log(
    `cards.runtime.${locale}.json — ${slim.length} kart ` +
      `(slim ${slimMinKb.toFixed(0)} KB vs full-minified ${fullMinKb.toFixed(0)} KB, -${(fullMinKb - slimMinKb).toFixed(0)} KB)`
  );
}
console.log(`Dropped fields: ${DROP_FIELDS.join(", ")}`);
console.log(`Toplam tasarruf (source bytes, minify oncesi): ${totalSaved.toFixed(0)} KB`);
