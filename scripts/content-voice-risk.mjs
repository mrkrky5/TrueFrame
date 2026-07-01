#!/usr/bin/env node
/**
 * Voice / style risk scoring — detects AI-template tone, not word count.
 *   node scripts/content-voice-risk.mjs
 *   node scripts/content-voice-risk.mjs --min 4
 *   node scripts/content-voice-risk.mjs --json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FORBIDDEN_PATTERNS, EN_FORBIDDEN } from "./content-quality-signals.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** Never auto-flag for voice pass (reference tier). */
export const GOLD_REFERENCE_IDS = new Set(["ac-odyssey-athens"]);

const VOICE_CLOSURE_PATTERNS = [
  { id: "populer-anlatilar", re: /Popüler anlatılar/gi, weight: 3 },
  { id: "dengeli-okuma", re: /Daha dengeli tarihsel okuma/gi, weight: 3 },
  { id: "dizi-hissettirir", re: /(Dizi|Oyun) .{0,40} hissettirir[^.]*;\s*(gerçek )?tarih/gi, weight: 3 },
  { id: "tarihsel-agirlik", re: /Tarihsel ağırlık ise/gi, weight: 2 },
  { id: "gercek-tarih-ise", re: /gerçek tarih ise/gi, weight: 2 },
  { id: "sahne-duyguyu", re: /Bu okuma, sahnenin kurduğu duyguyu bozmaz/gi, weight: 3 },
  { id: "asil-merak-ekran", re: /asıl merak, ekrandaki/gi, weight: 3 },
  { id: "hizli-okunur-kilar", re: /hızlı okunur kılar/gi, weight: 2 },
];

const VOICE_CLOSURE_EN = [
  { id: "popular-accounts", re: /Popular (accounts|narratives)/gi, weight: 3 },
  { id: "balanced-reading", re: /more balanced historical reading/gi, weight: 3 },
  { id: "series-makes-you", re: /(The series|The show|The game) .{0,50} (makes you feel|leans on)/gi, weight: 3 },
  { id: "history-shows", re: /history (shows|teaches|tells)/gi, weight: 2 },
  { id: "historical-weight", re: /The historical weight/gi, weight: 2 },
  { id: "real-history-is", re: /real history (is|shows|suggests)/gi, weight: 2 },
  { id: "screen-version", re: /screen version chooses sharp images/gi, weight: 3 },
  { id: "reduces-uncertainty", re: /reduces uncertainty/gi, weight: 2 },
];
const SHOGUN_NEXT_TOPICS = ["Daimyo Siyaseti", "Yabancı Denizciler", "Cizvit Misyonları"];
const SHOGUN_NEXT_TOPICS_EN = ["Daimyo Politics", "Foreign Sailors", "Jesuit Missions"];

const TEXT_FIELDS = [
  "whatWeSee",
  "realHistory",
  "mediaChanged",
  "whyItMatters",
  "whyInteresting",
  "misconception",
  "accuracyNote",
  "mediaConnection",
  "quickRealityCheck",
];

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function longestSharedSubstring(a, b, minLen = 48) {
  const x = norm(a);
  const y = norm(b);
  if (!x || !y) return null;
  for (let len = Math.min(x.length, y.length); len >= minLen; len--) {
    for (let i = 0; i <= x.length - len; i++) {
      const sub = x.slice(i, i + len);
      if (y.includes(sub)) return sub;
    }
  }
  return null;
}

