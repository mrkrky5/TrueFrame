#!/usr/bin/env node
/**
 * Kartları öğrenme rotalarına dağıtır (skor + rota eşlemesi).
 *
 *   node scripts/sync-routes-batch.mjs --write
 *   node scripts/sync-routes-batch.mjs --approved --write
 *   node scripts/sync-routes-batch.mjs --all-tf26 --write
 *   node scripts/sync-routes-batch.mjs --all-tf26 --balanced --write
 *   node scripts/sync-routes-batch.mjs --prefix=tf26- --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");
const useBalanced = process.argv.includes("--balanced");
const useAllTf26 = process.argv.includes("--all-tf26");
const useApproved = process.argv.includes("--approved") && !useAllTf26;
const prefix = process.argv.find((a) => a.startsWith("--prefix="))?.split("=")[1] ?? "tf26-";
const approvedPath =
  process.argv.find((a) => a.startsWith("--approved-file="))?.split("=")[1] ??
  path.join(root, "data", "tf26-routes-approved.json");
const blockRoutesPath =
  process.argv.find((a) => a.startsWith("--block-routes="))?.split("=")[1] ??
  path.join(root, "data", "tf26-block-routes.json");

const trCards = JSON.parse(fs.readFileSync(path.join(root, "data", "cards.tr.json"), "utf8"));
const auditCards = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, "docs", "tf26-audit.json"), "utf8")).cards;
  } catch {
    return [];
  }
})();

let batch;
let batchIdSet;

let routeOverrides = {};
let blockToRoute = {};

if (useAllTf26) {
  batch = trCards.filter((c) => c.id.startsWith("tf26-"));
  batchIdSet = new Set(batch.map((c) => c.id));
  try {
    const approved = JSON.parse(fs.readFileSync(approvedPath, "utf8"));
    routeOverrides = approved.routeOverrides ?? {};
  } catch {
    routeOverrides = {};
  }
  if (useBalanced) {
    try {
      const blockCfg = JSON.parse(fs.readFileSync(blockRoutesPath, "utf8"));
      blockToRoute = blockCfg.blockToRoute ?? {};
    } catch {
      console.warn(`Balanced mode: missing ${blockRoutesPath}, falling back to scorers`);
    }
  }
} else if (useApproved) {
  const approved = JSON.parse(fs.readFileSync(approvedPath, "utf8"));
  batchIdSet = new Set(approved.cardIds ?? []);
  routeOverrides = approved.routeOverrides ?? {};
  batch = trCards.filter((c) => batchIdSet.has(c.id));
  if (!batch.length) {
    console.error(`No TR cards for approved list (${approvedPath})`);
    process.exit(1);
  }
} else {
  batch = trCards.filter((c) => c.id.startsWith(prefix));
  batchIdSet = new Set(batch.map((c) => c.id));
  if (!batch.length) {
    console.error(`No cards with prefix "${prefix}"`);
    process.exit(1);
  }
}

/** TR rota id → EN rota id (routes.en.json farklı slug kullanır) */
const ROUTE_EN_BY_TR = {
  "oyunlardan-gercege": "from-games-to-reality",
  "yanlis-bilinenler": "history-misconceptions",
  "antik-dunya": "ancient-world",
  "guc-devlet-propaganda": "power-state-propaganda",
  "orta-cag-ve-mitler": "middle-ages-and-myths",
  "dogu-asya-tarihi": "east-asian-history",
  "gunluk-hayat-atmosfer": "daily-life-atmosphere",
  "sehirler-gunluk-hayat": "cities-daily-life",
  "imparatorluklarin-cokusu": "collapse-of-empires",
  "bilgi-bilim-propaganda": "knowledge-science-propaganda",
};

