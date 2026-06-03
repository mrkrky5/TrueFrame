#!/usr/bin/env node
/**
 * tf26 batch QA — 0 token öncelik listesi (script + retire + AI hedefleri).
 *
 *   node scripts/audit-tf26.mjs
 *   node scripts/audit-tf26.mjs --export-slices   # docs/incoming/tf26-<block>.json
 *
 * Çıktılar:
 *   docs/tf26-audit.json
 *   docs/tf26-priority.csv
 *   docs/tf26-retire.csv
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const exportSlices = process.argv.includes("--export-slices");

const TR_STOP = new Set([
  "ve", "bir", "için", "olan", "ile", "bu", "da", "de", "mi", "mı", "the", "and", "of", "in",
  "the", "a", "an", "to", "on", "at", "how", "why", "what",
]);

const TEMPLATE_CHECKS = [
  { id: "whatWeSee_meta", weight: 2, re: /bu kart|birlikte okur|başlığını .+ (yerleştirir|sunar)/i, fields: ["whatWeSee"] },
  { id: "whatWeSee_template", weight: 2, re: /sahnede nasıl hızla okunur|gündelik akışına yerleştirir/i, fields: ["whatWeSee"] },
  { id: "closure", weight: 3, re: /Bu nedenle .+ asıl merak|dikkatli bir başlangıç olarak okunmalıdır/i, fields: ["realHistory"] },
  { id: "flagship_mc", weight: 2, re: /Ekran anlatısı .+ keskin görüntüler seçer/i, fields: ["mediaChanged", "realHistory"] },
  { id: "why_template", weight: 2, re: /merak uyandırmak için kullanır; tarihsel bağlam/i, fields: ["whyItMatters"] },
  { id: "generic_section", weight: 1, re: /### Sahnenin arkasındaki uzun süreç|### Bugünden bakınca neden önemli/i, fields: ["realHistory"] },
  { id: "kleopatra_block", weight: 4, re: /Kleopatra VII, Ptolemaios hanedanı, rahipler ve yazıcılar/i, fields: ["realHistory"] },
  { id: "arthur_loop", weight: 2, re: /Arthur veya John'un kamp, kasaba, tren hattı/i, fields: ["whatWeSee", "realHistory"] },
  { id: "subtitle_truncated", weight: 1, re: /…$/, fields: ["subtitle"] },
  { id: "mediaChanged_mismatch", weight: 2, re: /tapınak, vergi, yazı/i, fields: ["mediaChanged"], when: (c) => !/tapınak|mısır|roma antik|yunan/i.test(c.title || "") },
];

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function tokenize(s) {
  if (!s) return [];
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9ğüşıöçâîû]+/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !TR_STOP.has(w));
}

function titleOverlap(a, b) {
  const ta = new Set(tokenize(a));
  const tb = new Set(tokenize(b));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const w of ta) if (tb.has(w)) inter++;
  return inter / Math.min(ta.size, tb.size);
}

function slugify(s) {
  return (s || "unknown")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function countTemplates(card) {
  const hits = [];
  let score = 0;
  for (const check of TEMPLATE_CHECKS) {
    if (check.when && !check.when(card)) continue;
    for (const field of check.fields) {
      const text = card[field];
      if (typeof text === "string" && check.re.test(text)) {
        hits.push(check.id);
        score += check.weight;
        break;
      }
    }
  }
  return { score, hits: [...new Set(hits)] };
}

function findLegacyDuplicate(tf26, legacySameMedia) {
  let best = null;
  let bestScore = 0;
  for (const leg of legacySameMedia) {
    const overlap = titleOverlap(tf26.title, leg.title);
    const slugMatch =
      tf26.id.split("-").slice(2).join("-") &&
      leg.id.includes(tf26.id.split("-").slice(2).join("-").slice(0, 12));
    const score = overlap + (slugMatch ? 0.25 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = leg;
    }
  }
  if (best && bestScore >= 0.35) return { legacy: best, overlap: Math.round(bestScore * 100) };
  return null;
}

function decideAction(row) {
  if (row.legacyDuplicate && row.legacyOverlap >= 40) {
    const leg = row.legacyCard;
    const legSources = leg?.sources?.length ?? 0;
    const tfSources = row.sources;
    if (legSources >= 2 && (tfSources < 2 || row.templateScore >= 4)) {
      return "retire_duplicate";
    }
  }
  if (row.templateScore >= 6 || (row.flagship && row.templateScore >= 4)) return "ai_full";
  if (row.templateScore >= 3) return "ai_fields";
  if (row.sources < 2) return "script_sources";
  return "defer";
}

function csvEscape(v) {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function writeCsv(filePath, headers, rows) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

const cardsTr = readJson("data/cards.tr.json");
const cardsEn = readJson("data/cards.en.json");
const enIds = new Set(cardsEn.map((c) => c.id));

const legacy = cardsTr.filter((c) => !c.id.startsWith("tf26-"));
const tf26 = cardsTr.filter((c) => c.id.startsWith("tf26-"));

const legacyByMedia = new Map();
for (const c of legacy) {
  const key = (c.mediaTitle || "").trim();
  if (!legacyByMedia.has(key)) legacyByMedia.set(key, []);
  legacyByMedia.get(key).push(c);
}

const rows = tf26.map((card) => {
  const media = (card.mediaTitle || "").trim();
  const { score: templateScore, hits: templateHits } = countTemplates(card);
  const dup = findLegacyDuplicate(card, legacyByMedia.get(media) || []);
  const sources = card.sources?.length ?? 0;
  const flagship = !!(card.isFlagship || card.experienceLevel === "flagship");
  const hasEn = enIds.has(card.id);

  const row = {
    id: card.id,
    title: card.title,
    mediaTitle: media,
    block: slugify(media),
    flagship: flagship ? "yes" : "no",
    sources,
    hasEn: hasEn ? "yes" : "no",
    templateScore,
    templateHits: templateHits.join("|"),
    legacyDuplicate: dup?.legacy.id ?? "",
    legacyTitle: dup?.legacy.title ?? "",
    legacyOverlap: dup?.overlap ?? 0,
    legacyCard: dup?.legacy ?? null,
    readingTimeMinutes: card.readingTimeMinutes ?? "",
  };

  row.action = decideAction({
    ...row,
    legacyCard: dup?.legacy,
    flagship,
  });

  row.priority =
    (row.action === "retire_duplicate" ? 100 : 0) +
    (row.action === "ai_full" ? 50 : row.action === "ai_fields" ? 30 : 0) +
    templateScore * 3 +
    (flagship ? 10 : 0) +
    (sources < 2 ? 5 : 0) +
    (hasEn ? 0 : 8);

  row.aiFields =
    row.action === "ai_full"
      ? "subtitle,whatWeSee,realHistory,mediaChanged,whyItMatters,accuracyNote,sources"
      : row.action === "ai_fields"
        ? "subtitle,whatWeSee,mediaChanged,whyItMatters,sources"
        : row.action === "script_sources"
          ? "sources"
          : "";

  return row;
});

rows.sort((a, b) => b.priority - a.priority);

const summary = {
  generatedAt: new Date().toISOString(),
  total: rows.length,
  byAction: Object.fromEntries(
    ["retire_duplicate", "ai_full", "ai_fields", "script_sources", "defer"].map((k) => [
      k,
      rows.filter((r) => r.action === k).length,
    ])
  ),
  byBlock: Object.fromEntries(
    [...new Set(rows.map((r) => r.block))].map((block) => [
      block,
      rows.filter((r) => r.block === block).length,
    ])
  ),
  top25Ai: rows
    .filter((r) => r.action === "ai_full" || r.action === "ai_fields")
    .slice(0, 25)
    .map(({ id, title, action, aiFields, block, priority }) => ({ id, title, action, aiFields, block, priority })),
};

const docsDir = path.join(root, "docs");
const incomingDir = path.join(docsDir, "incoming");
fs.mkdirSync(incomingDir, { recursive: true });

const auditRows = rows.map(({ legacyCard, ...r }) => r);
fs.writeFileSync(path.join(docsDir, "tf26-audit.json"), `${JSON.stringify({ summary, cards: auditRows }, null, 2)}\n`, "utf8");

const csvHeaders = [
  "priority",
  "action",
  "id",
  "title",
  "mediaTitle",
  "block",
  "flagship",
  "sources",
  "hasEn",
  "templateScore",
  "templateHits",
  "legacyDuplicate",
  "legacyTitle",
  "legacyOverlap",
  "aiFields",
  "readingTimeMinutes",
];

writeCsv(path.join(docsDir, "tf26-priority.csv"), csvHeaders, auditRows);

const retireRows = auditRows.filter((r) => r.action === "retire_duplicate");
writeCsv(path.join(docsDir, "tf26-retire.csv"), csvHeaders, retireRows);

if (exportSlices) {
  const cardMap = new Map(tf26.map((c) => [c.id, c]));
  const byBlock = new Map();
  for (const row of rows) {
    if (row.action === "retire_duplicate" || row.action === "defer") continue;
    if (!byBlock.has(row.block)) byBlock.set(row.block, []);
    byBlock.get(row.block).push(row);
  }
  for (const [block, blockRows] of byBlock) {
    const ids = blockRows.map((r) => r.id);
    const slice = {
      meta: { block, mediaTitle: blockRows[0]?.mediaTitle, forAi: blockRows.map((r) => ({ id: r.id, action: r.action, aiFields: r.aiFields })) },
      cards: ids.map((id) => {
        const c = cardMap.get(id);
        return {
          id: c.id,
          title: c.title,
          subtitle: c.subtitle,
          mediaTitle: c.mediaTitle,
          whatWeSee: c.whatWeSee,
          quickRealityCheck: c.quickRealityCheck,
          mediaChanged: c.mediaChanged,
          whyItMatters: c.whyItMatters,
          accuracyNote: c.accuracyNote,
          misconception: c.misconception,
          isFlagship: c.isFlagship,
          sources: c.sources,
          realHistory: (c.realHistory || "").length > 1200 ? `${(c.realHistory || "").slice(0, 1200)}…[trim for AI; full in repo]` : c.realHistory,
        };
      }),
    };
    fs.writeFileSync(path.join(incomingDir, `tf26-${block}.json`), `${JSON.stringify(slice, null, 2)}\n`, "utf8");
  }
}

console.log("tf26 audit");
console.log(JSON.stringify(summary, null, 2));
console.log(`\nWrote docs/tf26-priority.csv (${auditRows.length} rows)`);
console.log(`Wrote docs/tf26-retire.csv (${retireRows.length} retire candidates)`);
console.log(`Wrote docs/tf26-audit.json`);
if (exportSlices) {
  const n = fs.readdirSync(incomingDir).filter((f) => f.startsWith("tf26-") && f.endsWith(".json")).length;
  console.log(`Exported ${n} slice(s) to docs/incoming/tf26-<block>.json`);
} else {
  console.log("\nAI paketleri için: node scripts/audit-tf26.mjs --export-slices");
}
