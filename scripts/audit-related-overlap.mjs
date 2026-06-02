#!/usr/bin/env node
/**
 * Lists card pairs with likely duplicate takeaway (same quickRealityCheck / title).
 * Run: node scripts/audit-related-overlap.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function normalizeText(value) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function isLikelyDuplicateContent(a, b) {
  if (a.id === b.id) return true;
  if (a.quickRealityCheck && b.quickRealityCheck) {
    const qa = normalizeText(a.quickRealityCheck);
    const qb = normalizeText(b.quickRealityCheck);
    if (qa === qb) return true;
    if (qa.length > 48 && qb.length > 48) {
      const sliceA = qa.slice(0, 72);
      const sliceB = qb.slice(0, 72);
      if (qa.includes(sliceB) || qb.includes(sliceA)) return true;
    }
  }
  if (normalizeText(a.title) === normalizeText(b.title)) return true;
  return false;
}

function loadCards(locale) {
  const file = path.join(root, "data", `cards.${locale}.json`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function auditLocale(locale) {
  const cards = loadCards(locale);
  const pairs = [];

  for (let i = 0; i < cards.length; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      const a = cards[i];
      const b = cards[j];
      if (isLikelyDuplicateContent(a, b)) {
        pairs.push({ a: a.id, b: b.id, titleA: a.title, titleB: b.title });
      }
    }
  }

  console.log(`\n── ${locale.toUpperCase()} duplicate candidates: ${pairs.length} ──`);
  for (const p of pairs.slice(0, 40)) {
    console.log(`  ${p.a} ↔ ${p.b}`);
    console.log(`    ${p.titleA}`);
    console.log(`    ${p.titleB}`);
  }
  if (pairs.length > 40) console.log(`  … +${pairs.length - 40} more`);
}

auditLocale("tr");
auditLocale("en");
