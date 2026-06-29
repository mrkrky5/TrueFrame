#!/usr/bin/env node
/**
 * Detects repeated bulk-generation artifacts across the catalog.
 *
 * Default (dry-run, report-only — does NOT modify content):
 *   node scripts/content-mechanical-cleanup-preview.mjs
 *
 * Safe write mode (applies ONLY issues with safeToAutoFix === true):
 *   node scripts/content-mechanical-cleanup-preview.mjs --write --only-safe
 *   - validates the safe-candidate count matches the last dry-run preview
 *   - removes verbatim-duplicate mediaChanged sentences
 *   - fixes broken function/participle doublings (e.g. "olduğu olduğu")
 *   - never touches anything marked safeToAutoFix === false
 *
 * Outputs:
 *   docs/content-mechanical-cleanup-preview.md
 *   docs/content-mechanical-cleanup-preview.json
 *
 * Artifact types (from docs/high-risk-content-review.md):
 *   1. grammar doubling: "olduğu olduğudur", prefix-doubling, exact adjacent word dup
 *   2. summary fields (whyInteresting/misconception/whyItMatters) pasted into realHistory
 *   3. quickRealityCheck question dumped into realHistory
 *   4. mangled whyItMatters template ("Bu başlık, ... medya anlatısından ayrı okumayı sağlar")
 *   5. duplicated mediaChanged / duplicated realHistory paragraph
 *   6. truncated or broken short fields (quickRealityCheck)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { endsClause, isTurkishDistributive } from "./content-quality-signals.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const ARGS = new Set(process.argv.slice(2));
const WRITE = ARGS.has("--write");
const ONLY_SAFE = ARGS.has("--only-safe");

// Turkish reduplication is highly productive: almost ANY noun can be doubled to mean
// "X by X" (dönem dönem, şehir şehir, liman liman, sahne sahne, kelime kelime), and many
// words are emphatic/distributive reduplications (tekrar tekrar, yavaş yavaş, ilmek ilmek).
// So an exact adjacent duplicate is NOT auto-fixable in general. Only function/participle
// words that are never validly reduplicated count as broken template artifacts.
const BROKEN_DOUBLE_WORDS = new Set([
  "olduğu", "olduğunu", "olduğudur", "olan", "olarak", "ise", "ve", "ki",
  "bir", "bu", "şu", "için", "ile", "gibi", "daha",
]);

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
}

function norm(s) {
  return (s || "")
    .toLocaleLowerCase("tr")
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

function snippet(s, max = 90) {
  const t = (s || "").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max - 1) + "…";
}

const issues = [];
function record(card, locale, field, issueType, current, action, confidence, safeToAutoFix) {
  issues.push({
    id: card.id,
    locale,
    title: card.title || "",
    field,
    issueType,
    currentSnippet: snippet(current),
    proposedAction: action,
    confidence,
    safeToAutoFix,
  });
}

function auditCard(card, locale) {
  const realHistory = typeof card.realHistory === "string" ? card.realHistory : "";
  const rhNorm = norm(realHistory);

  // --- 1a. Grammar doubling: literal "olduğu olduğudur" and prefix-doubling merges ---
  const tokens = realHistory.split(/\s+/).filter(Boolean);
  const seenDouble = new Set();
  for (let i = 0; i + 1 < tokens.length; i++) {
    if (endsClause(tokens[i])) continue; // not a contiguous pair across a clause boundary
    const a = tokens[i].toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]/gu, "");
    const b = tokens[i + 1].toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]/gu, "");
    if (!a || !b) continue;
    const pairKey = `${a}|${b}`;
    if (a === b && a.length >= 4) {
      if (seenDouble.has(pairKey)) continue;
      seenDouble.add(pairKey);
      const broken = BROKEN_DOUBLE_WORDS.has(a);
      record(
        card, locale, "realHistory", "adjacent-word-exact-dup",
        `${tokens[i]} ${tokens[i + 1]}`,
        broken
          ? "Broken doubling of a function/participle word; remove the second word."
          : "Verify — may be legitimate Turkish reduplication ('X by X'); do not auto-strip.",
        broken ? "high" : "low",
        broken
      );
    } else if (a !== b && a.length >= 6 && b.length >= 6 && a.slice(0, 5) === b.slice(0, 5)) {
      if (isTurkishDistributive(a, b)) continue; // valid "insandan insana" / "limandan limana"
      if (seenDouble.has(pairKey)) continue;
      seenDouble.add(pairKey);
      record(
        card, locale, "realHistory", "grammar-doubling-merge",
        `${tokens[i]} ${tokens[i + 1]}`,
        "Template merge artifact (e.g. 'olduğu olduğudur'); fix wording — needs judgment.",
        "medium", false
      );
    }
  }

  // --- 1b. Same doubling check inside short fields (e.g. 'çevresi çevresindeki') ---
  for (const f of ["whyInteresting", "whyItMatters", "misconception", "subtitle"]) {
    const v = card[f];
    if (typeof v !== "string") continue;
    const t = v.split(/\s+/).filter(Boolean);
    for (let i = 0; i + 1 < t.length; i++) {
      if (endsClause(t[i])) continue; // not a contiguous pair across a clause boundary
      const a = t[i].toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]/gu, "");
      const b = t[i + 1].toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]/gu, "");
      if (!a || !b) continue;
      if (a === b && a.length >= 4) {
        const broken = BROKEN_DOUBLE_WORDS.has(a);
        record(card, locale, f, "adjacent-word-exact-dup", `${t[i]} ${t[i + 1]}`,
          broken
            ? "Broken doubling of a function/participle word; remove the second word."
            : "Verify — may be legitimate Turkish reduplication ('X by X'); do not auto-strip.",
          broken ? "high" : "low", broken);
      } else if (a !== b && a.length >= 6 && b.length >= 6 && a.slice(0, 5) === b.slice(0, 5)) {
        if (isTurkishDistributive(a, b)) continue; // valid "günden güne" / "elden ele"
        record(card, locale, f, "grammar-doubling-merge", `${t[i]} ${t[i + 1]}`,
          "Template merge artifact (e.g. 'çevresi çevresindeki'); fix wording — needs judgment.",
          "medium", false);
      }
    }
  }

  // --- 5a. Duplicated realHistory paragraph (verbatim repeated block) ---
  const paragraphs = realHistory.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const paraCount = new Map();
  for (const p of paragraphs) {
    const key = norm(p);
    if (key.length < 30) continue;
    paraCount.set(key, (paraCount.get(key) || 0) + 1);
  }
  for (const [key, count] of paraCount) {
    if (count >= 2) {
      const orig = paragraphs.find((p) => norm(p) === key) || key;
      record(card, locale, "realHistory", "realHistory-duplicate-paragraph", orig,
        `Paragraph repeated ${count}× verbatim — delete the extra copy.`, "high", true);
    }
  }

  // --- 2. Summary fields pasted into realHistory ---
  for (const f of ["whyInteresting", "misconception", "whyItMatters"]) {
    const v = card[f];
    if (typeof v !== "string" || !rhNorm) continue;
    for (const sentence of splitSentences(v)) {
      const sNorm = norm(sentence);
      if (sNorm.length < 40) continue;
      if (rhNorm.includes(sNorm)) {
        record(card, locale, "realHistory", "summary-text-in-realHistory", sentence,
          `Sentence from '${f}' is pasted into realHistory; remove from body (keep in '${f}') — needs flow check.`,
          "high", false);
        break; // one report per field is enough
      }
    }
  }

  // --- 3. quickRealityCheck question dumped into realHistory ---
  const qrc = typeof card.quickRealityCheck === "string" ? card.quickRealityCheck : "";
  const qrcNorm = norm(qrc);
  if (qrcNorm.length >= 30 && rhNorm.includes(qrcNorm)) {
    record(card, locale, "realHistory", "qrc-question-in-realHistory", qrc,
      "quickRealityCheck text appears inside realHistory; remove the dumped question — needs flow check.",
      "high", false);
  } else if (/denildiğinde, kayıtlar gerçekten aynı sonuca mı varıyor/i.test(realHistory)) {
    record(card, locale, "realHistory", "qrc-question-in-realHistory",
      "...denildiğinde, kayıtlar gerçekten aynı sonuca mı varıyor?",
      "Generic dumped reality-check question inside realHistory; remove — needs flow check.",
      "high", false);
  }

  // --- 4. Mangled whyItMatters template ---
  const wim = typeof card.whyItMatters === "string" ? card.whyItMatters : "";
  if (/^bu başlık,.*medya anlatısından ayrı okumayı sağlar/.test(norm(wim))) {
    record(card, locale, "whyItMatters", "mangled-whyItMatters-template", wim,
      "Templated 'Bu başlık, [fact] ... ayrı okumayı sağlar' splice; rewrite as a real sentence.",
      "high", false);
  } else if (wim && card.whyInteresting && norm(wim) && norm(card.whyInteresting).includes(norm(wim)) && norm(wim).length >= 40) {
    record(card, locale, "whyItMatters", "whyItMatters-duplicates-whyInteresting", wim,
      "whyItMatters is a copy of whyInteresting; write a distinct 'why it matters' line.",
      "high", false);
  }

  // --- 5b. Duplicated mediaChanged content ---
  const mc = typeof card.mediaChanged === "string" ? card.mediaChanged : "";
  const mcSent = splitSentences(mc);
  const mcCount = new Map();
  for (const s of mcSent) {
    const k = norm(s);
    if (k.length < 30) continue;
    mcCount.set(k, (mcCount.get(k) || 0) + 1);
  }
  for (const [k, count] of mcCount) {
    if (count >= 2) {
      const orig = mcSent.find((s) => norm(s) === k) || k;
      record(card, locale, "mediaChanged", "mediaChanged-duplicate-sentence", orig,
        `Sentence repeated ${count}× verbatim in mediaChanged — delete the extra copy.`, "high", true);
    }
  }

  // --- 6. Truncated / broken quickRealityCheck ---
  if (qrc) {
    const trimmed = qrc.trim();
    const endsClean = /[.!?…]$/.test(trimmed);
    const romanTail = /\b(I{1,3}|IV|V|VI{0,3})\.$/.test(trimmed); // "...ve II."
    const conjTail = /\b(ve|ile|ya|veya|ama|fakat)\s*$/i.test(trimmed.replace(/[.…]+$/, ""));
    if (romanTail || conjTail || trimmed.length < 22 || !endsClean) {
      record(card, locale, "quickRealityCheck", "qrc-truncated-or-broken", qrc,
        "quickRealityCheck looks truncated/incomplete; cannot recover text mechanically — manual/AI.",
        romanTail || conjTail ? "high" : "medium", false);
    }
    if (/^gerçek\.\s/i.test(trimmed)) {
      record(card, locale, "quickRealityCheck", "qrc-stray-prefix", qrc,
        "Stray 'Gerçek.' prefix; likely a generation artifact — confirm before removing.",
        "medium", false);
    }
  }

  // --- 6b. realHistory paragraph starting mid-sentence (lowercase fragment) ---
  // Only the VERY FIRST character matters: sentences legitimately start with numbers
  // ("1403 yılı...", "80 yılında...") whose first *alphabetic* char is lowercase but
  // are perfectly valid. A genuine spliced fragment starts with a lowercase letter.
  for (const p of paragraphs) {
    const first = p.trimStart()[0] || "";
    if (/\p{Ll}/u.test(first)) {
      record(card, locale, "realHistory", "realHistory-lowercase-fragment", p,
        "Paragraph begins mid-sentence (lowercase first character); likely a broken splice — manual review.",
        "medium", false);
      break;
    }
  }
}

// --- Run (read-only detection) ---
const perLocaleTotals = {};
const catalogs = {};
for (const locale of ["tr", "en"]) {
  const cards = readJson(`data/cards.${locale}.json`);
  catalogs[locale] = cards;
  perLocaleTotals[locale] = cards.length;
  for (const c of cards) auditCard(c, locale);
}

// --- Aggregate ---
const byType = {};
const byEntry = {};
for (const it of issues) {
  byType[it.issueType] = (byType[it.issueType] || 0) + 1;
  byEntry[it.id] = (byEntry[it.id] || 0) + 1;
}
const safeCount = issues.filter((i) => i.safeToAutoFix).length;
const manualCount = issues.length - safeCount;

const topTypes = Object.entries(byType).sort((a, b) => b[1] - a[1]);
const topEntries = Object.entries(byEntry).sort((a, b) => b[1] - a[1]).slice(0, 15);

// ===========================================================================
// SAFE WRITE MODE — only applies issues with safeToAutoFix === true.
// Triggered by:  node scripts/content-mechanical-cleanup-preview.mjs --write --only-safe
// ===========================================================================
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Apply ONLY safe fixes to one card, mutating it. Returns a list of applied changes. */
function applySafeFixes(card, cardIssues) {
  const applied = [];

  // 1. mediaChanged verbatim duplicate sentence -> keep first occurrence only.
  const mcFields = new Set(
    cardIssues.filter((i) => i.issueType === "mediaChanged-duplicate-sentence").map((i) => i.field)
  );
  for (const f of mcFields) {
    const before = card[f];
    if (typeof before !== "string") continue;
    // mediaChanged is a single-line paragraph; safe to split on sentence boundaries.
    const sents = before.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
    const seen = new Set();
    const kept = [];
    for (const s of sents) {
      const k = norm(s);
      if (seen.has(k)) continue;
      seen.add(k);
      kept.push(s);
    }
    const after = kept.join(" ");
    if (after !== before) {
      card[f] = after;
      applied.push({ field: f, issueType: "mediaChanged-duplicate-sentence", removedSentences: sents.length - kept.length });
    }
  }

  // 2. Broken function/participle doubling (e.g. "olduğu olduğu" -> "olduğu").
  //    Guard with a negative lookahead so "olduğu olduğudur" (merge artifact, NOT safe)
  //    is never touched: the second word must be a complete token.
  for (const issue of cardIssues.filter((i) => i.issueType === "adjacent-word-exact-dup" && i.safeToAutoFix)) {
    const f = issue.field;
    const before = card[f];
    if (typeof before !== "string") continue;
    const w = issue.currentSnippet.trim().split(/\s+/)[0].toLocaleLowerCase("tr").replace(/[^\p{L}\p{N}]/gu, "");
    if (!w) continue;
    const re = new RegExp(`(${escapeRe(w)})(\\s+)(${escapeRe(w)})(?![\\p{L}\\p{N}])`, "giu");
    const after = before.replace(re, "$1");
    if (after !== before) {
      card[f] = after;
      applied.push({ field: f, issueType: "adjacent-word-exact-dup", word: w });
    }
  }

  return applied;
}

