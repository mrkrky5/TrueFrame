#!/usr/bin/env node
/**
 * Replace tf26 template subtitles ("X sahnede neden değişir?") with quickRealityCheck or whatWeSee.
 *
 *   node scripts/fix-tf26-subtitles.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

const TEMPLATE_RE = /^.+ sahnede neden değişir\?$/;
const TEMPLATE_EN_RE = /^.+ changes on screen\?$/i;

function pickSubtitle(card) {
  const candidate = card.quickRealityCheck || card.whatWeSee || card.subtitle;
  if (!candidate) return card.subtitle;
  const oneLine = candidate.replace(/\s+/g, " ").trim();
  if (oneLine.length <= 100) return oneLine;
  const cut = oneLine.slice(0, 97).trim();
  return `${cut}…`;
}

function fixFile(locale) {
  const filePath = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let fixed = 0;
  for (const card of cards) {
    if (!card.id?.startsWith("tf26-")) continue;
    const sub = card.subtitle?.trim() ?? "";
    if (!TEMPLATE_RE.test(sub) && !TEMPLATE_EN_RE.test(sub)) continue;
    card.subtitle = pickSubtitle(card);
    fixed++;
  }
  if (write) {
    fs.writeFileSync(filePath, `${JSON.stringify(cards, null, 2)}\n`, "utf8");
  }
  return fixed;
}

const tr = fixFile("tr");
const en = fixFile("en");
console.log(`TR: ${tr} subtitles updated`);
console.log(`EN: ${en} subtitles updated`);
if (!write) console.log("\nDry run. Pass --write to apply.");
