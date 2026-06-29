#!/usr/bin/env node
/**
 * Build data/cards.en.json from the authored English adaptation batches.
 *
 *   node scripts/apply-en-adaptations.mjs            # dry-run (validate + report, no write)
 *   node scripts/apply-en-adaptations.mjs --write    # compose + write data/cards.en.json + rebuild index
 *
 * Source of truth for ENGLISH text:  docs/en-adaptations/batch-NN.json
 * Source of truth for STRUCTURE/IDs: data/cards.tr.json (canonical)
 *
 * Batch files come in two shapes (both supported):
 *   - a flat array of card objects                       (batches 01-03, localized overlays)
 *   - an object { meta, cards: [...] }                   (batches 04-23, full card objects)
 *
 * For each authored id the script clones the TR card (so ids / enums / flags /
 * relatedCardIds stay canonical) and overlays the localized English fields from the
 * batch. Sources prefer the batch version when present (URLs are verified against TR);
 * Turkish-specific characters in source titles/labels are ASCII-folded for the EN file.
 * readingTimeMinutes is recomputed from the English realHistory: max(1, ceil(words/180)).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const TR = path.join(root, "data", "cards.tr.json");
const EN = path.join(root, "data", "cards.en.json");
const STAGE = path.join(root, "docs", "en-adaptations");

// Localized text overlaid from the batch onto the TR clone.
const LOCALIZED_KEYS = [
  "title", "subtitle", "mediaTitle", "era", "region", "themes",
  "whatWeSee", "realHistory", "accuracyNote", "whyInteresting", "misconception",
  "nextTopics", "similarMedia", "mediaConnection", "mediaChanged", "whyItMatters",
  "quickRealityCheck", "spoilerNote", "tags", "reviewerNote",
];
// Optional EN-only enrichment carried over from the previous cards.en.json if present.
const ENRICH_KEYS = ["blocks", "spoilerLine"];
// Non-localized fields that should equal the canonical TR value (warn if a batch differs).
const CANONICAL_KEYS = [
  "mediaType", "difficulty", "verificationStatus", "sourceQuality", "accuracyType",
  "spoilerLevel", "isFlagship", "isPremium", "lastReviewedAt", "relatedCardIds",
];
const REQUIRED_NONEMPTY = ["title", "subtitle", "mediaTitle", "mediaType", "whatWeSee", "realHistory", "quickRealityCheck", "accuracyNote"];
const REQUIRED_ARRAYS = ["themes", "tags", "sources"]; // must be non-empty arrays
const MUST_BE_ARRAY = ["relatedCardIds", "nextTopics", "similarMedia"]; // arrays, but may be empty / absent
const STRING_FIELDS = ["title", "subtitle", "whatWeSee", "realHistory", "accuracyNote", "whyInteresting", "misconception", "mediaConnection", "mediaChanged", "whyItMatters", "quickRealityCheck", "spoilerNote"];

// Matches the production gate (scripts/validate-en-content.js).
const TR_HARD = /[ıİğĞşŞ]/;
// Broader Turkish-diacritic set (reported as warnings; may be legitimate foreign names).
const TR_SOFT = /[öÖüÜçÇ]/;

const FOLD = { "ı": "i", "İ": "I", "ğ": "g", "Ğ": "G", "ş": "s", "Ş": "S", "ö": "o", "Ö": "O", "ü": "u", "Ü": "U", "ç": "c", "Ç": "C" };
const asciiFold = (s) => String(s).replace(/[ıİğĞşŞöÖüÜçÇ]/g, (m) => FOLD[m]);

const wc = (s) => (String(s || "").trim().match(/\S+/g) || []).length;
const rt = (s) => Math.max(1, Math.ceil(wc(s) / 180));
const headings = (s) => String(s || "").split("###").length - 1;
const fail = (m) => { console.error(`\nFATAL: ${m}`); process.exit(1); };
const sourcesUrlKey = (arr) => (Array.isArray(arr) ? arr.map((s) => s && s.url).join("|") : "");

// ---- Load canonical TR + previous EN ----
const tr = JSON.parse(fs.readFileSync(TR, "utf8"));
const trById = new Map(tr.map((c) => [c.id, c]));
const trIds = new Set(trById.keys());
const prevEn = fs.existsSync(EN) ? JSON.parse(fs.readFileSync(EN, "utf8")) : [];
const prevEnById = new Map(prevEn.map((c) => [c.id, c]));

// ---- Load batches (strict batch-NN.json; ignore "batch-11 (1).json" etc.) ----
const allFiles = fs.existsSync(STAGE) ? fs.readdirSync(STAGE) : [];
const batchFiles = allFiles.filter((f) => /^batch-\d{2}\.json$/.test(f)).sort();
const ignoredFiles = allFiles.filter((f) => f.endsWith(".json") && !/^batch-\d{2}\.json$/.test(f));

const authored = new Map();
const dupAcrossBatches = [];
for (const f of batchFiles) {
  let parsed;
  try { parsed = JSON.parse(fs.readFileSync(path.join(STAGE, f), "utf8")); }
  catch (e) { fail(`invalid JSON in ${f}: ${e.message}`); }
  const cards = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.cards) ? parsed.cards : null;
  if (!cards) fail(`${f}: neither an array nor { cards: [...] }`);
  for (const o of cards) {
    if (!o || !o.id) fail(`${f}: an entry has no id`);
    if (!trIds.has(o.id)) fail(`${f}: id ${o.id} not present in TR`);
    if (authored.has(o.id)) dupAcrossBatches.push(`${o.id} (in ${authored.get(o.id)._file} and ${f})`);
    else authored.set(o.id, { ...o, _file: f });
  }
}
if (dupAcrossBatches.length) fail(`duplicate ids across batches:\n  ${dupAcrossBatches.join("\n  ")}`);

// ---- Build cards ----
const warn = { canonicalDrift: [], sourceUrlDrift: [], foldedSourceTitles: [], softTr: [], shortStandard: [] };
const err = { missingField: [], badType: [], invalidRelated: [], hardTr: [], thinFlagship: [], fewHeadings: [] };

function buildCard(id) {
  const batch = authored.get(id);
  const base = structuredClone(trById.get(id));

  // overlay localized text
  for (const k of LOCALIZED_KEYS) {
    if (batch[k] !== undefined) base[k] = batch[k];
  }

  // sources: prefer batch when provided, else TR; fold Turkish chars in title/label
  let sources = Array.isArray(batch.sources) ? batch.sources : base.sources;
  if (Array.isArray(batch.sources)) {
    if (sourcesUrlKey(batch.sources) !== sourcesUrlKey(base.sources)) {
      warn.sourceUrlDrift.push(`${id}`);
      sources = base.sources; // keep canonical TR URLs; never invent
    }
  }
  sources = (sources || []).map((s) => {
    const out = { ...s };
    for (const tf of ["title", "label"]) {
      if (typeof out[tf] === "string" && /[ıİğĞşŞöÖüÜçÇ]/.test(out[tf])) {
        const folded = asciiFold(out[tf]);
        warn.foldedSourceTitles.push(`${id}: "${out[tf]}" -> "${folded}"`);
        out[tf] = folded;
      }
    }
    return out;
  });
  base.sources = sources;

  // recompute reading time from English realHistory
  base.readingTimeMinutes = rt(base.realHistory);

  // carry over optional EN-only enrichment if the previous EN had it
  const prev = prevEnById.get(id);
  if (prev) for (const k of ENRICH_KEYS) if (prev[k] !== undefined && base[k] === undefined) base[k] = prev[k];

  // canonical-drift warnings (batch differs from TR on a non-localized field)
  for (const k of CANONICAL_KEYS) {
    if (batch[k] !== undefined && JSON.stringify(batch[k]) !== JSON.stringify(base[k])) {
      warn.canonicalDrift.push(`${id}.${k} (batch ${JSON.stringify(batch[k])} vs TR ${JSON.stringify(base[k])})`);
    }
  }
  return base;
}

function validate(card) {
  for (const f of REQUIRED_NONEMPTY) {
    const v = card[f];
    if (v == null || (typeof v === "string" && v.trim() === "")) err.missingField.push(`${card.id}.${f}`);
  }
  for (const f of REQUIRED_ARRAYS) {
    if (!Array.isArray(card[f]) || card[f].length === 0) err.missingField.push(`${card.id}.${f}`);
  }
  for (const f of STRING_FIELDS) {
    if (card[f] !== undefined && typeof card[f] !== "string") err.badType.push(`${card.id}.${f}`);
  }
  for (const f of [...REQUIRED_ARRAYS, ...MUST_BE_ARRAY]) {
    if (card[f] !== undefined && !Array.isArray(card[f])) err.badType.push(`${card.id}.${f}`);
  }
  for (const r of card.relatedCardIds || []) if (!trIds.has(r)) err.invalidRelated.push(`${card.id} -> ${r}`);

  // Turkish-char scan across localized text (incl. era/region) + tags + source titles/labels
  const scanHard = (val, label) => {
    if (typeof val === "string") {
      if (TR_HARD.test(val)) err.hardTr.push(`${card.id}.${label}`);
      if (TR_SOFT.test(val)) warn.softTr.push(`${card.id}.${label}`);
    } else if (Array.isArray(val)) val.forEach((x, i) => scanHard(x, `${label}[${i}]`));
  };
  for (const k of [...LOCALIZED_KEYS]) scanHard(card[k], k);
  (card.sources || []).forEach((s, i) => { scanHard(s.title, `sources[${i}].title`); scanHard(s.label, `sources[${i}].label`); });

  if (card.isFlagship === true) {
    if (wc(card.realHistory) < 400) err.thinFlagship.push(`${card.id} (${wc(card.realHistory)}w)`);
    if (headings(card.realHistory) < 2) err.fewHeadings.push(`${card.id} (${headings(card.realHistory)} headings)`);
  } else {
    if (wc(card.realHistory) < 90) warn.shortStandard.push(`${card.id} (${wc(card.realHistory)}w)`);
  }
}

// ---- Compose in TR order ----
const composed = [];
const notAuthored = [];
for (const t of tr) {
  if (authored.has(t.id)) { const c = buildCard(t.id); validate(c); composed.push(c); }
  else notAuthored.push(t.id);
}
const droppedOrphans = prevEn.filter((c) => !trIds.has(c.id)).map((c) => c.id);
const flagCount = composed.filter((c) => c.isFlagship === true).length;

// ---- Report ----
const P = (label, arr, cap = 60) => console.log(`${label}: ${arr.length}${arr.length ? "\n   " + arr.slice(0, cap).join("\n   ") + (arr.length > cap ? `\n   ...(+${arr.length - cap} more)` : "") : ""}`);
console.log(`================ APPLY EN ADAPTATIONS ${WRITE ? "WRITE" : "DRY-RUN"} ================`);
console.log("batch files (applied):", batchFiles.length, `(${batchFiles.join(", ")})`);
console.log("ignored batch files  :", ignoredFiles.length, ignoredFiles.length ? `(${ignoredFiles.join(", ")})` : "");
console.log("authored cards       :", authored.size);
console.log("TR cards             :", tr.length, "| previous EN:", prevEn.length, "| composed EN:", composed.length);
console.log("flagship / standard  :", flagCount, "/", composed.length - flagCount);
console.log("not-authored TR ids  :", notAuthored.length, notAuthored.length && notAuthored.length <= 30 ? `(${notAuthored.join(", ")})` : "");
console.log("orphans dropped      :", droppedOrphans.join(", ") || "(none)");

console.log("\n--- HARD validation (blocks --write) ---");
P("missing required fields", err.missingField);
P("wrong field types", err.badType);
P("invalid relatedCardIds", err.invalidRelated);
P("Turkish-char leaks (ıİğĞşŞ)", err.hardTr);
P("thin flagships (<400w)", err.thinFlagship);
P("flagships <2 headings", err.fewHeadings);

console.log("\n--- warnings (non-blocking) ---");
P("canonical drift (batch vs TR)", warn.canonicalDrift);
P("source URL drift (kept TR)", warn.sourceUrlDrift);
P("source titles ASCII-folded", warn.foldedSourceTitles);
P("soft Turkish diacritics (öÖüÜçÇ)", warn.softTr);
P("short standard cards (<90w)", warn.shortStandard);

const hardErr = err.missingField.length + err.badType.length + err.invalidRelated.length + err.hardTr.length + err.thinFlagship.length + err.fewHeadings.length + notAuthored.length;

if (WRITE) {
  if (hardErr) fail(`${hardErr} hard issue(s) present; fix before --write`);
  fs.writeFileSync(EN, JSON.stringify(composed, null, 2) + "\n", "utf8");
  console.log(`\nWROTE ${path.relative(root, EN)} (${composed.length} cards)`);
  console.log("Rebuilding card index (content:build-index)...");
  execSync("npm run content:build-index", { cwd: root, stdio: "inherit" });
} else {
  console.log(hardErr ? `\n(dry-run; ${hardErr} hard issue(s) would block --write.)` : "\n(dry-run; clean — ready for --write.)");
}
