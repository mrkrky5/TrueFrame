#!/usr/bin/env node
/**
 * Deterministic export of remaining (not-yet-authored) Turkish source cards,
 * chunked for an external English-native adaptation step.
 *
 * This script is EXPORT-ONLY. It does NOT translate, rewrite, summarize,
 * normalize, reorder, or modify any card data. It never touches
 * data/cards.en.json and never rebuilds any index.
 *
 * Inputs:
 *   - data/cards.tr.json            (canonical source, full card objects)
 *   - docs/en-adaptations/*.json    (already authored EN batch files)
 *
 * Output:
 *   - docs/en-adaptation-source-chunks/source-chunk-NNN.json (NNN starts at 004)
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const TR_PATH = path.join(root, "data", "cards.tr.json");
const AUTHORED_DIR = path.join(root, "docs", "en-adaptations");
const OUT_DIR = path.join(root, "docs", "en-adaptation-source-chunks");

const CHUNK_SIZE = 20;
const START_CHUNK_NUMBER = 4; // batches 01-03 already exist

const pad3 = (n) => String(n).padStart(3, "0");

// ---- Read TR (canonical) ----
const tr = JSON.parse(fs.readFileSync(TR_PATH, "utf8"));
if (!Array.isArray(tr)) {
  console.error("FATAL: data/cards.tr.json is not an array");
  process.exit(1);
}
const trIds = new Set(tr.map((c) => c.id));

// ---- Read already authored EN adaptation files ----
const authoredFiles = fs.existsSync(AUTHORED_DIR)
  ? fs.readdirSync(AUTHORED_DIR).filter((f) => f.endsWith(".json")).sort()
  : [];

const authoredIds = new Set();
const duplicateAuthored = [];
const authoredNotInTr = [];

for (const f of authoredFiles) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(path.join(AUTHORED_DIR, f), "utf8"));
  } catch (e) {
    console.error(`FATAL: invalid JSON in docs/en-adaptations/${f}: ${e.message}`);
    process.exit(1);
  }
  // Support both a flat array of cards and a { cards: [...] } wrapper.
  const arr = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.cards)
      ? parsed.cards
      : null;
  if (!arr) {
    console.error(`FATAL: ${f} is neither an array nor an object with a cards array`);
    process.exit(1);
  }
  for (const o of arr) {
    if (!o || !o.id) {
      console.error(`FATAL: ${f} contains an entry with no id`);
      process.exit(1);
    }
    if (authoredIds.has(o.id)) duplicateAuthored.push(`${o.id} (dup in ${f})`);
    authoredIds.add(o.id);
    if (!trIds.has(o.id)) authoredNotInTr.push(o.id);
  }
}

// ---- Compute remaining cards in strict TR order ----
const remaining = tr.filter((c) => !authoredIds.has(c.id));

// ---- Build chunks ----
fs.mkdirSync(OUT_DIR, { recursive: true });

const authoredInTrCount = [...authoredIds].filter((id) => trIds.has(id)).length;
const totalTr = tr.length;

const chunks = [];
for (let i = 0; i < remaining.length; i += CHUNK_SIZE) {
  chunks.push(remaining.slice(i, i + CHUNK_SIZE));
}

const written = [];
let cumulativeBefore = authoredInTrCount; // cards "handled" before this chunk
for (let idx = 0; idx < chunks.length; idx++) {
  const cards = chunks[idx];
  const chunkNumber = START_CHUNK_NUMBER + idx;
  const ids = cards.map((c) => c.id);
  const remainingAfter = totalTr - (cumulativeBefore + cards.length);

  const payload = {
    meta: {
      purpose: "source cards for English-native adaptation",
      sourceFile: "data/cards.tr.json",
      chunkNumber,
      cardCount: cards.length,
      alreadyAuthoredCountBeforeChunk: cumulativeBefore,
      remainingCountAfterChunk: remainingAfter,
      ids,
    },
    cards, // full TR card objects, exactly as in data/cards.tr.json
  };

  const fileName = `source-chunk-${pad3(chunkNumber)}.json`;
  fs.writeFileSync(path.join(OUT_DIR, fileName), JSON.stringify(payload, null, 2) + "\n", "utf8");
  written.push({ fileName, count: cards.length, firstId: ids[0], lastId: ids[ids.length - 1] });

  cumulativeBefore += cards.length;
}

// ---- Integrity checks ----
const exportedIds = remaining.map((c) => c.id);
const exportedSet = new Set(exportedIds);
const missing = []; // TR ids neither authored nor exported
for (const id of trIds) {
  if (!authoredIds.has(id) && !exportedSet.has(id)) missing.push(id);
}
const overlapAuthoredExported = exportedIds.filter((id) => authoredIds.has(id));

// ---- Report ----
console.log("============ EN ADAPTATION SOURCE EXPORT ============");
console.log(`TR cards (canonical)        : ${totalTr}`);
console.log(`authored EN files read      : ${authoredFiles.length} (${authoredFiles.join(", ") || "none"})`);
console.log(`detected authored IDs       : ${authoredIds.size}`);
console.log(`  - of which present in TR   : ${authoredInTrCount}`);
console.log(`  - authored but NOT in TR   : ${authoredNotInTr.length}${authoredNotInTr.length ? " -> " + authoredNotInTr.join(", ") : ""}`);
console.log(`remaining exported cards    : ${remaining.length}`);
console.log(`chunk size                  : ${CHUNK_SIZE}`);
console.log(`source chunk files created  : ${written.length}`);
console.log("");
console.log("--- chunks ---");
for (const w of written) {
  console.log(`${w.fileName}  cards=${String(w.count).padStart(2)}  first=${w.firstId}  last=${w.lastId}`);
}
console.log("");
console.log("--- integrity ---");
console.log(`duplicate authored IDs      : ${duplicateAuthored.length}${duplicateAuthored.length ? " -> " + duplicateAuthored.join(", ") : ""}`);
console.log(`missing IDs (unaccounted)   : ${missing.length}${missing.length ? " -> " + missing.join(", ") : ""}`);
console.log(`authored/exported overlap   : ${overlapAuthoredExported.length}${overlapAuthoredExported.length ? " -> " + overlapAuthoredExported.join(", ") : ""}`);
console.log(`accounting check            : authoredInTr(${authoredInTrCount}) + exported(${remaining.length}) = ${authoredInTrCount + remaining.length} (TR=${totalTr}) ${authoredInTrCount + remaining.length === totalTr ? "OK" : "MISMATCH"}`);
console.log("");
console.log("data/cards.en.json          : NOT written by this script");
console.log("index files                 : NOT rebuilt by this script");
