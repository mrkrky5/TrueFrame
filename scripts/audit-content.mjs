#!/usr/bin/env node
/**
 * Content QA audit — parity, schema, sources, copy signals.
 * Report-only; exit 1 if P0 issues found.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function readJson(rel) {
  const p = path.join(root, rel);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const cardsTr = readJson("data/cards.tr.json");
const cardsEn = readJson("data/cards.en.json");
const routesTr = readJson("data/routes.tr.json");
const routesEn = readJson("data/routes.en.json");
const dictTr = readJson("lib/dictionaries/tr.json");
const dictEn = readJson("lib/dictionaries/en.json");

const issues = { p0: [], p1: [], p2: [] };

function add(severity, area, id, problem, fix, files = []) {
  const row = { id, area, severity, problem, recommendedFix: fix, files };
  issues[severity === "P0" ? "p0" : severity === "P1" ? "p1" : "p2"].push(row);
}

const trMap = new Map(cardsTr.map((c) => [c.id, c]));
const enMap = new Map(cardsEn.map((c) => [c.id, c]));
const trIds = new Set(trMap.keys());
const enIds = new Set(enMap.keys());

// --- ID parity ---
const onlyTr = [...trIds].filter((id) => !enIds.has(id));
const onlyEn = [...enIds].filter((id) => !trIds.has(id));
if (onlyTr.length) {
  add("P1", "parity", "card-ids", `${onlyTr.length} kart yalnızca TR'de`, "EN çevirisi veya kasıtlı locale-only işareti", ["data/cards.en.json"]);
}
if (onlyEn.length) {
  add("P1", "parity", "card-ids", `${onlyEn.length} kart yalnızca EN'de`, "TR çevirisi veya kasıtlı", ["data/cards.tr.json"]);
}

// --- Route parity ---
const routeTrIds = new Set(routesTr.map((r) => r.id));
const routeEnIds = new Set(routesEn.map((r) => r.id));
for (const id of routeTrIds) {
  if (!routeEnIds.has(id)) add("P1", "parity", id, "Rota TR'de var, EN'de yok", "routes.en.json ekle", ["data/routes.en.json"]);
}
for (const id of routeEnIds) {
  if (!routeTrIds.has(id)) add("P1", "parity", id, "Rota EN'de var, TR'de yok", "routes.tr.json ekle", ["data/routes.tr.json"]);
}

// --- Required fields & empty ---
const REQUIRED = ["title", "mediaTitle", "mediaType"];
const CONTENT_FIELDS = [
  "title",
  "subtitle",
  "whatWeSee",
  "quickRealityCheck",
  "realHistory",
  "accuracyNote",
  "mediaChanged",
];

function isEmpty(v) {
  return v == null || (typeof v === "string" && v.trim() === "");
}

function auditCards(cards, locale) {
  const ids = new Set();
  for (const card of cards) {
    if (ids.has(card.id)) add("P0", "schema", card.id, "Duplicate card id", "Birleştir veya id değiştir", [`data/cards.${locale}.json`]);
    ids.add(card.id);

    for (const f of REQUIRED) {
      if (isEmpty(card[f])) add("P0", "schema", card.id, `Missing required field: ${f} (${locale})`, "Doldur", [`data/cards.${locale}.json`]);
    }

    const summary = card.accuracyNote || card.quickRealityCheck || card.whatWeSee;
    if (isEmpty(summary)) {
      add("P1", "schema", card.id, `No reality summary field (${locale})`, "accuracyNote veya quickRealityCheck ekle", [`data/cards.${locale}.json`]);
    }

    if (isEmpty(card.realHistory)) {
      add("P0", "schema", card.id, `Empty realHistory (${locale})`, "İçerik ekle", [`data/cards.${locale}.json`]);
    }

    if (!card.readingTimeMinutes || card.readingTimeMinutes < 1) {
      add("P2", "schema", card.id, `Suspicious readingTimeMinutes: ${card.readingTimeMinutes}`, "Düzelt", [`data/cards.${locale}.json`]);
    }

    if (!Array.isArray(card.sources) || card.sources.length === 0) {
      add("P1", "sources", card.id, `No sources (${locale})`, "En az bir güvenilir kaynak ekle", [`data/cards.${locale}.json`]);
    } else {
      for (const [i, s] of card.sources.entries()) {
        if (isEmpty(s?.title)) add("P1", "sources", card.id, `Source[${i}] missing title`, "Başlık ekle", [`data/cards.${locale}.json`]);
        if (isEmpty(s?.url)) add("P0", "sources", card.id, `Source[${i}] missing url`, "URL ekle", [`data/cards.${locale}.json`]);
        else if (!/^https?:\/\//i.test(s.url)) add("P1", "sources", card.id, `Source[${i}] malformed url: ${s.url}`, "https URL kullan", [`data/cards.${locale}.json`]);
      }
    }

    if (card.realHistory?.includes("###")) {
      // OK if mobile/web parse — flag only if raw ### in short fields
    }
    for (const f of ["whatWeSee", "quickRealityCheck", "accuracyNote", "mediaChanged"]) {
      if (card[f]?.includes("###")) {
        add("P1", "copy", card.id, `Markdown ### in ${f} (${locale})`, "Düz metin veya parser", [`data/cards.${locale}.json`]);
      }
    }

    if (card.relatedCardIds?.length) {
      const pool = locale === "tr" ? trIds : enIds;
      for (const rid of card.relatedCardIds) {
        if (!pool.has(rid)) add("P1", "schema", card.id, `Invalid relatedCardId: ${rid} (${locale})`, "Düzelt veya kaldır", [`data/cards.${locale}.json`]);
      }
    }

    const validMedia = ["game", "film", "series", "book", "general", "other"];
    if (card.mediaType && !validMedia.includes(card.mediaType)) {
      add("P1", "schema", card.id, `Invalid mediaType: ${card.mediaType}`, "Enum düzelt", [`data/cards.${locale}.json`]);
    }

    if (card.isFlagship && !card.contentBlocks?.length && !card.experienceLevel) {
      // check-mobile uses experienceLevel flagship
    }
    if ((card.isFlagship || card.experienceLevel === "flagship") && locale === "tr") {
      if (!card.contentBlocks?.length && isEmpty(card.realHistory)) {
        add("P0", "schema", card.id, "Flagship without contentBlocks or realHistory (TR)", "İçerik ekle", ["data/cards.tr.json"]);
      } else if (!card.contentBlocks?.length) {
        add(
          "P2",
          "schema",
          card.id,
          "Flagship uses runtime-derived blocks (no contentBlocks JSON)",
          "İsteğe bağlı: contentBlocks yaz veya deriveCardBlocks yeterli",
          ["data/cards.tr.json"]
        );
      }
    }
  }
}

auditCards(cardsTr, "tr");
auditCards(cardsEn, "en");

// Cross-locale field presence for shared IDs
for (const id of trIds) {
  if (!enIds.has(id)) continue;
  const tr = trMap.get(id);
  const en = enMap.get(id);
  if (tr.isFlagship !== en.isFlagship) {
    add("P1", "parity", id, `isFlagship mismatch TR=${tr.isFlagship} EN=${en.isFlagship}`, "Hizala", ["data/cards.tr.json", "data/cards.en.json"]);
  }
  if (tr.mediaType !== en.mediaType) {
    add("P1", "parity", id, `mediaType mismatch`, "Hizala", ["data/cards.tr.json", "data/cards.en.json"]);
  }
}

// Turkish in EN (unique chars only — avoid false positives from validate-en-content)
const TR_CHARS = /[ıİğĞşŞöÖüÜçÇ]/;
for (const card of cardsEn) {
  for (const f of CONTENT_FIELDS) {
    const t = card[f];
    if (typeof t === "string" && TR_CHARS.test(t)) {
      add("P1", "parity", card.id, `Turkish chars in EN field ${f}`, "İngilizce metin", ["data/cards.en.json"]);
    }
  }
}

// English leakage in TR titles (heuristic: common EN-only patterns in long text fields)
const EN_LEAK = /\b(the|and|was|were|their|which|because|however)\b/i;
for (const card of cardsTr) {
  if (card.realHistory && EN_LEAK.test(card.realHistory) && !/[ıİğĞşŞ]/.test(card.realHistory)) {
    const words = card.realHistory.split(/\s+/).length;
    if (words > 40) {
      // weak signal — only P2
      add("P2", "parity", card.id, "TR realHistory may contain English-heavy prose", "Manuel okuma", ["data/cards.tr.json"]);
    }
  }
}

// Dictionary key parity
function flatKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) keys.push(...flatKeys(v, p));
    else keys.push(p);
  }
  return keys;
}
const dTr = new Set(flatKeys(dictTr));
const dEn = new Set(flatKeys(dictEn));
for (const k of dTr) {
  if (!dEn.has(k)) add("P2", "dictionary", k, "Key in TR dict missing in EN", "en.json ekle", ["lib/dictionaries/en.json"]);
}
for (const k of dEn) {
  if (!dTr.has(k)) add("P2", "dictionary", k, "Key in EN dict missing in TR", "tr.json ekle", ["lib/dictionaries/tr.json"]);
}

// Sample: cards with quickRealityCheck but no accuracyNote (lite reader was broken before — now fixed)
let qrOnlyTr = 0;
let qrOnlyEn = 0;
for (const c of cardsTr) {
  if (c.quickRealityCheck && !c.accuracyNote && !c.whatWeSee) qrOnlyTr++;
}
for (const c of cardsEn) {
  if (c.quickRealityCheck && !c.accuracyNote && !c.whatWeSee) qrOnlyEn++;
}

// Print report
console.log(JSON.stringify({
  summary: {
    cardsTr: cardsTr.length,
    cardsEn: cardsEn.length,
    onlyTr: onlyTr.length,
    onlyEn: onlyEn.length,
    routesTr: routesTr.length,
    routesEn: routesEn.length,
    qrOnlySummaryTr: qrOnlyTr,
    qrOnlySummaryEn: qrOnlyEn,
    p0: issues.p0.length,
    p1: issues.p1.length,
    p2: issues.p2.length,
  },
  onlyTr: onlyTr.slice(0, 30),
  onlyEn: onlyEn.slice(0, 30),
  issues,
}, null, 2));

process.exit(issues.p0.length > 0 ? 1 : 0);
