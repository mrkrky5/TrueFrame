#!/usr/bin/env node
/**
 * Add new Turkish cards from docs/content-patches/*.json into data/cards.tr.json.
 *
 *   node scripts/apply-tr-content-additions.mjs            # dry-run (no writes)
 *   node scripts/apply-tr-content-additions.mjs --write    # apply
 *
 * Patch schema (new-content, 069-070 aligned):
 *   { entries: [ { id, operation: "add", fields: {..card..},
 *                  sourceUpdates: { replaceSources, setSourceQuality, setVerificationStatus } } ] }
 *
 * Card assembly:
 *   card = { id: entry.id, ...entry.fields,
 *            sources: sourceUpdates.replaceSources,
 *            sourceQuality: sourceUpdates.setSourceQuality,
 *            verificationStatus: sourceUpdates.setVerificationStatus }
 *
 * Only NEW cards are touched. Existing cards are never modified.
 *
 * relatedCardIds resolution (NEW cards only), for any value not in the valid id set:
 *   1) match by tf26-NNN number among NEW cards -> if exactly one, use its full id
 *   2) else strip "tf26-NNN-" prefix and if the slug equals an EXISTING id, use it
 *   3) else: unresolved -> remove that single reference from the new card and report it
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const DIR = path.join(root, "docs", "content-patches");
const TARGET = path.join(root, "data", "cards.tr.json");

const REQUIRED = ["title", "subtitle", "mediaType", "mediaTitle", "realHistory", "whatWeSee", "quickRealityCheck", "lastReviewedAt"];

const fail = (m) => { console.error(`\nFATAL: ${m}`); process.exit(1); };

const cards = JSON.parse(fs.readFileSync(TARGET, "utf8"));
if (!Array.isArray(cards)) fail("data/cards.tr.json is not a top-level array");
const existingIds = new Set(cards.map((c) => c.id));

// ---- Collect add entries ----
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
const adds = [];
const seen = new Set();
const problems = { dupInPatch: [], collision: [], missingFields: [], emptySources: [], flagshipHeadings: [] };

for (const f of files) {
  let json;
  try { json = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")); }
  catch (e) { fail(`invalid JSON in ${f}: ${e.message}`); }
  for (const e of json.entries || []) {
    if (e.operation !== "add") continue;
    const id = e.id;
    if (!id || typeof id !== "string") fail(`${f}: an add entry has no string id`);
    if (seen.has(id)) problems.dupInPatch.push(id);
    seen.add(id);
    if (existingIds.has(id)) problems.collision.push(id);

    const fields = e.fields || {};
    for (const r of REQUIRED) {
      const v = fields[r];
      if (v == null || (typeof v === "string" && v.trim() === "")) problems.missingFields.push(`${id}.${r}`);
    }
    const srcs = e.sourceUpdates?.replaceSources;
    if (!Array.isArray(srcs) || srcs.length === 0) problems.emptySources.push(id);
    else if (srcs.some((s) => !s?.url || !/^https?:\/\//i.test(s.url))) problems.emptySources.push(`${id} (bad url)`);
    if (fields.isFlagship === true) {
      const h = (fields.realHistory || "").match(/###\s/g) || [];
      if (h.length < 2) problems.flagshipHeadings.push(`${id} (${h.length} headings)`);
    }

    adds.push({ id, file: f, num: Number((id.match(/tf26-(\d+)/) || [])[1]), entry: e });
  }
}

// Fatal integrity gates
if (problems.dupInPatch.length) fail(`duplicate ids within patches: ${problems.dupInPatch.join(", ")}`);
if (problems.collision.length) fail(`ids already present in data/cards.tr.json: ${problems.collision.join(", ")}`);
if (problems.missingFields.length) fail(`missing required fields:\n  ${problems.missingFields.join("\n  ")}`);
if (problems.emptySources.length) fail(`empty/invalid replaceSources:\n  ${problems.emptySources.join("\n  ")}`);
if (problems.flagshipHeadings.length) fail(`flagship cards with <2 ### headings:\n  ${problems.flagshipHeadings.join("\n  ")}`);

// ---- Sort by numeric id (201..284) ----
adds.sort((a, b) => a.num - b.num);

// ---- Build new card objects ----
const newIds = new Set(adds.map((a) => a.id));
const newByNum = new Map();
for (const a of adds) newByNum.set(a.num, (newByNum.get(a.num) || []).concat(a.id));
const validIds = new Set([...existingIds, ...newIds]);

const resolvedRelated = []; // {card, from, to}
const unresolvedRelated = []; // {card, removed}

function resolveRelated(cardId, related) {
  if (!Array.isArray(related)) return related;
  const out = [];
  for (const r of related) {
    if (validIds.has(r)) { out.push(r); continue; }
    // 1) by tf26-NNN number among NEW cards
    const num = Number((String(r).match(/tf26-(\d+)/) || [])[1]);
    const numMatches = Number.isFinite(num) ? (newByNum.get(num) || []) : [];
    if (numMatches.length === 1) {
      resolvedRelated.push({ card: cardId, from: r, to: numMatches[0] });
      out.push(numMatches[0]);
      continue;
    }
    // 2) strip tf26-NNN- prefix -> slug equals an EXISTING id
    const slug = String(r).replace(/^tf26-\d+-/, "");
    if (slug !== r && existingIds.has(slug)) {
      resolvedRelated.push({ card: cardId, from: r, to: slug });
      out.push(slug);
      continue;
    }
    // 3) unresolved -> drop the single reference, report
    unresolvedRelated.push({ card: cardId, removed: r });
  }
  return out;
}

const newCards = adds.map(({ id, entry }) => {
  const f = entry.fields ?? {};
  const su = entry.sourceUpdates ?? {};
  const card = { id, ...f };
  // Schema hygiene: app/types treat mediaChanged as an optional string rendered as
  // block content. Some patches send a boolean flag; drop it (false == no block anyway).
  if (typeof card.mediaChanged !== "string") delete card.mediaChanged;
  if (Array.isArray(card.relatedCardIds)) card.relatedCardIds = resolveRelated(id, card.relatedCardIds);
  if (Array.isArray(su.replaceSources)) card.sources = su.replaceSources;
  if (su.setSourceQuality != null) card.sourceQuality = su.setSourceQuality;
  if (su.setVerificationStatus != null) card.verificationStatus = su.setVerificationStatus;
  return card;
});

// ---- Report ----
const expected = []; for (let i = 201; i <= 284; i++) expected.push(i);
const nums = adds.map((a) => a.num);
const missing = expected.filter((n) => !nums.includes(n));
const flagshipCount = newCards.filter((c) => c.isFlagship === true).length;

console.log(`================ TR CONTENT ADD ${WRITE ? "APPLY" : "DRY-RUN"} ================`);
console.log("patch files       :", files.length);
console.log("add entries        :", adds.length);
console.log("numeric range      :", Math.min(...nums), "->", Math.max(...nums), "| missing(201-284):", missing.length ? missing.join(",") : "none");
console.log("new flagship/std   :", flagshipCount, "/", adds.length - flagshipCount);
console.log("current TR cards   :", cards.length, "| after add:", cards.length + newCards.length);
console.log("relatedCardIds resolved :", resolvedRelated.length);
for (const r of resolvedRelated) console.log(`   ${r.card}: ${r.from} -> ${r.to}`);
console.log("relatedCardIds unresolved(removed) :", unresolvedRelated.length);
for (const u of unresolvedRelated) console.log(`   ${u.card}: removed ${u.removed}`);

if (WRITE) {
  const merged = cards.concat(newCards);
  fs.writeFileSync(TARGET, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log(`\nWROTE ${path.relative(root, TARGET)} (${merged.length} cards)`);
  console.log("Rebuilding index (content:build-index)...");
  execSync("npm run content:build-index", { cwd: root, stdio: "inherit" });
} else {
  console.log("\n(dry-run; no files written. Re-run with --write to apply.)");
}
