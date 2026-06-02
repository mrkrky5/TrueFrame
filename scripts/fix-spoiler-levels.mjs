#!/usr/bin/env node
/**
 * spoilerLevel + spoilerNote hizalama (TR/EN parity).
 *   node scripts/fix-spoiler-levels.mjs           # önizleme
 *   node scripts/fix-spoiler-levels.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");

const trPath = path.join(root, "data", "cards.tr.json");
const enPath = path.join(root, "data", "cards.en.json");
const cardsTr = JSON.parse(fs.readFileSync(trPath, "utf8"));
const cardsEn = JSON.parse(fs.readFileSync(enPath, "utf8"));
const enById = new Map(cardsEn.map((c) => [c.id, c]));

const FORCE_MAJOR = new Set([
  "shogun-edo",
  "gladiator-colosseum",
  "gladiator-commodus-real",
  "chernobyl-disaster",
  "oppenheimer-trinity",
  "ryan-higgins-boats",
  "1917-siper-savasi-flagship",
  "the-terror-arctic",
  "saving-private-ryan-higgins-boat",
  "got-war-of-roses-real",
  "tf26-012-commodus-reputation",
  "tf26-020-fall-myth",
  "tf26-052-kamikaze",
  "tf26-100-trinity-test",
  "tf26-108-communist-paranoia",
  "tf26-120-battle-outcome",
  "tf26-140-d-day",
  "tf26-148-war-ending",
  "tf26-152-atomic-decision",
  "tf26-156-soviet-secrecy",
  "tf26-164-apollo-11",
  "tf26-192-quarantine",
]);

const MAJOR_TITLE_RE =
  /\b(ölüm|ölür|sonu|final|twist|ihanet|komplo|düşman|düşüş|çöküş|infaz|katliam|commodus|maximus|trinity|patlama|kamikaze|savaşın sonu|son saat|battle outcome|war ending|d-day|intihar|suikast)\b/i;

const FORCE_NONE = new Set([
  "medieval-hygiene",
  "viking-horned-helmet",
  "civ-great-library-alexandria-real",
]);

/** Yalnızca başlık/alt başlık — gövdedeki “sonuç” kelimesi major sayılmaz */
const MAJOR_HEAD_RE =
  /\b((hikayenin|filmin|dizinin|oyunun)\s+sonu|son\s+ve\s+sürpriz|final\s+saat|ölümü|ölür|öldürül|katledil|ihanet\s+ve\s+son|twist|sürpriz\s+son|commodus|maximus.*öl|trinity\s+testi|d-day\s+sonu|savaşın\s+sonu|ending(s)?|who\s+dies|death\s+of|plot\s+twist|fall\s+myth|reputation.*death)\b/i;

const MAJOR_HIST_RE =
  /\b(sonunu\s+anlat|finalini\s+verir|ölüm\s+sahnesi|dies\s+at\s+the\s+end|reveals\s+the\s+ending)\b/i;

const NONE_TITLE_RE =
  /\b(ekonomi|taşkın|yazıcı|lejyon|demokrasi|tapınak|ticaret|hijyen|karantina|mühendis|gemi|tarım|vergi|arşiv|kütüphane|mumyalama|çöl yolu|arena ve siyaset|yurttaşlık|isimler|kimlik|göç|ticaret yolu|tapınak ekonomisi|nil taşkın|hayvan kült|piramit.*işçi|veba doktor|ölüm sanatı|kırsal etki|hafıza)\b/i;

const NONE_BODY_RE =
  /\b(kurum|vergi kayıt|tarım takvim|yazıcı sınıf|gündelik emek|ekonomik zorunluluk|bürokrasi|infrastructure|institution|tax record|daily labor)\b/i;

const PLOT_FILM_RE =
  /\b(commodus|kleopatra|maximus|bayek|kassandra|ejder|savaş sonu|battle|siege|raid|invasion)\b/i;

function isMajor(card) {
  if (FORCE_MAJOR.has(card.id)) return true;
  const head = [card.title, card.subtitle, card.misconception].filter(Boolean).join(" ");
  if (MAJOR_HEAD_RE.test(head)) return true;
  const hist = (card.realHistory || "").slice(0, 500);
  return MAJOR_HIST_RE.test(hist);
}

function isNone(card) {
  if (FORCE_NONE.has(card.id)) return true;
  const head = [card.title, card.subtitle, card.whatWeSee].filter(Boolean).join(" ");
  if (card.mediaTitle === "Period Films" || card.mediaTitle === "Günlük Hayat") return true;
  if (NONE_TITLE_RE.test(card.title || "")) return true;
  if (NONE_BODY_RE.test(head) && !PLOT_FILM_RE.test(head)) return true;
  if (card.mediaType === "game" && NONE_TITLE_RE.test(card.title || "")) return true;
  return false;
}

function classify(card) {
  if (isMajor(card)) return "major";
  if (isNone(card)) return "none";

  if (card.mediaType === "film" || card.mediaType === "series") {
    if (MAJOR_TITLE_RE.test(card.title || "")) return "major";
    return "minor";
  }

  if (card.mediaType === "game") {
    if (PLOT_FILM_RE.test([card.title, card.subtitle].filter(Boolean).join(" "))) return "minor";
    return "none";
  }

  return "none";
}

function spoilerNoteTr(card, level) {
  const media = card.mediaTitle || "Bu yapım";
  if (level === "none") return "";
  if (level === "major") {
    return `${media} hikâyesinin sonunu veya büyük sürprizlerini anlatabilir.`;
  }
  return `${media} hikâyesine dair ipuçları içerebilir; sonu anlatmaz.`;
}

function spoilerNoteEn(card, level) {
  const media = card.mediaTitle || "This title";
  if (level === "none") return "";
  if (level === "major") {
    return `May reveal the ending or major twists of ${media}.`;
  }
  return `May include story hints for ${media}; does not reveal the ending.`;
}

const stats = { tr: { none: 0, minor: 0, major: 0 }, changes: 0, noteCleared: 0 };
const changes = [];

for (const card of cardsTr) {
  const prev = card.spoilerLevel || "none";
  const level = classify(card);
  const en = enById.get(card.id);

  if (prev !== level) {
    changes.push({ id: card.id, from: prev, to: level });
    stats.changes++;
  }
  stats.tr[level]++;

  if (!write) continue;

  card.spoilerLevel = level;
  card.spoilerNote = spoilerNoteTr(card, level);
  if (!card.spoilerNote) stats.noteCleared++;

  if (en) {
    en.spoilerLevel = level;
    en.spoilerNote = spoilerNoteEn(en, level);
  }
}

console.log("── fix-spoiler-levels ──\n");
console.log("TR dağılım (yeni):", stats.tr);
console.log("Değişen kart:", stats.changes);
if (changes.length) {
  console.log("\nÖrnek değişiklikler:");
  for (const c of changes.slice(0, 12)) console.log(`  ${c.id}: ${c.from} → ${c.to}`);
  if (changes.length > 12) console.log(`  … +${changes.length - 12}`);
}

if (!write) {
  console.log("\n→ Uygula: node scripts/fix-spoiler-levels.mjs --write");
  process.exit(0);
}

fs.writeFileSync(trPath, `${JSON.stringify(cardsTr, null, 2)}\n`, "utf8");
fs.writeFileSync(enPath, `${JSON.stringify(cardsEn, null, 2)}\n`, "utf8");
console.log(`\n✓ Yazıldı. spoilerNote temizlenen: ${stats.noteCleared}`);
console.log("  npm run mobile:sync");
