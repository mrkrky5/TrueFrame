#!/usr/bin/env node
/**
 * Mechanical content quality audit — read-only over data/cards.*.json.
 * Produces a per-entry risk ranking (no AI, no content edits).
 *
 *   node scripts/content-quality-audit.mjs
 *
 * Outputs:
 *   docs/content-quality-audit.csv   — human triage (sorted by riskScore desc)
 *   docs/content-quality-audit.json  — full scores + reasons + highRiskShortlist
 *
 * Reuses boilerplate pattern lists from content-quality-signals.mjs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FORBIDDEN_PATTERNS,
  EN_FORBIDDEN,
  endsClause,
  isTurkishDistributive,
} from "./content-quality-signals.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Main long-form/summary fields used for textual signals.
const MAIN_TEXT_FIELDS = [
  "realHistory",
  "mediaChanged",
  "whatWeSee",
  "quickRealityCheck",
  "accuracyNote",
  "whyItMatters",
  "whyInteresting",
  "misconception",
  "subtitle",
  "mediaConnection",
];

// Fields compared against realHistory for cross-field duplication.
const SUMMARY_FIELDS = [
  "whyInteresting",
  "misconception",
  "whyItMatters",
  "quickRealityCheck",
  "accuracyNote",
  "whatWeSee",
];

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/["'“”‘’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSentences(text) {
  return (text || "")
    .split(/\n+|(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function tokenize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function shingles(tokens, n = 5) {
  const out = [];
  for (let i = 0; i + n <= tokens.length; i++) out.push(tokens.slice(i, i + n).join(" "));
  return out;
}

function percentile(sortedAsc, p) {
  if (!sortedAsc.length) return 0;
  const idx = Math.min(sortedAsc.length - 1, Math.max(0, Math.floor((p / 100) * sortedAsc.length)));
  return sortedAsc[idx];
}

// --- Per-entry raw feature extraction (no corpus context yet) ---
function extractFeatures(card, locale) {
  const fieldTexts = {};
  for (const f of MAIN_TEXT_FIELDS) {
    if (typeof card[f] === "string" && card[f].trim()) fieldTexts[f] = card[f];
  }
  const joined = Object.values(fieldTexts).join("\n");

  // Sentence map: normalized key (>=40 chars) -> { count, fields:Set }
  const sentMap = new Map();
  for (const [field, text] of Object.entries(fieldTexts)) {
    for (const sentence of splitSentences(text)) {
      const key = norm(sentence).slice(0, 90);
      if (key.length < 40) continue;
      const rec = sentMap.get(key) || { count: 0, fields: new Set() };
      rec.count += 1;
      rec.fields.add(field);
      sentMap.set(key, rec);
    }
  }
  let crossFieldDupes = 0;
  let repeatedSentences = 0;
  for (const rec of sentMap.values()) {
    if (rec.fields.size >= 2) crossFieldDupes += 1;
    else if (rec.count >= 2) repeatedSentences += 1;
  }

  // Grammar / repetition artifacts.
  const rawTokens = joined.split(/\s+/).filter(Boolean);
  let adjacentRepeat = 0;
  let doubling = 0;
  for (let i = 0; i + 1 < rawTokens.length; i++) {
    // Words separated by sentence/clause punctuation are not a contiguous
    // merge/duplication artifact (e.g. "görünür. Görünümleri", "gerçekçidir; gerçek").
    if (endsClause(rawTokens[i])) continue;
    const a = rawTokens[i].toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    const b = rawTokens[i + 1].toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    if (a.length >= 3 && a === b) {
      adjacentRepeat += 1;
    } else if (a.length >= 6 && b.length >= 6 && a !== b && a.slice(0, 5) === b.slice(0, 5)) {
      // e.g. "olduğu olduğudur" — but skip valid Turkish distributives
      // like "insandan insana" / "limandan limana".
      if (isTurkishDistributive(a, b)) continue;
      doubling += 1;
    }
  }
  const rh = (card.realHistory || "").trim();
  const unterminated = rh.length > 0 && !/[.!?…"'”’)]$/.test(rh) ? 1 : 0;

  // Boilerplate (reused pattern lists).
  const patterns = locale === "tr" ? FORBIDDEN_PATTERNS : [...FORBIDDEN_PATTERNS, ...EN_FORBIDDEN];
  let boilerplateHits = 0;
  let boilerplateWeight = 0;
  for (const p of patterns) {
    const m = joined.match(p.re);
    if (m) {
      boilerplateHits += m.length;
      boilerplateWeight += p.weight * m.length;
    }
  }

  // Sources.
  const sources = Array.isArray(card.sources) ? card.sources : [];
  const sourceCount = sources.length;
  const domains = new Set();
  let verifiedCount = 0;
  for (const s of sources) {
    if (s?.verified === true) verifiedCount += 1;
    if (typeof s?.url === "string") {
      const m = s.url.match(/^https?:\/\/([^/]+)/i);
      if (m) domains.add(m[1].replace(/^www\./i, "").toLowerCase());
    }
  }
  const uniqueDomains = domains.size;
  const verifiedRatio = sourceCount ? verifiedCount / sourceCount : 0;
  const weakSourceQuality = card.sourceQuality === "weak";

  // Specificity proxy (per 100 words).
  const wordCount = tokenize(joined).length;
  const years = (joined.match(/\b\d{3,4}\b/g) || []).length + (joined.match(/\bM[ÖS]\b/g) || []).length;
  const numbers = (joined.match(/\b\d+\b/g) || []).length;
  const properNouns = (joined.match(/\b[A-ZÇĞİÖŞÜ][\p{L}0-9'’]{2,}\b/gu) || []).length;
  const specificityScore = wordCount ? ((years * 2 + numbers + properNouns) / wordCount) * 100 : 0;

  // Structure.
  const totalLen = joined.length;
  const paragraphCount = rh ? rh.split(/\n{2,}/).filter((s) => s.trim()).length : 0;
  const hasSummary = Boolean(card.quickRealityCheck || card.accuracyNote || card.whatWeSee);
  const missingRealHistory = rh.length === 0;

  // Shingle set for corpus template overlap.
  const shingleSet = new Set(shingles(tokenize(rh)));

  return {
    id: card.id,
    locale,
    title: card.title || "",
    mediaTitle: card.mediaTitle || "",
    isFlagship: Boolean(card.isFlagship),
    crossFieldDupes,
    repeatedSentences,
    adjacentRepeat,
    doubling,
    unterminated,
    boilerplateHits,
    boilerplateWeight,
    sourceCount,
    uniqueDomains,
    verifiedRatio,
    weakSourceQuality,
    specificityScore,
    wordCount,
    totalLen,
    paragraphCount,
    hasSummary,
    missingRealHistory,
    shingleSet,
    textPreview: norm(rh || joined).slice(0, 220),
  };
}

// --- Corpus stats per locale ---
function corpusStats(features) {
  const lens = features.map((f) => f.totalLen);
  const mean = lens.reduce((a, b) => a + b, 0) / (lens.length || 1);
  const variance = lens.reduce((a, b) => a + (b - mean) ** 2, 0) / (lens.length || 1);
  const std = Math.sqrt(variance) || 1;

  const specSorted = features.map((f) => f.specificityScore).sort((a, b) => a - b);
  const specP10 = percentile(specSorted, 10);
  const specP25 = percentile(specSorted, 25);

  // Shingle document frequency.
  const df = new Map();
  for (const f of features) {
    for (const sh of f.shingleSet) df.set(sh, (df.get(sh) || 0) + 1);
  }
  return { mean, std, specP10, specP25, df };
}

// --- Scoring with corpus context ---
function scoreEntry(f, stats) {
  const reasons = [];
  const detectedIssues = [];
  let score = 0;
  const add = (tag, weight, detail) => {
    score += weight;
    reasons.push({ tag, weight, detail });
    detectedIssues.push({ signal: tag, ...detail });
  };

  // Pervasive systemic signals (down-weighted; they accumulate but don't auto-promote tier).
  if (f.crossFieldDupes > 0) add("cross-field-dupe", 1.5 * f.crossFieldDupes, { count: f.crossFieldDupes });
  if (f.sourceCount > 0 && f.verifiedRatio === 0) add("unverified-sources", 0.5, { verifiedRatio: 0 });

  // Rarer, sharper artifacts.
  if (f.repeatedSentences > 0) add("repeated-sentence", 2 * f.repeatedSentences, { count: f.repeatedSentences });
  if (f.doubling > 0) add("grammar-doubling", 2 * f.doubling, { count: f.doubling });
  if (f.adjacentRepeat > 0) add("adjacent-word-repeat", 1.5 * f.adjacentRepeat, { count: f.adjacentRepeat });
  if (f.unterminated) add("unterminated-text", 1, { count: 1 });
  if (f.boilerplateWeight > 0) add("boilerplate", f.boilerplateWeight, { hits: f.boilerplateHits });

  if (f.missingRealHistory) add("missing-realHistory", 6, { count: 1 });
  if (f.sourceCount === 0) add("no-sources", 4, { count: 0 });
  else if (f.sourceCount === 1) add("single-source", 1, { count: 1 });
  if (f.weakSourceQuality) add("weak-source-quality", 1, {});

  if (!f.missingRealHistory) {
    if (f.specificityScore <= stats.specP10) add("low-specificity", 3, { specificityScore: round(f.specificityScore, 1) });
    else if (f.specificityScore <= stats.specP25) add("low-specificity", 2, { specificityScore: round(f.specificityScore, 1) });
  }

  const lengthZ = (f.totalLen - stats.mean) / stats.std;
  if (lengthZ < -1.5) add("too-short", 2, { lengthZ: round(lengthZ, 2) });
  else if (lengthZ > 2.5) add("bloated", 1, { lengthZ: round(lengthZ, 2) });
  if (!f.hasSummary) add("missing-summary", 2, { count: 1 });

  // Template/corpus overlap.
  let shared = 0;
  for (const sh of f.shingleSet) if ((stats.df.get(sh) || 0) > 1) shared += 1;
  const templateOverlapPct = f.shingleSet.size ? Math.round((shared / f.shingleSet.size) * 100) : 0;
  if (templateOverlapPct >= 70) add("high-template-overlap", 3, { templateOverlapPct });
  else if (templateOverlapPct >= 50) add("high-template-overlap", 2, { templateOverlapPct });
  else if (templateOverlapPct >= 35) add("high-template-overlap", 1, { templateOverlapPct });

  // Tier. Hard flags are reserved for rare/serious issues so HIGH stays an
  // actionable AI shortlist; pervasive dataset-wide signals only push the score.
  const hardFlag = f.missingRealHistory || f.sourceCount === 0 || f.doubling >= 1;
  let riskTier = "LOW";
  if (hardFlag || score >= 9) riskTier = "HIGH";
  else if (score >= 5) riskTier = "MED";

  const topReasons = [...reasons]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((r) => {
      const n = r.detail.count ?? r.detail.hits ?? r.detail.templateOverlapPct;
      return n !== undefined ? `${r.tag}(${n})` : r.tag;
    });

  return { ...f, score, riskTier, lengthZ, templateOverlapPct, topReasons, detectedIssues };
}

function round(n, d = 2) {
  const m = 10 ** d;
  return Math.round(n * m) / m;
}

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// --- Run ---
const locales = ["tr", "en"];
const all = [];
const perLocale = {};

for (const locale of locales) {
  const cards = readJson(`data/cards.${locale}.json`);
  const features = cards.map((c) => extractFeatures(c, locale));
  const stats = corpusStats(features);
  const scored = features.map((f) => scoreEntry(f, stats));
  perLocale[locale] = scored;
  all.push(...scored);
}

all.sort((a, b) => b.score - a.score);

// CSV.
const CSV_COLUMNS = [
  "id",
  "locale",
  "title",
  "mediaTitle",
  "isFlagship",
  "riskScore",
  "riskTier",
  "crossFieldDupes",
  "templateOverlapPct",
  "boilerplateHits",
  "sourceCount",
  "uniqueDomains",
  "verifiedRatio",
  "specificityScore",
  "grammarFlags",
  "lengthZ",
  "topReasons",
];

const csvLines = [CSV_COLUMNS.join(",")];
for (const e of all) {
  csvLines.push(
    [
      e.id,
      e.locale,
      e.title,
      e.mediaTitle,
      e.isFlagship,
      e.score,
      e.riskTier,
      e.crossFieldDupes,
      e.templateOverlapPct,
      e.boilerplateHits,
      e.sourceCount,
      e.uniqueDomains,
      round(e.verifiedRatio, 2),
      round(e.specificityScore, 1),
      e.adjacentRepeat + e.doubling + e.unterminated,
      round(e.lengthZ, 2),
      e.topReasons.join("; "),
    ]
      .map(csvCell)
      .join(",")
  );
}

const docsDir = path.join(root, "docs");
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, "content-quality-audit.csv"), csvLines.join("\n") + "\n", "utf8");

// JSON (full + shortlist).
const toEntry = (e) => ({
  id: e.id,
  locale: e.locale,
  title: e.title,
  mediaTitle: e.mediaTitle,
  isFlagship: e.isFlagship,
  riskScore: e.score,
  riskTier: e.riskTier,
  crossFieldDupes: e.crossFieldDupes,
  repeatedSentences: e.repeatedSentences,
  grammarFlags: e.adjacentRepeat + e.doubling + e.unterminated,
  boilerplateHits: e.boilerplateHits,
  sourceCount: e.sourceCount,
  uniqueDomains: e.uniqueDomains,
  verifiedRatio: round(e.verifiedRatio, 2),
  specificityScore: round(e.specificityScore, 1),
  templateOverlapPct: e.templateOverlapPct,
  lengthZ: round(e.lengthZ, 2),
  paragraphCount: e.paragraphCount,
  topReasons: e.topReasons,
  detectedIssues: e.detectedIssues,
});

const highRiskShortlist = all
  .filter((e) => e.riskTier === "HIGH")
  .map((e) => ({
    id: e.id,
    locale: e.locale,
    title: e.title,
    mediaTitle: e.mediaTitle,
    riskScore: e.score,
    topReasons: e.topReasons,
    textPreview: e.textPreview,
    detectedIssues: e.detectedIssues,
  }));

const counts = (arr) => ({
  total: arr.length,
  HIGH: arr.filter((e) => e.riskTier === "HIGH").length,
  MED: arr.filter((e) => e.riskTier === "MED").length,
  LOW: arr.filter((e) => e.riskTier === "LOW").length,
});

const summary = {
  generatedAt: new Date().toISOString(),
  perLocale: { tr: counts(perLocale.tr), en: counts(perLocale.en) },
  overall: counts(all),
};

fs.writeFileSync(
  path.join(docsDir, "content-quality-audit.json"),
  JSON.stringify({ summary, entries: all.map(toEntry), highRiskShortlist }, null, 2) + "\n",
  "utf8"
);

// Console summary.
console.log(JSON.stringify(summary, null, 2));
console.log("\nTop 15 highest-risk:");
for (const e of all.slice(0, 15)) {
  console.log(`  [${e.riskTier}] ${e.score}  ${e.locale}  ${e.id} — ${e.title}`);
  console.log(`        ${e.topReasons.join("; ")}`);
}
console.log("\nWritten: docs/content-quality-audit.csv, docs/content-quality-audit.json");
