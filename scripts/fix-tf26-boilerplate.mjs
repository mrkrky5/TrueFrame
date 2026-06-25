#!/usr/bin/env node
/**
 * tf26 kartlarındaki tekrarlayan şablon paragrafları temizler.
 *   node scripts/fix-tf26-boilerplate.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

const STRIP_PATTERNS = [
  /\n\n[^\n]{20,220} bu yüzden yalnızca ünlü kişilerin kararıyla açıklanamaz; kayıt tutan kurumlar, yerel topluluklar, askerî baskı ve ekonomik zorunluluklar aynı anda devrededir\./g,
  /\n\n(?:MÖ|MS) [^\n]{20,280} içinde farklı çıkarlarla hareket etti\./g,
  /\n\nSahne, konuyu okunabilir hale getirmek için bazı bağlantıları geriye iter\.[^\n]+/g,
  /\n\nSahne [^\n]{5,80} konusunu hızlı okunur kılar; tarihsel okuma ise[^\n]+/g,
  /\n\n[^\n]{5,80} hakkında asıl derinlik, ekrandaki etki ile arşivlerin anlattığı süreç arasındaki farkta saklıdır\./g,
  /\n\nBu okuma, sahnenin kurduğu duyguyu bozmaz; onu daha sağlam hale getirir\.[^\n]+/g,
];

function cleanRealHistory(text) {
  if (!text || typeof text !== "string") return text;
  let out = text;
  for (const re of STRIP_PATTERNS) {
    out = out.replace(re, "");
  }
  const lines = out.split("\n\n");
  out = lines
    .filter((para) => !/bu yüzden yalnızca ünlü kişilerin kararıyla açıklanamaz/.test(para))
    .filter((para) => !/içinde farklı çıkarlarla hareket etti\.$/.test(para) || para.length < 120)
    .join("\n\n");
  out = out.replace(/\n{3,}/g, "\n\n").trim();
  return out;
}

function processLocale(locale) {
  const file = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(file, "utf8"));
  let changed = 0;
  for (const card of cards) {
    if (!card.id?.startsWith("tf26-") || !card.realHistory) continue;
    const before = card.realHistory;
    const after = cleanRealHistory(before);
    if (after !== before) {
      card.realHistory = after;
      changed++;
    }
  }
  if (write && changed > 0) {
    fs.writeFileSync(file, JSON.stringify(cards, null, 2) + "\n", "utf8");
  }
  return { locale, changed, total: cards.length };
}

const tr = processLocale("tr");
const en = processLocale("en");

console.log(JSON.stringify({ tr, en, write }, null, 2));

if (!write) {
  console.log("\nDry run — değişiklikleri yazmak için: --write");
}
