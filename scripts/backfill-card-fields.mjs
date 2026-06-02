#!/usr/bin/env node
/**
 * Kart JSON backfill — yeni metin yazmadan liste/ilişki alanlarını doldurur.
 *
 *   node scripts/backfill-card-fields.mjs           # özet
 *   node scripts/backfill-card-fields.mjs --write   # dosyalara yaz
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

const LOCALES = ["tr", "en"];

function readCards(locale) {
  const p = path.join(root, "data", `cards.${locale}.json`);
  return { path: p, data: JSON.parse(fs.readFileSync(p, "utf8")) };
}

function firstSentence(text) {
  if (!text || typeof text !== "string") return "";
  const t = text.replace(/\s+/g, " ").trim();
  const m = t.match(/^(.+?[.!?…])(\s|$)/);
  const sentence = (m ? m[1] : t).trim();
  return sentence.length > 200 ? `${sentence.slice(0, 197).trim()}…` : sentence;
}

function backfillQuickRealityCheck(card) {
  if (card.quickRealityCheck?.trim()) return false;
  const source =
    card.subtitle?.trim() ||
    card.whatWeSee?.trim() ||
    card.accuracyNote?.trim() ||
    "";
  const sentence = firstSentence(source);
  if (!sentence) return false;
  card.quickRealityCheck = sentence;
  return true;
}

function buildMediaGroups(cards) {
  const groups = new Map();
  for (const card of cards) {
    const key = `${card.mediaType || ""}::${(card.mediaTitle || "").trim().toLowerCase()}`;
    if (!card.mediaTitle?.trim()) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(card.id);
  }
  return groups;
}

function backfillRelated(card, groups) {
  const key = `${card.mediaType || ""}::${(card.mediaTitle || "").trim().toLowerCase()}`;
  const peers = (groups.get(key) || []).filter((id) => id !== card.id);
  if (peers.length === 0) return false;
  const existing = new Set(card.relatedCardIds || []);
  if (existing.size >= 2) return false;
  let added = false;
  for (const id of peers.slice(0, 3)) {
    if (existing.has(id)) continue;
    if (!card.relatedCardIds) card.relatedCardIds = [];
    card.relatedCardIds.push(id);
    existing.add(id);
    added = true;
    if (existing.size >= 3) break;
  }
  return added;
}

const stats = { quick: 0, related: 0 };

for (const locale of LOCALES) {
  const { path: filePath, data: cards } = readCards(locale);
  const groups = buildMediaGroups(cards);
  let q = 0;
  let r = 0;
  for (const card of cards) {
    if (backfillQuickRealityCheck(card)) q++;
    if (backfillRelated(card, groups)) r++;
  }
  stats.quick += q;
  stats.related += r;
  console.log(`${locale}: quickRealityCheck +${q}, relatedCardIds +${r} kart`);
  if (write) {
    fs.writeFileSync(filePath, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
  }
}

console.log(`\nToplam: quickRealityCheck ${stats.quick}, relatedCardIds ${stats.related}`);
if (!write) console.log("\nUygulamak için: node scripts/backfill-card-fields.mjs --write");
