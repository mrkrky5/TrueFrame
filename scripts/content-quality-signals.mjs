#!/usr/bin/env node
/**
 * AI / şablon kalite sinyalleri — kart metinlerinde otomatik tarama.
 *   node scripts/content-quality-signals.mjs
 *   node scripts/content-quality-signals.mjs --fail-on-c
 *   node scripts/content-quality-signals.mjs --report
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const failOnC = process.argv.includes("--fail-on-c");
const writeReport = process.argv.includes("--report");

const FORBIDDEN_PATTERNS = [
  { id: "hizla-okunur", re: /hızla okunur hale geldiğine/gi, weight: 3 },
  { id: "dogru-yanlis", re: /doğru-yanlış/gi, weight: 2 },
  { id: "tarih-bize", re: /tarih bize gösterir/gi, weight: 2 },
  { id: "karmaşıklığını gösterir", re: /karmaşıklığını gösterir/gi, weight: 2 },
  { id: "asil-merak", re: /asıl merak, ekrandaki etkinin arkasında/gi, weight: 3 },
  { id: "ekran-anlatısı-keskin", re: /ekran anlatısı .+ keskin görüntüler seçer/gi, weight: 3 },
  { id: "merak uyandırmak için kullanır", re: /merak uyandırmak için kullanır/gi, weight: 2 },
  { id: "en-generic-closure", re: /Bu nedenle .+ asıl merak/gi, weight: 2 },
  { id: "yalnızca ünlü kişilerin", re: /yalnızca ünlü kişilerin kararıyla açıklanamaz/gi, weight: 1 },
  { id: "kayıt tutan kurumlar", re: /kayıt tutan kurumlar, yerel topluluklar/gi, weight: 1 },
  { id: "bayek-sokak", re: /Bayek'in şehir sokaklarında/gi, weight: 1 },
  { id: "bu-kart-anlatı", re: /Bu kart, .+ içindeki .+ anlatısını gerçek tarih bağlamıyla birlikte okur/gi, weight: 2 },
  { id: "daha yavaş, daha dağınık", re: /daha yavaş, daha dağınık/gi, weight: 1 },
  { id: "belirsizliği azaltır", re: /belirsizliği azaltır/gi, weight: 1 },
];

const EN_FORBIDDEN = [
  { id: "screen-version-sharp", re: /screen version chooses sharp images/gi, weight: 3 },
  { id: "history-teaches", re: /history teaches us/gi, weight: 2 },
  { id: "reduces-uncertainty", re: /reduces uncertainty/gi, weight: 1 },
  { id: "slower-messier", re: /slower, messier/gi, weight: 1 },
];

function scoreCard(card, locale) {
  const text = [
    card.whatWeSee,
    card.quickRealityCheck,
    card.mediaChanged,
    card.realHistory,
    card.whyItMatters,
    card.accuracyNote,
  ]
    .filter(Boolean)
    .join("\n");

  let score = 0;
  const hits = [];
  const patterns = locale === "tr" ? FORBIDDEN_PATTERNS : [...FORBIDDEN_PATTERNS, ...EN_FORBIDDEN];

  for (const p of patterns) {
    const matches = text.match(p.re);
    if (matches) {
      score += p.weight * matches.length;
      hits.push({ id: p.id, count: matches.length });
    }
  }

  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  const seen = new Set();
  for (const s of sentences) {
    const key = s.slice(0, 80);
    if (key.length < 40) continue;
    if (seen.has(key)) {
      score += 2;
      hits.push({ id: "duplicate-sentence", count: 1 });
    }
    seen.add(key);
  }

  if (!card.sources?.length) score += 1;
  if (card.isFlagship && !card.realHistory?.trim()) score += 4;

  let tier = "A";
  if (score >= 6) tier = "C";
  else if (score >= 3) tier = "B";

  return { score, tier, hits };
}

function auditLocale(locale) {
  const file = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(file, "utf8"));
  const results = cards.map((c) => ({ id: c.id, title: c.title, ...scoreCard(c, locale) }));
  const cTier = results.filter((r) => r.tier === "C");
  const bTier = results.filter((r) => r.tier === "B");
  return { locale, total: cards.length, cTier, bTier, results };
}

function writeMarkdownReport(tr, en) {
  const lines = [
    "# Content quality report",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    "## Summary",
    "",
    "| Locale | Total | A | B | C |",
    "|--------|-------|---|---|---|",
    `| TR | ${tr.total} | ${tr.total - tr.bTier.length - tr.cTier.length} | ${tr.bTier.length} | ${tr.cTier.length} |`,
    `| EN | ${en.total} | ${en.total - en.bTier.length - en.cTier.length} | ${en.bTier.length} | ${en.cTier.length} |`,
    "",
    "## Top scores (TR)",
    "",
  ];

  const topTr = [...tr.results].sort((a, b) => b.score - a.score).slice(0, 40);
  for (const r of topTr) {
    if (r.score === 0) continue;
    lines.push(`- **${r.id}** (${r.score}, ${r.tier}) — ${r.title}`);
    if (r.hits.length) lines.push(`  - ${r.hits.map((h) => `${h.id}×${h.count}`).join(", ")}`);
  }

  lines.push("", "## Top scores (EN)", "");
  const topEn = [...en.results].sort((a, b) => b.score - a.score).slice(0, 40);
  for (const r of topEn) {
    if (r.score === 0) continue;
    lines.push(`- **${r.id}** (${r.score}, ${r.tier}) — ${r.title}`);
    if (r.hits.length) lines.push(`  - ${r.hits.map((h) => `${h.id}×${h.count}`).join(", ")}`);
  }

  const out = path.join(root, "docs", "content-quality-report.md");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join("\n") + "\n", "utf8");
  console.log(`Report written: ${out}`);
}

const tr = auditLocale("tr");
const en = auditLocale("en");

console.log(
  JSON.stringify(
    {
      summary: {
        tr: { total: tr.total, A: tr.total - tr.bTier.length - tr.cTier.length, B: tr.bTier.length, C: tr.cTier.length },
        en: { total: en.total, A: en.total - en.bTier.length - en.cTier.length, B: en.bTier.length, C: en.cTier.length },
      },
      worstTr: tr.cTier.slice(0, 15).map((r) => ({ id: r.id, score: r.score, hits: r.hits })),
      worstEn: en.cTier.slice(0, 15).map((r) => ({ id: r.id, score: r.score, hits: r.hits })),
      reviewTr: [...tr.results].sort((a, b) => b.score - a.score).slice(0, 10).map((r) => ({
        id: r.id,
        score: r.score,
        tier: r.tier,
        hits: r.hits,
      })),
    },
    null,
    2
  )
);

if (writeReport) writeMarkdownReport(tr, en);

if (failOnC && (tr.cTier.length > 0 || en.cTier.length > 0)) {
  console.error(`\n${tr.cTier.length + en.cTier.length} C-tier kart — düzeltme gerekli.`);
  process.exit(1);
}