function hasConcreteAnchor(text) {
  if (/\b(MÖ|MS)\s*\d|\b\d{3,4}\b|yüzyıl/i.test(text)) return true;
  if (/###\s+\S/.test(text)) return true;
  if (/\b(The Met|Britannica|House of Wisdom|Parthenon|Chroma|Sekigahara|Tokugawa|Ieyasu)\b/i.test(text)) return true;
  return false;
}

function mediaHookMissing(card) {
  const body = card.realHistory || "";
  const media = card.mediaTitle || "";
  if (!media || body.length < 80) return false;
  const tokens = media.split(/[\s:–—-]+/).filter((t) => t.length > 3);
  if (!tokens.length) return false;
  const hit = tokens.some((t) => body.toLowerCase().includes(t.toLowerCase()));
  return !hit;
}

export function buildBatchStats(cards) {
  const themeKeyCount = new Map();
  const nextTopicsKeyCount = new Map();
  for (const c of cards) {
    const tk = JSON.stringify(c.themes || []);
    themeKeyCount.set(tk, (themeKeyCount.get(tk) || 0) + 1);
    const nk = JSON.stringify(c.nextTopics || []);
    nextTopicsKeyCount.set(nk, (nextTopicsKeyCount.get(nk) || 0) + 1);
  }
  return { themeKeyCount, nextTopicsKeyCount };
}

export function scoreVoiceRisk(card, batchStats, locale = "tr") {
  if (GOLD_REFERENCE_IDS.has(card.id)) {
    return { score: 0, tier: "reference", hits: [], id: card.id, title: card.title };
  }

  const text = TEXT_FIELDS.map((k) => card[k]).filter(Boolean).join("\n");
  let score = 0;
  const hits = [];

  const patterns =
    locale === "en"
      ? [...EN_FORBIDDEN, ...VOICE_CLOSURE_EN]
      : [...FORBIDDEN_PATTERNS, ...VOICE_CLOSURE_PATTERNS];

  for (const p of patterns) {
    const m = text.match(p.re);
    if (m) {
      score += p.weight * m.length;
      hits.push({ id: p.id, count: m.length });
    }
  }

  const echo = longestSharedSubstring(card.mediaChanged, card.whyItMatters);
  if (echo) {
    score += 3;
    hits.push({ id: "mediaChanged-echoes-whyItMatters", count: 1 });
  }

  const misc = norm(card.misconception);
  if (misc.length > 40 && norm(card.realHistory).includes(misc.slice(0, Math.min(60, misc.length)))) {
    score += 2;
    hits.push({ id: "misconception-in-realHistory", count: 1 });
  }

  if (card.id?.startsWith("tf26-")) {
    const tk = JSON.stringify(card.themes || []);
    if ((batchStats.themeKeyCount.get(tk) || 0) >= 8) {
      score += 2;
      hits.push({ id: "batch-themes-copy", count: 1 });
    }
    const nk = JSON.stringify(card.nextTopics || []);
    if ((batchStats.nextTopicsKeyCount.get(nk) || 0) >= 8) {
      score += 2;
      hits.push({ id: "batch-nextTopics-copy", count: 1 });
    }
    if (
      card.mediaTitle === "Shogun" &&
      JSON.stringify(card.nextTopics || []) ===
        JSON.stringify(locale === "en" ? SHOGUN_NEXT_TOPICS_EN : SHOGUN_NEXT_TOPICS)
    ) {
      score += 1;
      hits.push({ id: "shogun-template-nextTopics", count: 1 });
    }
  }

  if (!hasConcreteAnchor(card.realHistory || "")) {
    score += 2;
    hits.push({ id: "no-concrete-anchor", count: 1 });
  }

  if (mediaHookMissing(card)) {
    score += 2;
    hits.push({ id: "media-hook-missing", count: 1 });
  }

  let tier = "low";
  if (score >= 6) tier = "high";
  else if (score >= 4) tier = "medium";

  return { id: card.id, title: card.title, score, tier, hits };
}

export function auditVoiceRisk(locale = "tr") {
  const file = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(file, "utf8"));
  const batchStats = buildBatchStats(cards);
  const results = cards.map((c) => scoreVoiceRisk(c, batchStats, locale));
  const high = results.filter((r) => r.tier === "high");
  const medium = results.filter((r) => r.tier === "medium");
  return { locale, total: cards.length, high, medium, results };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const minScore = Number(process.argv.find((a) => a.startsWith("--min="))?.split("=")[1] ?? 4);
  const asJson = process.argv.includes("--json");
  const locales = process.argv.includes("--en-only") ? ["en"] : process.argv.includes("--tr-only") ? ["tr"] : ["tr", "en"];

  const reports = {};
  for (const locale of locales) {
    const audit = auditVoiceRisk(locale);
    const flagged = audit.results.filter((r) => r.score >= minScore && r.tier !== "reference");
    reports[locale] = {
      summary: {
        total: audit.total,
        high: audit.high.length,
        medium: audit.medium.length,
        flagged: flagged.length,
      },
      flagged: flagged.sort((a, b) => b.score - a.score).slice(0, 40),
    };
  }

  if (asJson) console.log(JSON.stringify({ minScore, ...reports }, null, 2));
  else {
    for (const locale of locales) {
      const r = reports[locale];
      console.log(`\nVoice risk (${locale.toUpperCase()}) — min score ${minScore}`);
      console.log(`total=${r.summary.total}  high=${r.summary.high}  medium=${r.summary.medium}  flagged=${r.summary.flagged}`);
      console.log("Top flagged:");
      for (const row of r.flagged.slice(0, 15)) {
        console.log(`  ${row.score} ${row.tier.padEnd(6)} ${row.id} — ${row.title}`);
        if (row.hits.length) console.log(`         ${row.hits.map((h) => h.id).join(", ")}`);
      }
    }
  }
}