if (WRITE) {
  if (!ONLY_SAFE) {
    console.error("Refusing to write: --write must be combined with --only-safe (this script only applies safe fixes).");
    process.exit(1);
  }

  // Validate against the previously generated preview so we apply exactly the
  // reviewed set (no surprise changes since the preview was produced).
  const previewPath = path.join(root, "docs", "content-mechanical-cleanup-preview.json");
  if (!fs.existsSync(previewPath)) {
    console.error("Refusing to write: docs/content-mechanical-cleanup-preview.json not found. Run the dry-run preview first.");
    process.exit(1);
  }
  const expected = JSON.parse(fs.readFileSync(previewPath, "utf8")).summary?.safeAutoFixCandidates;
  if (expected !== safeCount) {
    console.error(`Refusing to write: safe-candidate count mismatch. Preview expected ${expected}, current run found ${safeCount}.`);
    console.error("Re-run the dry-run preview and re-review before writing.");
    process.exit(1);
  }

  // Group safe issues by locale+id.
  const safeIssues = issues.filter((i) => i.safeToAutoFix);
  const byCard = new Map();
  for (const i of safeIssues) {
    const key = `${i.locale}::${i.id}`;
    if (!byCard.has(key)) byCard.set(key, []);
    byCard.get(key).push(i);
  }

  const appliedLog = [];
  const skipped = [];
  for (const locale of ["tr", "en"]) {
    const cards = catalogs[locale];
    const idIndex = new Map(cards.map((c) => [c.id, c]));
    for (const [key, cardIssues] of byCard) {
      if (!key.startsWith(`${locale}::`)) continue;
      const id = key.slice(locale.length + 2);
      const card = idIndex.get(id);
      if (!card) {
        skipped.push({ id, locale, reason: "card id not found in catalog" });
        continue;
      }
      const applied = applySafeFixes(card, cardIssues);
      // Account for any safe issue that produced no change (e.g. already clean).
      const appliedTypes = new Set(applied.map((a) => `${a.field}::${a.issueType}`));
      for (const ci of cardIssues) {
        if (!appliedTypes.has(`${ci.field}::${ci.issueType}`)) {
          skipped.push({ id, locale, field: ci.field, issueType: ci.issueType, reason: "no textual change produced (already clean or pattern not matched)" });
        }
      }
      for (const a of applied) appliedLog.push({ id, locale, ...a });
    }
    fs.writeFileSync(
      path.join(root, `data/cards.${locale}.json`),
      JSON.stringify(cards, null, 2) + "\n",
      "utf8"
    );
  }

  console.log("SAFE WRITE applied (only safeToAutoFix === true).");
  console.log(`Safe candidates expected/applied-as-issues: ${safeCount}`);
  console.log(`Distinct field edits applied: ${appliedLog.length}`);
  const fixByType = {};
  for (const a of appliedLog) fixByType[a.issueType] = (fixByType[a.issueType] || 0) + 1;
  console.log("Edits by type:", JSON.stringify(fixByType));
  console.log("\nApplied edits:");
  for (const a of appliedLog) {
    console.log(`  ${a.locale} ${a.id} ${a.field} ${a.issueType}` + (a.word ? ` (${a.word})` : "") + (a.removedSentences ? ` (-${a.removedSentences} sentence)` : ""));
  }
  if (skipped.length) {
    console.log("\nSkipped safe candidates:");
    for (const s of skipped) console.log(`  ${s.locale} ${s.id} ${s.field || ""} ${s.issueType || ""} — ${s.reason}`);
  } else {
    console.log("\nSkipped safe candidates: none");
  }
  console.log("\nFiles changed: data/cards.tr.json, data/cards.en.json");
  console.log("Re-run `npm run content:cleanup:preview` to verify the artifacts are gone.");
  process.exit(0);
}

