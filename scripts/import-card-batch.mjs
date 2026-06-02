#!/usr/bin/env node
/**
 * Toplu kart: kalite kontrolü + içe aktarma.
 *
 *   node scripts/import-card-batch.mjs batch.json              # QC raporu (yazmaz)
 *   node scripts/import-card-batch.mjs batch.json --write      # QC geçtiyse yazar
 *   node scripts/import-card-batch.mjs batch.json --write --accept-warnings
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const write = process.argv.includes("--write");
const replace = process.argv.includes("--replace");
const acceptWarnings = process.argv.includes("--accept-warnings");
const batchPath = process.argv.find((a) => a.endsWith(".json") && !a.includes("import-card-batch"));

const VALID_MEDIA = ["game", "film", "series", "book", "general", "other"];
const TR_CHARS_STRICT = /[ğĞıİ]/;
const PLACEHOLDER = /\b(lorem ipsum|TODO|TBD|\[INSERT|placeholder text|xxx+)\b/i;

const REQUIRED = [
  "id",
  "title",
  "subtitle",
  "mediaType",
  "mediaTitle",
  "whatWeSee",
  "realHistory",
  "accuracyNote",
  "whyInteresting",
  "themes",
  "readingTimeMinutes",
  "sources",
  "relatedCardIds",
  "nextTopics",
  "difficulty",
  "verificationStatus",
  "sourceQuality",
  "accuracyType",
  "spoilerLevel",
  "tags",
  "isFlagship",
];

function loadBatch(file) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  if (raw.batches?.length) {
    const tr = raw.batches.find((b) => b.locale === "tr")?.cards ?? [];
    const en = raw.batches.find((b) => b.locale === "en")?.cards ?? [];
    return { meta: raw.meta ?? {}, tr, en };
  }
  if (raw.locale && raw.cards) {
    return {
      meta: raw.meta ?? {},
      tr: raw.locale === "tr" ? raw.cards : [],
      en: raw.locale === "en" ? raw.cards : [],
    };
  }
  throw new Error("Geçersiz format — bkz. docs/icerik-uretim-rehberi.md §11");
}

function wordCount(text) {
  if (!text || typeof text !== "string") return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function isValidId(id) {
  return typeof id === "string" && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(id);
}

function pushIssue(bucket, level, id, message) {
  bucket.push({ level, id, message });
}

/** Şema + kalite — tek kart */
function qcCard(card, locale, ctx) {
  const { errors, warnings, info, allIds, existingIds, relatedPool } = ctx;

  for (const f of REQUIRED) {
    if (card[f] === undefined || card[f] === null || (typeof card[f] === "string" && !card[f].trim())) {
      pushIssue(errors, "P0", card.id, `${locale}: zorunlu alan eksik → ${f}`);
    }
  }

  if (card.id && !isValidId(card.id)) {
    pushIssue(errors, "P0", card.id, `${locale}: id formatı geçersiz (küçük harf, tire)`);
  }

  if (card.id && allIds.has(card.id)) {
    pushIssue(errors, "P0", card.id, `${locale}: batch içinde tekrarlayan id`);
  }
  allIds.add(card.id);

  if (card.id && existingIds.has(card.id) && !replace) {
    pushIssue(warnings, "P1", card.id, `${locale}: id zaten uygulamada var (atlanır veya --replace)`);
  }

  if (card.mediaType && !VALID_MEDIA.includes(card.mediaType)) {
    pushIssue(errors, "P0", card.id, `${locale}: geçersiz mediaType → ${card.mediaType}`);
  }

  const rhWords = wordCount(card.realHistory);
  if (rhWords < 40) {
    pushIssue(errors, "P0", card.id, `${locale}: realHistory çok kısa (${rhWords} kelime)`);
  } else if (card.isFlagship && rhWords < 350) {
    pushIssue(warnings, "P1", card.id, `${locale}: flagship realHistory kısa (${rhWords} kelime, hedef 400+)`);
  } else if (!card.isFlagship && rhWords < 80) {
    pushIssue(warnings, "P1", card.id, `${locale}: standart kart realHistory kısa (${rhWords} kelime)`);
  }

  const qr = card.quickRealityCheck?.trim() ?? "";
  if (!qr) {
    pushIssue(warnings, "P1", card.id, `${locale}: quickRealityCheck boş (Keşfet önizlemesi zayıf)`);
  } else if (qr.length < 50) {
    pushIssue(warnings, "P1", card.id, `${locale}: quickRealityCheck çok kısa`);
  }

  if (card.isFlagship) {
    if (!card.mediaChanged?.trim()) pushIssue(warnings, "P1", card.id, `${locale}: flagship → mediaChanged eksik`);
    if (!card.whyItMatters?.trim()) pushIssue(warnings, "P1", card.id, `${locale}: flagship → whyItMatters eksik`);
    if (!card.realHistory?.includes("###")) {
      pushIssue(info, "P2", card.id, `${locale}: flagship’te ### alt başlık yok (tek blok da olabilir)`);
    }
  }

  for (const f of ["whatWeSee", "quickRealityCheck", "accuracyNote"]) {
    if (card[f] && PLACEHOLDER.test(card[f])) {
      pushIssue(errors, "P0", card.id, `${locale}: ${f} placeholder / taslak metin`);
    }
  }
  if (card.realHistory && PLACEHOLDER.test(card.realHistory)) {
    pushIssue(errors, "P0", card.id, `${locale}: realHistory placeholder`);
  }

  if (locale === "en") {
    for (const f of ["title", "subtitle", "realHistory", "accuracyNote", "whatWeSee", "quickRealityCheck"]) {
      const t = card[f];
      if (typeof t === "string" && TR_CHARS_STRICT.test(t)) {
        pushIssue(warnings, "P1", card.id, `EN: ${f} içinde Türkçe karakter (ğ/ı/ş/İ)`);
      }
    }
  }

  if (Array.isArray(card.sources)) {
    if (card.sources.length === 0) {
      pushIssue(errors, "P0", card.id, `${locale}: kaynak yok`);
    } else {
      for (const [i, s] of card.sources.entries()) {
        if (!s?.url || !/^https?:\/\//i.test(s.url)) {
          pushIssue(errors, "P0", card.id, `${locale}: sources[${i}] geçersiz URL`);
        }
        if (!s?.title?.trim()) {
          pushIssue(warnings, "P1", card.id, `${locale}: sources[${i}] başlıksız`);
        }
      }
    }
  }

  if (Array.isArray(card.relatedCardIds)) {
    for (const rid of card.relatedCardIds) {
      if (!relatedPool.has(rid) && !existingIds.has(rid)) {
        pushIssue(warnings, "P1", card.id, `${locale}: relatedCardId yok → ${rid}`);
      }
    }
  }

  const estMin = Math.max(1, Math.round(rhWords / 180));
  const stated = Number(card.readingTimeMinutes);
  if (stated && Math.abs(stated - estMin) > 4) {
    pushIssue(
      info,
      "P2",
      card.id,
      `${locale}: readingTimeMinutes=${stated}, metne göre ~${estMin} dk önerilir`
    );
  }
}

