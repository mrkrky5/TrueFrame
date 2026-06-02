#!/usr/bin/env node
/**
 * TR/EN ortak kartlarda isFlagship ve mediaType hizalama (TR kaynak).
 * EN'de Yam (Örtöö) yazım düzeltmesi.
 *
 *   node scripts/fix-card-parity.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

const trPath = path.join(root, "data", "cards.tr.json");
const enPath = path.join(root, "data", "cards.en.json");
const tr = JSON.parse(fs.readFileSync(trPath, "utf8"));
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));
const trMap = new Map(tr.map((c) => [c.id, c]));
const enMap = new Map(en.map((c) => [c.id, c]));

let flagship = 0;
let media = 0;
let typo = 0;

for (const [id, tCard] of trMap) {
  const eCard = enMap.get(id);
  if (!eCard) continue;

  if (Boolean(tCard.isFlagship) !== Boolean(eCard.isFlagship)) {
    eCard.isFlagship = Boolean(tCard.isFlagship);
    flagship++;
  }
  if (tCard.mediaType && tCard.mediaType !== eCard.mediaType) {
    eCard.mediaType = tCard.mediaType;
    media++;
  }
}

const aoe4 = enMap.get("aoe4-mongol-logistics");
if (aoe4?.realHistory?.includes("Örtöö")) {
  aoe4.realHistory = aoe4.realHistory.replace(/Örtöö/g, "Ortöö");
  typo++;
}

console.log(`EN güncelleme: isFlagship ${flagship}, mediaType ${media}, Ortöö yazım ${typo}`);
if (write) {
  fs.writeFileSync(enPath, `${JSON.stringify(en, null, 2)}\n`, "utf8");
  console.log("cards.en.json yazıldı.");
} else {
  console.log("Yazmak için: node scripts/fix-card-parity.mjs --write");
}