/** routeId → score function (higher = better fit) */
const ROUTE_SCORERS = {
  "oyunlardan-gercege": (c) => (c.mediaType === "game" ? 3 : 0) + tagAny(c, ["assassins-creed", "total-war", "civ", "aoe"]),
  "yanlis-bilinenler": (c) =>
    textMatch(c, /yanılg|mit|efsane|myth|misconception|yanlış|aslında|gerçekte değil/i) ? 4 : 0,
  "antik-dunya": (c) => tagAny(c, ["antik-misir", "antik-yunan", "roma", "misir", "yunanistan", "antik", "kleopatra", "mısır"]) + (c.mediaType === "game" && tagAny(c, ["assassins-creed"]) ? 1 : 0),
  "guc-devlet-propaganda": (c) =>
    tagAny(c, ["propaganda", "imparatorluk", "napoleon", "shogun", "devlet", "crown", "gladiator"]) +
    textMatch(c, /propaganda|devlet|ihanet|komplo/i),
  "orta-cag-ve-mitler": (c) => tagAny(c, ["orta-cag", "feodalizm", "bohemya", "kcd", "cadı", "şövalye", "medieval"]) + textMatch(c, /orta çağ|medieval|feodal/i),
  "dogu-asya-tarihi": (c) => tagAny(c, ["japonya", "samuray", "shogun", "tokugawa", "tsushima", "sengoku", "çin", "baghdad", "halife"]),
  "gunluk-hayat-atmosfer": (c) => textMatch(c, /günlük|hayat|sofr|sokak|gece|market|ticaret yolu/i) + tagAny(c, ["gnlk-hayat", "daily-life"]),
  "sehirler-gunluk-hayat": (c) => textMatch(c, /şehir|istanbul|londra|roma|sokak|çarşı/i),
  "imparatorluklarin-cokusu": (c) => textMatch(c, /çöküş|yıkıl|sonu|fall|collapse|imparatorluk.*son/i),
  "bilgi-bilim-propaganda": (c) =>
    tagAny(c, ["bilim", "oppenheimer", "chernobyl", "trinity", "matbaa", "yazı"]) + textMatch(c, /bilim|atom|nükleer|keşif|icat/i),
};

function tagAny(card, keys) {
  const tags = card.tags ?? [];
  return keys.some((k) => tags.some((t) => t.includes(k))) ? 2 : 0;
}

function textMatch(card, re) {
  const blob = [card.title, card.subtitle, card.misconception, card.whatWeSee].filter(Boolean).join(" ");
  return re.test(blob) ? 2 : 0;
}

const idToBlock = new Map(auditCards.map((c) => [c.id, c.block]));

function blockForCard(card) {
  return idToBlock.get(card.id) ?? null;
}

function routeForCard(card) {
  if (routeOverrides[card.id]) return routeOverrides[card.id];
  const block = blockForCard(card);
  if (block && blockToRoute[block]) return blockToRoute[block];
  return bestRoute(card);
}

function bestRoute(card) {
  let best = null;
  let bestScore = 0;
  for (const [routeId, scoreFn] of Object.entries(ROUTE_SCORERS)) {
    const s = scoreFn(card);
    if (s > bestScore) {
      bestScore = s;
      best = routeId;
    }
  }
  if (!best || bestScore < 2) {
    if (card.mediaType === "game") return "oyunlardan-gercege";
    if (card.mediaType === "film" || card.mediaType === "series") return "guc-devlet-propaganda";
    return "gunluk-hayat-atmosfer";
  }
  return best;
}

function syncRoutes(locale) {
  const routePath = path.join(root, "data", `routes.${locale}.json`);
  const routes = JSON.parse(fs.readFileSync(routePath, "utf8"));
  const cardPath = path.join(root, "data", `cards.${locale}.json`);
  const cards = JSON.parse(fs.readFileSync(cardPath, "utf8"));
  const added = {};

  if (useApproved || useAllTf26) {
    for (const route of routes) {
      route.cardIds = route.cardIds.filter((id) => !batchIdSet.has(id));
    }
  }

  for (const route of routes) {
    const set = new Set(route.cardIds);
    const before = set.size;
    for (const id of batchIdSet) {
      const trCard = trCards.find((c) => c.id === id);
      if (!trCard) continue;
      const trRouteId = routeForCard(trCard);
      const expectedRouteId =
        locale === "tr" ? trRouteId : ROUTE_EN_BY_TR[trRouteId] ?? trRouteId;
      if (expectedRouteId !== route.id) continue;
      if (locale === "en" && !cards.find((c) => c.id === id)) continue;
      set.add(id);
    }
    route.cardIds = [...set];
    const n = set.size - before;
    if (n) added[route.id] = n;
  }

  return { routes, added };
}

const trResult = syncRoutes("tr");
const enResult = syncRoutes("en");

const modeLabel = useAllTf26
  ? useBalanced
    ? `all tf26 (${batch.length}) balanced + overrides`
    : `all tf26 (${batch.length}) scorers + overrides`
  : useApproved
    ? `approved (${path.basename(approvedPath)})`
    : `prefix=${prefix}`;
console.log(`── sync-routes-batch (${batch.length} kart, ${modeLabel}) ──\n`);
console.log("TR rotalara eklenen:", trResult.added);
console.log("EN rotalara eklenen:", enResult.added);

if (write) {
  fs.writeFileSync(path.join(root, "data", "routes.tr.json"), `${JSON.stringify(trResult.routes, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(root, "data", "routes.en.json"), `${JSON.stringify(enResult.routes, null, 2)}\n`, "utf8");
  console.log("\nroutes.tr.json + routes.en.json yazıldı.");
} else {
  console.log("\n→ Uygula: node scripts/sync-routes-batch.mjs --write");
}