function qcParity(trMap, enMap, errors, warnings) {
  const trIds = new Set(trMap.keys());
  const enIds = new Set(enMap.keys());
  for (const id of trIds) {
    if (!enIds.has(id)) pushIssue(errors, "P0", id, "TR var, EN yok");
  }
  for (const id of enIds) {
    if (!trIds.has(id)) pushIssue(errors, "P0", id, "EN var, TR yok");
  }
  for (const id of trIds) {
    if (!enIds.has(id)) continue;
    const tr = trMap.get(id);
    const en = enMap.get(id);
    if (Boolean(tr.isFlagship) !== Boolean(en.isFlagship)) {
      pushIssue(warnings, "P1", id, `isFlagship uyuşmuyor TR=${tr.isFlagship} EN=${en.isFlagship}`);
    }
    if (tr.mediaType !== en.mediaType) {
      pushIssue(warnings, "P1", id, `mediaType uyuşmuyor TR=${tr.mediaType} EN=${en.mediaType}`);
    }
    if (tr.spoilerLevel !== en.spoilerLevel) {
      pushIssue(warnings, "P1", id, `spoilerLevel uyuşmuyor`);
    }
    if (tr.accuracyType !== en.accuracyType) {
      pushIssue(warnings, "P1", id, `accuracyType uyuşmuyor`);
    }
  }
}

function printIssues(title, list, limit = 15) {
  if (!list.length) return;
  console.log(`\n${title} (${list.length})`);
  for (const x of list.slice(0, limit)) {
    console.log(`  [${x.level}] ${x.id}: ${x.message}`);
  }
  if (list.length > limit) console.log(`  … +${list.length - limit} tane daha`);
}

function mergeCards(existing, incoming, locale, errors) {
  const map = new Map(existing.map((c) => [c.id, c]));
  let added = 0;
  let updated = 0;
  let skipped = 0;
  const mergeErrors = [];

  for (const card of incoming) {
    const hasP0 = errors.some((e) => e.level === "P0" && e.id === card.id);
    if (hasP0) {
      mergeErrors.push(`${locale}/${card.id}: P0 hataları — atlandı`);
      continue;
    }
    if (map.has(card.id)) {
      if (replace) {
        map.set(card.id, card);
        updated++;
      } else {
        skipped++;
      }
    } else {
      map.set(card.id, card);
      added++;
    }
  }

  return { cards: [...map.values()], added, updated, skipped, mergeErrors };
}

// ── main ──

if (!batchPath) {
  console.error("Kullanım: node scripts/import-card-batch.mjs <batch.json> [--write] [--accept-warnings] [--replace]");
  process.exit(1);
}