const summary = {
  generatedAt: new Date().toISOString(),
  mode: "dry-run (no content modified)",
  auditedEntries: perLocaleTotals,
  totalIssues: issues.length,
  safeAutoFixCandidates: safeCount,
  requiresManualOrAi: manualCount,
  affectedEntries: Object.keys(byEntry).length,
  issuesByType: byType,
};

// --- JSON ---
fs.mkdirSync(path.join(root, "docs"), { recursive: true });
fs.writeFileSync(
  path.join(root, "docs", "content-mechanical-cleanup-preview.json"),
  JSON.stringify({ summary, issues }, null, 2) + "\n",
  "utf8"
);

// --- Markdown ---
const md = [];
md.push("# Mechanical cleanup preview (DRY-RUN — no content modified)");
md.push("");
md.push(`Generated: ${summary.generatedAt}`);
md.push("");
md.push("Detects repeated bulk-generation artifacts confirmed in `docs/high-risk-content-review.md`. " +
  "No file under `data/` or `mobile/data/` was changed.");
md.push("");
md.push("## Summary");
md.push("");
md.push(`- Audited entries: TR ${perLocaleTotals.tr}, EN ${perLocaleTotals.en}`);
md.push(`- **Total detected issues:** ${issues.length}`);
md.push(`- **Safe auto-fix candidates:** ${safeCount}`);
md.push(`- **Require manual / AI review:** ${manualCount}`);
md.push(`- **Affected entries:** ${summary.affectedEntries}`);
md.push("");
md.push("### Issues by type");
md.push("");
md.push("| issueType | count | safe auto-fix | manual/AI |");
md.push("|-----------|------:|------:|------:|");
for (const [t, c] of topTypes) {
  const s = issues.filter((i) => i.issueType === t && i.safeToAutoFix).length;
  md.push(`| ${t} | ${c} | ${s} | ${c - s} |`);
}
md.push("");
md.push("### Top affected entries");
md.push("");
md.push("| id | issues |");
md.push("|----|-------:|");
for (const [id, c] of topEntries) md.push(`| ${id} | ${c} |`);
md.push("");
md.push("## Safe auto-fix candidates (mechanical, exact-duplicate / non-reduplication word dup)");
md.push("");
md.push("| id | locale | field | issueType | confidence | snippet |");
md.push("|----|--------|-------|-----------|------------|---------|");
for (const i of issues.filter((x) => x.safeToAutoFix)) {
  md.push(`| ${i.id} | ${i.locale} | ${i.field} | ${i.issueType} | ${i.confidence} | ${i.currentSnippet.replace(/\|/g, "\\|")} |`);
}
md.push("");
md.push("## Requires manual / AI review (judgment, research, or rewrite)");
md.push("");
md.push("| id | locale | field | issueType | confidence | snippet | proposedAction |");
md.push("|----|--------|-------|-----------|------------|---------|----------------|");
for (const i of issues.filter((x) => !x.safeToAutoFix)) {
  md.push(
    `| ${i.id} | ${i.locale} | ${i.field} | ${i.issueType} | ${i.confidence} | ` +
    `${i.currentSnippet.replace(/\|/g, "\\|")} | ${i.proposedAction.replace(/\|/g, "\\|")} |`
  );
}
md.push("");
md.push("## Notes");
md.push("");
md.push("- **Reduplication guard:** Turkish reduplication is productive (`dönem dönem`, `şehir şehir`, " +
  "`tekrar tekrar`, `yemek yemek`), so exact adjacent word duplicates are only auto-fix-safe when the " +
  "doubled token is a function/participle word that is never validly repeated (e.g. `olduğu olduğu`). " +
  "All other adjacent duplicates are low-confidence, `safeToAutoFix: false`.");
md.push("- **Off-topic bodies** (e.g. `rome2-legions`, where realHistory drifts off the title) cannot be " +
  "detected reliably by mechanical rules; they remain manual/AI rebuilds per the high-risk review.");
md.push("- **Truncated fields** (e.g. `band-of-brothers-heroism` quickRealityCheck) are detected but NOT " +
  "auto-fixable — the missing text is not recoverable verbatim from another field.");
md.push("- `safeToAutoFix: true` is limited to: verbatim duplicate paragraph/sentence removal and exact " +
  "non-reduplication adjacent-word duplicates. Everything else is `false`.");

fs.writeFileSync(path.join(root, "docs", "content-mechanical-cleanup-preview.md"), md.join("\n") + "\n", "utf8");

// --- Console ---
console.log(JSON.stringify(summary, null, 2));
console.log("\nTop issue types:");
for (const [t, c] of topTypes) console.log(`  ${c}\t${t}`);
console.log("\nTop affected entries:");
for (const [id, c] of topEntries) console.log(`  ${c}\t${id}`);
console.log("\nWritten: docs/content-mechanical-cleanup-preview.md, docs/content-mechanical-cleanup-preview.json");
console.log("DRY-RUN — no content files modified.");
