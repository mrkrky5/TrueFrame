#!/usr/bin/env node
/**
 * Fix a small, explicit set of pre-existing data-hygiene issues in data/cards.tr.json.
 * Conservative & deterministic: only touches the exact (id, field, oldValue) pairs below.
 *
 *   node scripts/fix-tr-content-issues.mjs           # dry-run
 *   node scripts/fix-tr-content-issues.mjs --write    # apply
 *
 * Scope:
 *   1. difficulty "easy" -> "basic"            (invalid enum; valid = basic|medium|deep)
 *   2. relatedCardId gladiator-commodus -> gladiator-commodus-real (broken ref -> real id)
 *   3. malformed İ/İş tag slugs (Turkish dotted-i split) -> canonical slug
 *      (the WWI "i-dunya-savasi" tags are CORRECT and intentionally left untouched)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");
const TARGET = path.join(root, "data", "cards.tr.json");

const cards = JSON.parse(fs.readFileSync(TARGET, "utf8"));
const byId = new Map(cards.map((c) => [c.id, c]));
const allIds = new Set(byId.keys());

const DIFFICULTY_FIX = ["gladiator-colosseum", "napoleon-height", "viking-horned-helmet", "iron-maiden-myth", "roman-fast-food"];

const RELATED_FIX = { id: "tf26-020-fall-myth", from: "gladiator-commodus", to: "gladiator-commodus-real" };

// Each: cardId -> { from -> to } (exact tag string replacement)
const TAG_FIX = {
  "prestige-currents": { "i-dnyas": "is-dunyasi" },
  "saving-private-ryan-snipers-reality": { "i-dunya-savasi": "ii-dunya-savasi" }, // WWII card mistagged WWI
  "tf26-001-alexandria-library": { "i-skenderiye-kutuphanesi": "iskenderiye-kutuphanesi" },
  "tf26-007-pyramids-labor": { "piramit-i-scileri": "piramit-iscileri" },
  "tf26-034-norse-religion": { "nors-i-nanci": "nors-inanci" },
  "tf26-048-names-identity": { "i-sim-ve-kimlik": "isim-ve-kimlik" },
  "tf26-107-french-alliance": { "fransiz-i-ttifaki": "fransiz-ittifaki" },
  "tf26-133-airborne": { "hava-i-ndirmeleri": "hava-indirmeleri" },
};

const changes = [];
const skipped = [];

// 1. difficulty
for (const id of DIFFICULTY_FIX) {
  const c = byId.get(id);
  if (!c) { skipped.push(`difficulty: missing card ${id}`); continue; }
  if (c.difficulty === "easy") { c.difficulty = "basic"; changes.push(`${id}: difficulty easy -> basic`); }
  else skipped.push(`difficulty: ${id} is "${c.difficulty}" (not "easy"), skipped`);
}

// 2. relatedCardId
{
  const c = byId.get(RELATED_FIX.id);
  if (!c) skipped.push(`related: missing card ${RELATED_FIX.id}`);
  else if (!allIds.has(RELATED_FIX.to)) skipped.push(`related: target ${RELATED_FIX.to} does not exist`);
  else if (Array.isArray(c.relatedCardIds) && c.relatedCardIds.includes(RELATED_FIX.from)) {
    c.relatedCardIds = c.relatedCardIds.map((r) => (r === RELATED_FIX.from ? RELATED_FIX.to : r));
    changes.push(`${RELATED_FIX.id}: relatedCardId ${RELATED_FIX.from} -> ${RELATED_FIX.to}`);
  } else skipped.push(`related: ${RELATED_FIX.id} no longer contains ${RELATED_FIX.from}`);
}

// 3. tags
for (const [id, map] of Object.entries(TAG_FIX)) {
  const c = byId.get(id);
  if (!c || !Array.isArray(c.tags)) { skipped.push(`tag: missing card/tags ${id}`); continue; }
  for (const [from, to] of Object.entries(map)) {
    const i = c.tags.indexOf(from);
    if (i === -1) { skipped.push(`tag: ${id} has no tag "${from}"`); continue; }
    if (c.tags.includes(to)) { c.tags.splice(i, 1); changes.push(`${id}: tag "${from}" removed (dup of existing "${to}")`); }
    else { c.tags[i] = to; changes.push(`${id}: tag "${from}" -> "${to}"`); }
  }
}

console.log(`=== fix-tr-content-issues (${WRITE ? "WRITE" : "DRY-RUN"}) ===`);
console.log(`changes: ${changes.length}`);
for (const c of changes) console.log("  +", c);
if (skipped.length) {
  console.log(`skipped/no-op: ${skipped.length}`);
  for (const s of skipped) console.log("  -", s);
}

if (WRITE && changes.length) {
  fs.writeFileSync(TARGET, JSON.stringify(cards, null, 2) + "\n", "utf8");
  console.log(`\nWROTE ${path.relative(root, TARGET)}`);
} else if (!WRITE) {
  console.log("\n(dry-run; re-run with --write to apply)");
}