const batchFile = path.isAbsolute(batchPath) ? batchPath : path.join(process.cwd(), batchPath);
const { meta, tr: incomingTr, en: incomingEn } = loadBatch(batchFile);

const trPath = path.join(root, "data", "cards.tr.json");
const enPath = path.join(root, "data", "cards.en.json");
const existingTr = JSON.parse(fs.readFileSync(trPath, "utf8"));
const existingEn = JSON.parse(fs.readFileSync(enPath, "utf8"));
const existingTrIds = new Set(existingTr.map((c) => c.id));
const existingEnIds = new Set(existingEn.map((c) => c.id));

const trMap = new Map(incomingTr.map((c) => [c.id, c]));
const enMap = new Map(incomingEn.map((c) => [c.id, c]));
const allTrIds = new Set();
const allEnIds = new Set();

const errors = [];
const warnings = [];
const info = [];

const relatedPoolTr = new Set([...trMap.keys(), ...existingTrIds]);
const relatedPoolEn = new Set([...enMap.keys(), ...existingEnIds]);

for (const card of incomingTr) {
  qcCard(card, "tr", {
    errors,
    warnings,
    info,
    allIds: allTrIds,
    existingIds: existingTrIds,
    relatedPool: relatedPoolTr,
  });
}
for (const card of incomingEn) {
  qcCard(card, "en", {
    errors,
    warnings,
    info,
    allIds: allEnIds,
    existingIds: existingEnIds,
    relatedPool: relatedPoolEn,
  });
}
qcParity(trMap, enMap, errors, warnings);

const flagshipTr = incomingTr.filter((c) => c.isFlagship).length;
const avgWordsTr =
  incomingTr.length > 0
    ? Math.round(incomingTr.reduce((s, c) => s + wordCount(c.realHistory), 0) / incomingTr.length)
    : 0;

console.log("═══════════════════════════════════════");
console.log("  True Frame — toplu içerik kalite kontrolü");
console.log("═══════════════════════════════════════\n");
if (meta.task) console.log(`Görev: ${meta.task}`);
console.log(`Dosya: ${batchFile}`);
console.log(`Gelen: TR ${incomingTr.length} · EN ${incomingEn.length}`);
if (meta.expectedTr) {
  const ok = incomingTr.length === meta.expectedTr && incomingEn.length === (meta.expectedEn ?? meta.expectedTr);
  console.log(`Beklenen: ${meta.expectedTr}×2 ${ok ? "✓" : "⚠ sayı uyuşmuyor"}`);
}
console.log(`\nÖzet kalite:`);
console.log(`  Flagship (TR): ${flagshipTr} / ${incomingTr.length} (${incomingTr.length ? Math.round((flagshipTr / incomingTr.length) * 100) : 0}%)`);
console.log(`  Ortalama realHistory (TR): ~${avgWordsTr} kelime/kart`);

printIssues("✗ Hatalar (import engellenir)", errors);
printIssues("⚠ Uyarılar (düzeltmen iyi olur)", warnings);
printIssues("ℹ Bilgi", info, 8);

const trResult = mergeCards(existingTr, incomingTr, "tr", errors);
const enResult = mergeCards(existingEn, incomingEn, "en", errors);

console.log(`\n── Import önizlemesi ──`);
console.log(`TR: +${trResult.added} yeni, ${trResult.updated} güncelleme, ${trResult.skipped} çakışma`);
console.log(`EN: +${enResult.added} yeni, ${enResult.updated} güncelleme, ${enResult.skipped} çakışma`);
console.log(`Sonuç: TR ${trResult.cards.length} · EN ${enResult.cards.length} kart`);

const blockWrite = errors.length > 0 || (warnings.length > 0 && !acceptWarnings);

if (!write) {
  console.log("\n── Sonraki adım ──");
  if (blockWrite) {
    console.log("Önce hataları düzelt, sonra tekrar çalıştır.");
    if (warnings.length && !errors.length) {
      console.log("Sadece uyarı varsa: --write --accept-warnings");
    }
  } else {
    console.log("QC temiz → import için:");
    console.log(`  node scripts/import-card-batch.mjs "${batchPath}" --write`);
  }
  process.exit(blockWrite ? 1 : 0);
}

if (blockWrite) {
  console.error("\n✗ --write iptal: önce QC hatalarını gider veya --accept-warnings kullan.");
  process.exit(1);
}

fs.writeFileSync(trPath, `${JSON.stringify(trResult.cards, null, 2)}\n`, "utf8");
fs.writeFileSync(enPath, `${JSON.stringify(enResult.cards, null, 2)}\n`, "utf8");
console.log("\n✓ Yazıldı: data/cards.tr.json, data/cards.en.json");
console.log("  npm run content:audit && npm run mobile:sync && npm run mobile:check");
