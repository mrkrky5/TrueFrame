#!/usr/bin/env node
/**
 * Apply Turkish source-aware editorial patches from docs/newbatches to data/cards.tr.json.
 *
 *   node scripts/apply-tr-editorial-patches.mjs            # dry-run (no writes)
 *   node scripts/apply-tr-editorial-patches.mjs --write    # apply changes
 *
 * Supports three on-disk patch shapes, all targeting Turkish cards:
 *   A) new      : { patchId, entries:[{ id, fields, sourceUpdates? }] }
 *   B) mixed     : { batch, sourceChunks, entries:[{ id, reviewDecision, fields, sourceUpdates? }], approvedAsIs? }
 *   C) legacy    : { patchVersion, chunks, patches:[{ id, set }] }
 *
 * Application semantics (non-destructive shallow merge, unrelated fields preserved):
 *   - entry.fields.*                       -> card.<key>            (replace key)
 *   - entry.sourceUpdates.replaceSources   -> card.sources         (replace array)
 *   - entry.sourceUpdates.setSourceQuality -> card.sourceQuality
 *   - entry.sourceUpdates.setVerificationStatus -> card.verificationStatus
 *   - legacy patch.set.*                   -> card.<key>            (replace key)
 *
 * Fails loudly on: invalid JSON, missing target IDs, unsupported sourceUpdates ops.
 * Reports (does not silently swallow): unknown card fields, duplicate entries across
 * files, and broken relatedCardIds after apply.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const BATCH_DIR = path.join(root, "docs", "newbatches");
const TARGET = path.join(root, "data", "cards.tr.json");

const KNOWN_SOURCE_UPDATE_OPS = new Set([
  "replaceSources",
  "setSourceQuality",
  "setVerificationStatus",
]);

const log = (...a) => console.log(...a);
const fail = (msg) => {
  console.error(`\nFATAL: ${msg}`);
  process.exit(1);
};

// ---- Load target ---------------------------------------------------------
if (!fs.existsSync(TARGET)) fail(`target not found: ${TARGET}`);
const cards = JSON.parse(fs.readFileSync(TARGET, "utf8"));
if (!Array.isArray(cards)) fail("data/cards.tr.json is not a top-level array");
const cardById = new Map();
for (const c of cards) {
  if (cardById.has(c.id)) fail(`duplicate card id in target: ${c.id}`);
  cardById.set(c.id, c);
}
const cardKeySchema = new Set(Object.keys(cards[0]));
const allCardIds = new Set(cards.map((c) => c.id));

// ---- Discover patch files ------------------------------------------------
const files = fs
  .readdirSync(BATCH_DIR)
  .filter((f) => f.toLowerCase().endsWith(".json"))
  .sort();

function chunkRangeFromName(name) {
  // tr_chunk_001 / tr_chunks_003_004 / true-frame-tr-071-072
  const nums = (name.match(/\d{2,3}/g) || []).map(Number).filter((n) => n >= 1 && n <= 82);
  if (!nums.length) return [];
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const out = [];
  for (let i = min; i <= max; i++) out.push(i);
  return out;
}

function detectFormat(json) {
  if (Array.isArray(json.entries)) return "entries";
  if (Array.isArray(json.patches)) return "legacy-set";
  if (Array.isArray(json.cards)) return "cards-replace";
  return "unknown";
}

// Normalize one file into a list of operations: { id, fields, sourceUpdates }
// - entries        : fields applied as-is, sourceUpdates handled separately
// - legacy-set     : `set` object applied directly as fields (may contain sources etc.)
// - cards-replace  : `replace` object applied directly as fields (may contain sources etc.)
function normalizeFile(json, fmt) {
  const ops = [];
  if (fmt === "entries") {
    for (const e of json.entries) {
      ops.push({ id: e.id, fields: e.fields || {}, sourceUpdates: e.sourceUpdates || null, raw: e });
    }
  } else if (fmt === "legacy-set") {
    for (const p of json.patches) {
      ops.push({ id: p.id, fields: p.set || {}, sourceUpdates: null, raw: p });
    }
  } else if (fmt === "cards-replace") {
    for (const c of json.cards) {
      ops.push({ id: c.id, fields: c.replace || {}, sourceUpdates: null, raw: c });
    }
  }
  return ops;
}

// ---- Pass 1: parse, classify, validate -----------------------------------
const report = {
  folder: path.relative(root, BATCH_DIR),
  filesScanned: files.length,
  byFormat: { entries: 0, "legacy-set": 0, "cards-replace": 0, unknown: 0 },
  coveredChunks: new Set(),
  missingIds: [],
  unknownOps: [],
  unknownFields: [],
  duplicateTargets: [],
  approvedAsIs: [],
  perFile: [],
};

const seenTargets = new Map(); // id -> first file
const allOps = [];

for (const file of files) {
  const full = path.join(BATCH_DIR, file);
  let json;
  try {
    json = JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (err) {
    fail(`invalid JSON in ${file}: ${err.message}`);
  }

  if (json.locale && json.locale !== "tr") fail(`${file}: locale is not 'tr' (${json.locale})`);

  const fmt = detectFormat(json);
  report.byFormat[fmt]++;
  if (fmt === "unknown") fail(`${file}: cannot detect patch format (no entries/patches array)`);

  for (const n of chunkRangeFromName(file)) report.coveredChunks.add(n);

  if (Array.isArray(json.approvedAsIs)) {
    for (const a of json.approvedAsIs) {
      report.approvedAsIs.push({ file, id: typeof a === "string" ? a : a.id });
    }
  }

  const ops = normalizeFile(json, fmt);
  const fileIds = [];
  for (const op of ops) {
    if (!op.id || typeof op.id !== "string") fail(`${file}: an entry is missing a string id`);
    fileIds.push(op.id);

    if (!allCardIds.has(op.id)) report.missingIds.push({ file, id: op.id });

    if (seenTargets.has(op.id)) {
      report.duplicateTargets.push({ id: op.id, files: [seenTargets.get(op.id), file] });
    } else {
      seenTargets.set(op.id, file);
    }

    // unknown sourceUpdates ops (potentially destructive) -> fatal
    if (op.sourceUpdates) {
      for (const k of Object.keys(op.sourceUpdates)) {
        if (!KNOWN_SOURCE_UPDATE_OPS.has(k)) {
          report.unknownOps.push({ file, id: op.id, op: k });
        }
      }
    }

    // unknown card fields -> report (non-fatal)
    for (const k of Object.keys(op.fields)) {
      if (!cardKeySchema.has(k)) report.unknownFields.push({ file, id: op.id, field: k });
    }

    allOps.push({ ...op, file });
  }

  report.perFile.push({ file, format: fmt, entries: ops.length, ids: fileIds });
}

if (report.unknownOps.length) {
  fail(
    `unsupported sourceUpdates operations detected:\n` +
      report.unknownOps.map((u) => `  ${u.file} [${u.id}] -> ${u.op}`).join("\n")
  );
}
if (report.missingIds.length) {
  fail(
    `patch IDs not found in data/cards.tr.json:\n` +
      report.missingIds.map((m) => `  ${m.file} -> ${m.id}`).join("\n")
  );
}

// ---- Coverage check ------------------------------------------------------
const missingChunks = [];
for (let i = 1; i <= 82; i++) if (!report.coveredChunks.has(i)) missingChunks.push(i);

// ---- Pass 2: apply (in file-sorted order) --------------------------------
let cardsTouched = new Set();
let fieldWrites = 0;
let sourceReplaces = 0;

function applyOp(op) {
  const card = cardById.get(op.id);
  if (!card) return; // already guarded
  for (const [k, v] of Object.entries(op.fields)) {
    card[k] = v;
    fieldWrites++;
  }
  if (op.sourceUpdates) {
    if (Array.isArray(op.sourceUpdates.replaceSources)) {
      card.sources = op.sourceUpdates.replaceSources;
      sourceReplaces++;
    }
    if (op.sourceUpdates.setSourceQuality != null) card.sourceQuality = op.sourceUpdates.setSourceQuality;
    if (op.sourceUpdates.setVerificationStatus != null)
      card.verificationStatus = op.sourceUpdates.setVerificationStatus;
  }
  cardsTouched.add(op.id);
}

for (const op of allOps) applyOp(op);

// ---- Post-apply: broken relatedCardIds -----------------------------------
const brokenRelated = [];
for (const id of cardsTouched) {
  const card = cardById.get(id);
  if (Array.isArray(card.relatedCardIds)) {
    for (const rid of card.relatedCardIds) {
      if (!allCardIds.has(rid)) brokenRelated.push({ id, relatedCardId: rid });
    }
  }
}

// ---- Output --------------------------------------------------------------
log("================ TR EDITORIAL PATCH " + (WRITE ? "APPLY" : "DRY-RUN") + " ================");
log("folder            :", report.folder);
log("patch files       :", report.filesScanned);
log("formats           :", JSON.stringify(report.byFormat));
log("chunks covered    :", `${report.coveredChunks.size}/82`, missingChunks.length ? `MISSING: ${missingChunks.join(",")}` : "(1-82 complete)");
log("entries total     :", allOps.length);
log("unique target ids :", seenTargets.size);
log("cards touched     :", cardsTouched.size);
log("field writes      :", fieldWrites, "| source replaces:", sourceReplaces);
log("approvedAsIs (noop):", report.approvedAsIs.length);
log("duplicate targets :", report.duplicateTargets.length);
if (report.duplicateTargets.length)
  for (const d of report.duplicateTargets) log("   dup:", d.id, "in", d.files.join(" & "));
log("unknown fields    :", report.unknownFields.length);
if (report.unknownFields.length)
  for (const u of report.unknownFields) log("   field:", u.field, "on", u.id, "(", u.file, ")");
log("broken relatedIds :", brokenRelated.length);
if (brokenRelated.length)
  for (const b of brokenRelated) log("   broken:", b.id, "->", b.relatedCardId);

if (WRITE) {
  fs.writeFileSync(TARGET, JSON.stringify(cards, null, 2) + "\n", "utf8");
  log("\nWROTE:", path.relative(root, TARGET), `(${cards.length} cards)`);
} else {
  log("\n(dry-run; no files written. Re-run with --write to apply.)");
}
