#!/usr/bin/env node
/**
 * Export voice-risk cards for external style rewrite (TR and/or EN).
 *
 *   node scripts/export-voice-pass-chunks.mjs
 *   node scripts/export-voice-pass-chunks.mjs --locale=en
 *   node scripts/export-voice-pass-chunks.mjs --min=6
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { auditVoiceRisk, GOLD_REFERENCE_IDS } from "./content-voice-risk.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const BATCHES_ROOT = path.join(root, "docs", "voice-pass", "batches");
const CHUNKS_ROOT = path.join(root, "docs", "voice-pass", "chunks");

const RUBRIC = { tr: "docs/editorial-voice-rubric.md", en: "docs/editorial-voice-rubric.en.md" };

const CHUNK_SIZE = 15;
const pad3 = (n) => String(n).padStart(3, "0");

const VOICE_EXPORT_FIELDS = [
  "id",
  "title",
  "subtitle",
  "mediaType",
  "mediaTitle",
  "era",
  "region",
  "whatWeSee",
  "realHistory",
  "mediaChanged",
  "whyItMatters",
  "whyInteresting",
  "misconception",
  "accuracyNote",
  "mediaConnection",
  "quickRealityCheck",
  "isFlagship",
];

const INSTRUCTIONS = {
  tr: [
    "Rewrite only localized prose fields to sound human-written in Turkish.",
    "Do not change id, sources, flags, relatedCardIds, or invent new facts.",
    "No template closures (Popüler anlatılar…, Dizi hissettirir; tarih…).",
    "Each paragraph: what the media shows vs what history shows — concrete names/dates.",
    "Fields must not echo each other.",
  ],
  en: [
    "Rewrite only localized prose fields to sound human-written in English.",
    "Do not change id, sources, flags, relatedCardIds, or invent new facts.",
    "No template closures (Popular narratives…, The series makes you feel…, history teaches…).",
    "Each paragraph: what the media shows vs what history shows — concrete names/dates.",
    "Fields must not echo each other.",
    "English-native adaptation, not literal translation from Turkish.",
  ],
};

function parseLocales(argv) {
  const arg = argv.find((a) => a.startsWith("--locale="))?.split("=")[1];
  if (arg === "tr" || arg === "en") return [arg];
  if (argv.includes("--en-only")) return ["en"];
  if (argv.includes("--tr-only")) return ["tr"];
  return ["tr", "en"];
}

function loadPatchedIds(locale) {
  const dir = path.join(BATCHES_ROOT, locale);
  const ids = new Set();
  if (!fs.existsSync(dir)) return ids;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json") && !x.startsWith("."))) {
    const parsed = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const arr = Array.isArray(parsed) ? parsed : parsed?.cards;
    if (!Array.isArray(arr)) continue;
    for (const c of arr) if (c?.id) ids.add(c.id);
  }
  return ids;
}

const TEMPLATE_TR =
  /Popüler anlatılar|Dizi .{0,40} hissettirir|Daha dengeli tarihsel|gerçek tarih ise|Tarihsel ağırlık ise|Bu okuma, sahnenin/i;
const TEMPLATE_EN =
  /Popular (accounts|narratives)|more balanced historical reading|(The series|The show|The game) .{0,50} (makes you feel|leans on)|The historical weight|real history (is|shows|suggests)|screen version chooses sharp images/i;
const PROSE_FIELDS = [
  "whatWeSee",
  "realHistory",
  "mediaChanged",
  "whyItMatters",
  "whyInteresting",
  "misconception",
];

function hasTemplateProse(card, locale) {
  const text = PROSE_FIELDS.map((k) => card[k] || "").join(" ");
  return locale === "en" ? TEMPLATE_EN.test(text) : TEMPLATE_TR.test(text);
}

function findRemainingTemplateIds(locale, cards, trTemplateIds) {
  if (locale === "tr") {
    return cards.filter((c) => !GOLD_REFERENCE_IDS.has(c.id) && hasTemplateProse(c, "tr")).map((c) => c.id);
  }
  const enIds = trTemplateIds.filter((id) => {
    const c = cards.find((x) => x.id === id);
    return c && hasTemplateProse(c, "en");
  });
  const enOnly = cards
    .filter((c) => !GOLD_REFERENCE_IDS.has(c.id) && !trTemplateIds.includes(c.id) && hasTemplateProse(c, "en"))
    .map((c) => c.id);
  return [...enIds, ...enOnly];
}

function writeChunkGroup(locale, group, chunkNo, metaExtra) {
  const cardsPath = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
  const audit = auditVoiceRisk(locale);
  const riskById = new Map(audit.results.map((r) => [r.id, r]));
  const byId = new Map(cards.map((c) => [c.id, c]));
  const outDir = path.join(CHUNKS_ROOT, locale);
  fs.mkdirSync(outDir, { recursive: true });

  const ids = group;
  const payload = {
    meta: {
      purpose: `${locale.toUpperCase()} remaining template-voice cleanup`,
      locale,
      rubric: RUBRIC[locale],
      goldReferenceId: "ac-odyssey-athens",
      sourceFile: `data/cards.${locale}.json`,
      chunkNumber: chunkNo,
      cardCount: group.length,
      ids,
      instructions: INSTRUCTIONS[locale],
      ...metaExtra,
    },
    cards: ids.map((id) => slimCard(byId.get(id), riskById.get(id) || { score: 0, tier: "low", hits: [] })),
  };

  const fileName = `source-chunk-remaining-${pad3(chunkNo)}.json`;
  fs.writeFileSync(path.join(outDir, fileName), JSON.stringify(payload, null, 2) + "\n", "utf8");
  return { fileName, count: group.length, firstId: ids[0], lastId: ids[ids.length - 1], outDir };
}

function exportRemainingTemplate(locales) {
  const trCards = JSON.parse(fs.readFileSync(path.join(root, "data", "cards.tr.json"), "utf8"));
  const trTemplateIds = findRemainingTemplateIds("tr", trCards, []);
  const results = {};

  for (const locale of locales) {
    const cards = JSON.parse(fs.readFileSync(path.join(root, "data", `cards.${locale}.json`), "utf8"));
    const ids =
      locale === "tr" ? trTemplateIds : findRemainingTemplateIds("en", cards, trTemplateIds);
    if (!ids.length) {
      results[locale] = { flagged: 0, written: [], outDir: path.join(CHUNKS_ROOT, locale) };
      continue;
    }

    const written = [];
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const group = ids.slice(i, i + CHUNK_SIZE);
      const chunkNo = Math.floor(i / CHUNK_SIZE) + 1;
      written.push(
        writeChunkGroup(locale, group, chunkNo, {
          exportMode: "remaining-template",
          trTemplateCount: trTemplateIds.length,
        }),
      );
    }
    results[locale] = { flagged: ids.length, written, outDir: written[0]?.outDir };
  }

  return results;
}

function slimCard(card, risk) {
  const out = {};
  for (const k of VOICE_EXPORT_FIELDS) if (card[k] !== undefined) out[k] = card[k];
  out._voiceRisk = { score: risk.score, tier: risk.tier, hits: risk.hits };
  return out;
}

function exportLocale(locale, minScore) {
  const cardsPath = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
  const audit = auditVoiceRisk(locale);
  const riskById = new Map(audit.results.map((r) => [r.id, r]));
  const patchedIds = loadPatchedIds(locale);

  const remaining = cards.filter((c) => {
    if (GOLD_REFERENCE_IDS.has(c.id)) return false;
    if (patchedIds.has(c.id)) return false;
    const risk = riskById.get(c.id);
    return risk && risk.score >= minScore;
  });

  const outDir = path.join(CHUNKS_ROOT, locale);
  fs.mkdirSync(outDir, { recursive: true });

  const groups = [];
  for (let i = 0; i < remaining.length; i += CHUNK_SIZE) {
    groups.push(remaining.slice(i, i + CHUNK_SIZE));
  }

  const written = [];
  let chunkNo = 1;
  let cumulative = patchedIds.size;

  for (const group of groups) {
    const ids = group.map((c) => c.id);
    const payload = {
      meta: {
        purpose: `${locale.toUpperCase()} voice/style rewrite — human tone, not word-count padding`,
        locale,
        rubric: RUBRIC[locale],
        goldReferenceId: "ac-odyssey-athens",
        sourceFile: `data/cards.${locale}.json`,
        chunkNumber: chunkNo,
        cardCount: group.length,
        alreadyPatchedBeforeChunk: cumulative,
        remainingAfterChunk: remaining.length - (cumulative - patchedIds.size + group.length),
        minScore,
        ids,
        instructions: INSTRUCTIONS[locale],
      },
      cards: group.map((c) => slimCard(c, riskById.get(c.id))),
    };

    const fileName = `source-chunk-${pad3(chunkNo)}.json`;
    fs.writeFileSync(path.join(outDir, fileName), JSON.stringify(payload, null, 2) + "\n", "utf8");
    written.push({ fileName, count: group.length, firstId: ids[0], lastId: ids[ids.length - 1] });
    cumulative += group.length;
    chunkNo++;
  }

  return { locale, total: cards.length, patched: patchedIds.size, flagged: remaining.length, written, outDir };
}

const minScore = Number(process.argv.find((a) => a.startsWith("--min="))?.split("=")[1] ?? 4);
const locales = parseLocales(process.argv);
const remainingTemplate = process.argv.includes("--remaining-template");

console.log("============ VOICE PASS EXPORT ============");
if (remainingTemplate) {
  console.log("mode      : remaining-template");
  console.log(`locales   : ${locales.join(", ")}`);
  const results = exportRemainingTemplate(locales);
  for (const locale of locales) {
    const r = results[locale];
    console.log(`\n--- ${locale.toUpperCase()} ---`);
    console.log(`flagged=${r.flagged}  chunks=${r.written.length}`);
    for (const w of r.written) {
      console.log(`  ${w.fileName}  n=${w.count}  ${w.firstId} … ${w.lastId}`);
    }
    if (r.flagged) {
      console.log(`  → ${r.outDir}`);
      console.log(`  rubric: ${RUBRIC[locale]}`);
      console.log(`  return batches to: docs/voice-pass/batches/${locale}/`);
    }
  }
  console.log("\nApply: npm run content:voice:apply -- --write");
  process.exit(0);
}

console.log(`min score : ${minScore}`);
console.log(`locales   : ${locales.join(", ")}`);

for (const locale of locales) {
  const r = exportLocale(locale, minScore);
  console.log(`\n--- ${locale.toUpperCase()} ---`);
  console.log(`total=${r.total}  patched=${r.patched}  flagged=${r.flagged}  chunks=${r.written.length}`);
  for (const w of r.written) {
    console.log(`  ${w.fileName}  n=${w.count}  ${w.firstId} … ${w.lastId}`);
  }
  console.log(`  → ${r.outDir}`);
  console.log(`  rubric: ${RUBRIC[locale]}`);
  console.log(`  return batches to: docs/voice-pass/batches/${locale}/batch-NN.json`);
}

console.log("\nApply: npm run content:voice:apply -- --write");
