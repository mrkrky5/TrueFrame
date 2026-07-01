#!/usr/bin/env node
/**
 * Apply voice-pass batch rewrites to data/cards.{tr,en}.json
 *
 *   node scripts/apply-voice-patches.mjs
 *   node scripts/apply-voice-patches.mjs --write
 *   node scripts/apply-voice-patches.mjs --locale=en --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { scoreVoiceRisk, buildBatchStats } from "./content-voice-risk.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const BATCHES_ROOT = path.join(root, "docs", "voice-pass", "batches");

const VOICE_KEYS = [
  "title",
  "subtitle",
  "whatWeSee",
  "realHistory",
  "mediaChanged",
  "whyItMatters",
  "whyInteresting",
  "misconception",
  "accuracyNote",
  "mediaConnection",
  "quickRealityCheck",
  "reviewerNote",
];

const wc = (s) => (String(s || "").trim().match(/\S+/g) || []).length;
const rt = (s) => Math.max(1, Math.ceil(wc(s) / 180));
const fail = (m) => {
  console.error(`\nFATAL: ${m}`);
  process.exit(1);
};

function parseLocales(argv) {
  const arg = argv.find((a) => a.startsWith("--locale="))?.split("=")[1];
  if (arg === "tr" || arg === "en") return [arg];
  if (argv.includes("--en-only")) return ["en"];
  if (argv.includes("--tr-only")) return ["tr"];
  return ["tr", "en"];
}

function loadPatches(locale) {
  const dir = path.join(BATCHES_ROOT, locale);
  if (!fs.existsSync(dir)) return null;

  const batchFiles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("."))
    .sort((a, b) => {
      const ar = a.includes("remaining") ? 1 : 0;
      const br = b.includes("remaining") ? 1 : 0;
      if (ar !== br) return ar - br;
      return a.localeCompare(b);
    });
  if (!batchFiles.length) return null;

  const patches = new Map();
  const overwritten = [];
  for (const f of batchFiles) {
    const parsed = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const arr = Array.isArray(parsed) ? parsed : parsed?.cards;
    if (!Array.isArray(arr)) fail(`${locale}/${f}: expected array or { cards: [] }`);
    for (const c of arr) {
      if (!c?.id) fail(`${locale}/${f}: card missing id`);
      if (patches.has(c.id)) overwritten.push({ id: c.id, from: patches.get(c.id)._file, to: f });
      patches.set(c.id, { ...c, _file: f });
    }
  }
  if (overwritten.length) {
    console.log(`  note: ${overwritten.length} duplicate id(s) — later file wins`);
    for (const o of overwritten) console.log(`    ${o.id}: ${o.from} → ${o.to}`);
  }
  return { patches, batchFiles };
}

function applyLocale(locale) {
  const loaded = loadPatches(locale);
  if (!loaded) {
    console.log(`\n--- ${locale.toUpperCase()} --- skipped (no batches in docs/voice-pass/batches/${locale}/)`);
    return null;
  }

  const { patches, batchFiles } = loaded;
  const cardsPath = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(cardsPath, "utf8"));
  const batchStats = buildBatchStats(cards);
  const byId = new Map(cards.map((c) => [c.id, c]));

  const unknown = [...patches.keys()].filter((id) => !byId.has(id));
  if (unknown.length) fail(`${locale}: patch ids not in cards: ${unknown.join(", ")}`);

  let applied = 0;
  let improved = 0;
  const stillRisky = [];

  for (const [id, patch] of patches) {
    const before = scoreVoiceRisk(byId.get(id), batchStats, locale);
    const card = { ...byId.get(id) };
    for (const k of VOICE_KEYS) {
      if (patch[k] !== undefined && patch[k] !== null) card[k] = patch[k];
    }
    if (patch.realHistory) card.readingTimeMinutes = rt(patch.realHistory);
    byId.set(id, card);
    applied++;

    const after = scoreVoiceRisk(card, batchStats, locale);
    if (after.score < before.score) improved++;
    else if (after.score >= 4) stillRisky.push({ id, score: after.score, hits: after.hits.map((h) => h.id) });
  }

  const out = cards.map((c) => byId.get(c.id));

  console.log(`\n--- ${locale.toUpperCase()} ---`);
  console.log(`batch files : ${batchFiles.length}`);
  console.log(`cards       : ${applied}`);
  console.log(`improved    : ${improved}`);
  console.log(`still >= 4  : ${stillRisky.length}`);
  if (stillRisky.length) {
    for (const r of stillRisky.slice(0, 10)) {
      console.log(`  ${r.id} score=${r.score}  ${r.hits.join(", ")}`);
    }
  }

  if (WRITE) {
    fs.writeFileSync(cardsPath, JSON.stringify(out, null, 2) + "\n", "utf8");
    console.log(`Wrote ${cardsPath}`);
  }

  return { locale, applied };
}

console.log("============ VOICE PATCH APPLY ============");
console.log(`mode: ${WRITE ? "WRITE" : "dry-run"}`);

const results = [];
for (const locale of parseLocales(process.argv)) {
  const r = applyLocale(locale);
  if (r) results.push(r);
}

if (!results.length) fail("no batch files found for any locale");

if (WRITE) {
  execSync("node scripts/build-card-index.mjs", { cwd: root, stdio: "inherit" });
  console.log("\nRebuilt card indexes");
} else {
  console.log("\nDry-run only. Re-run with --write to apply.");
}
