#!/usr/bin/env node
/**
 * Mobil uygulama sağlık kontrolü — migration sonrası "patlamış" şeyleri yakalar.
 *
 * Kullanım:
 *   npm run mobile:check           # hızlı (tsc + veri bütünlüğü)
 *   npm run mobile:check -- --build # yavaş (+ expo web export)
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mobileDir = path.join(root, "mobile");
const withBuild = process.argv.includes("--build");

let failures = 0;

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  failures++;
}

function pass(msg) {
  console.log(`✓ ${msg}`);
}

function section(title) {
  console.log(`\n── ${title} ──`);
}

function readJson(relativePath) {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    fail(`Dosya yok: ${relativePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(full, "utf8"));
  } catch (e) {
    fail(`${relativePath} geçersiz JSON: ${e.message}`);
    return null;
  }
}

function checkSharedImports() {
  section("Shared import yolları");
  const bad = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".expo") {
        walk(full);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        const text = fs.readFileSync(full, "utf8");
        if (/from\s+["']\.\.\/.*shared\//.test(text)) {
          bad.push(path.relative(mobileDir, full));
        }
      }
    }
  };
  walk(mobileDir);
  if (bad.length) {
    fail(`Eski relative shared import: ${bad.join(", ")} — @shared/* kullanın`);
  } else {
    pass("Tüm shared import'lar @shared alias kullanıyor");
  }
}

function checkDataIntegrity() {
  section("Veri bütünlüğü");

  const cardsTr = readJson("data/cards.tr.json");
  const cardsEn = readJson("data/cards.en.json");
  const routesTr = readJson("data/routes.tr.json");
  const routesEn = readJson("data/routes.en.json");
  if (!cardsTr || !cardsEn || !routesTr || !routesEn) return;

  const trIds = new Set(cardsTr.map((c) => c.id));
  const enIds = new Set(cardsEn.map((c) => c.id));

  if (cardsTr.length !== trIds.size) fail("cards.tr.json içinde tekrarlayan id var");
  else pass(`${cardsTr.length} TR kart, id'ler benzersiz`);

  if (cardsEn.length !== enIds.size) fail("cards.en.json içinde tekrarlayan id var");
  else pass(`${cardsEn.length} EN kart, id'ler benzersiz`);

  let routeErrors = 0;
  for (const routes of [routesTr, routesEn]) {
    const locale = routes === routesTr ? "TR" : "EN";
    const cardSet = routes === routesTr ? trIds : enIds;
    for (const route of routes) {
      for (const cardId of route.cardIds ?? []) {
        if (!cardSet.has(cardId)) {
          fail(`${locale} rota "${route.id}" bilinmeyen kart id: ${cardId}`);
          routeErrors++;
        }
      }
    }
  }
  if (!routeErrors) pass("Rota → kart referansları geçerli");

  const flagshipWithoutBlocks = cardsTr.filter(
    (c) => c.experienceLevel === "flagship" && !c.contentBlocks?.length
  );
  if (flagshipWithoutBlocks.length) {
    fail(
      `Flagship kartlarda contentBlocks eksik: ${flagshipWithoutBlocks.map((c) => c.id).join(", ")}`
    );
  } else {
    pass("Flagship kartların contentBlocks'u var");
  }
}

function checkAppRoutes() {
  section("Expo Router ekranları");
  const required = [
    "app/(tabs)/index.tsx",
    "app/(tabs)/explore/index.tsx",
    "app/(tabs)/explore/_layout.tsx",
    "app/(tabs)/explore/media/[slug].tsx",
    "app/(tabs)/routes/index.tsx",
    "app/(tabs)/routes/_layout.tsx",
    "app/(tabs)/routes/[id].tsx",
    "app/(tabs)/saved.tsx",
    "app/card/_layout.tsx",
    "app/card/[id].tsx",
    "app/_layout.tsx",
    "app/settings.tsx",
    "app/privacy.tsx",
    "app/terms.tsx",
    "app/support.tsx",
    "app/about.tsx",
    "app/error.tsx",
  ];
  for (const rel of required) {
    const full = path.join(mobileDir, rel);
    if (!fs.existsSync(full)) fail(`Eksik ekran: ${rel}`);
    else pass(rel);
  }
}

function checkNavigationExit() {
  section("Geri navigasyon (readerReturn, stack yok)");

  const readerBack = fs.readFileSync(path.join(mobileDir, "hooks", "useReaderBack.ts"), "utf8");
  if (!readerBack.includes("navigateReaderExit")) {
    fail("useReaderBack → navigateReaderExit kullanmalı (router.back yığını yok)");
  } else {
    pass("Kart okuyucu geri: readerReturn + replace");
  }

  const detailBack = fs.readFileSync(path.join(mobileDir, "hooks", "useDetailBack.ts"), "utf8");
  if (!detailBack.includes('mode: DetailBackMode = "stack"') || !detailBack.includes("router.canGoBack()")) {
    fail("useDetailBack stack modunda canGoBack + back desteklemeli");
  } else {
    pass("Ayar/yasal geri: stack modu (back veya fallback)");
  }

  const bad = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".expo") {
        walk(full);
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        const rel = path.relative(mobileDir, full);
        if (rel.startsWith("hooks" + path.sep) || rel === path.join("hooks", "useDetailBack.ts")) continue;
        const text = fs.readFileSync(full, "utf8");
        if (/\brouter\.back\s*\(/.test(text) || /\bcanGoBack\s*\(/.test(text)) {
          bad.push(rel);
        }
      }
    }
  };
  walk(mobileDir);
  if (bad.length) {
    fail(`router.back / canGoBack kullanımı: ${bad.join(", ")} — navigationExit kullanın`);
  } else {
    pass("Mobil kodda router.back / canGoBack yok");
  }

  if (!fs.existsSync(path.join(mobileDir, "utils", "navigationExit.ts"))) {
    fail("utils/navigationExit.ts eksik");
  } else {
    pass("navigationExit merkezi çıkış modülü mevcut");
  }
}

function checkTypeScript() {
  section("TypeScript (mobile/)");
  try {
    execSync("npx tsc --noEmit", { cwd: mobileDir, stdio: "pipe", encoding: "utf8" });
    pass("tsc --noEmit temiz");
  } catch (e) {
    const out = (e.stdout || "") + (e.stderr || "");
    fail("TypeScript hataları:\n" + out.trim());
  }
}

function checkWebExport() {
  section("Expo web export (production bundle)");
  try {
    execSync("npx expo export --platform web --output-dir .expo-check-export", {
      cwd: mobileDir,
      stdio: "pipe",
      encoding: "utf8",
      env: { ...process.env, CI: "1" },
    });
    pass("expo export --platform web başarılı");
    fs.rmSync(path.join(mobileDir, ".expo-check-export"), { recursive: true, force: true });
  } catch (e) {
    const out = (e.stdout || "") + (e.stderr || "");
    fail("Web export başarısız (dev çalışsa bile prod patlayabilir):\n" + out.trim());
  }
}

console.log("Mobil sağlık kontrolü\n");

try {
  execSync("node scripts/setup-mobile-links.mjs", { cwd: root, stdio: "pipe" });
  pass("Monorepo dosyaları mobile/ altına sync edildi");
} catch {
  fail("mobile/ sync başarısız (scripts/setup-mobile-links.mjs)");
}

try {
  execSync("node scripts/check-branding.mjs", { cwd: root, stdio: "pipe" });
  pass("Marka adı True Frame (eski ürün adı yok)");
} catch (e) {
  fail("Marka kontrolü:\n" + ((e.stdout || "") + (e.stderr || "")).trim());
}

checkSharedImports();
checkDataIntegrity();
checkAppRoutes();
checkNavigationExit();
checkTypeScript();

if (withBuild) {
  checkWebExport();
} else {
  console.log("\n→ Production bundle için: npm run mobile:check -- --build");
}

console.log(failures ? `\n${failures} kontrol başarısız.` : "\nTüm kontroller geçti.");
process.exit(failures ? 1 : 0);
