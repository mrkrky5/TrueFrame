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

  for (const locale of ["tr", "en"]) {
    const indexPath = `data/cards.index.${locale}.json`;
    const index = readJson(indexPath);
    const full = locale === "tr" ? cardsTr : cardsEn;
    if (!index) {
      fail(`Eksik kart index: ${indexPath} — npm run content:build-index`);
      continue;
    }
    if (index.length !== full.length) {
      fail(`${indexPath} (${index.length}) ile cards.${locale}.json (${full.length}) sayı uyuşmuyor`);
    } else {
      pass(`Kart index ${locale.toUpperCase()} (${index.length}) güncel`);
    }
  }

  const flagshipWithoutBlocks = cardsTr.filter(
    (c) => c.isFlagship && !c.contentBlocks?.length && !c.realHistory?.trim()
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

function checkContentAudit() {
  section("İçerik denetimi (audit-content)");
  try {
    const out = execSync("node scripts/audit-content.mjs", { cwd: root, encoding: "utf8" });
    const report = JSON.parse(out);
    const { p0, p1, p2 } = report.summary;
    if (report.summary.p0 > 0) {
      fail(`audit-content P0: ${report.summary.p0} sorun`);
    } else {
      pass(`audit-content P0 temiz (P1=${p1}, P2=${p2})`);
    }
  } catch (e) {
    const out = (e.stdout || "") + (e.stderr || "");
    fail(`audit-content başarısız:\n${out.trim()}`);
  }
}

function checkQualitySignals() {
  section("İçerik kalite sinyalleri");
  try {
    const out = execSync("node scripts/content-quality-signals.mjs", { cwd: root, encoding: "utf8" });
    const report = JSON.parse(out);
    const cCount = (report.summary.tr?.C ?? 0) + (report.summary.en?.C ?? 0);
    const bCount = (report.summary.tr?.B ?? 0) + (report.summary.en?.B ?? 0);
    pass(`Kalite: C-tier=${cCount}, B-tier=${bCount} (rapor: npm run content:quality)`);
    if (cCount > 40) {
      fail(`C-tier kart sayısı yüksek (${cCount}) — öncelikli editör geçişi önerilir`);
    }
  } catch (e) {
    fail(`content-quality-signals:\n${((e.stdout || "") + (e.stderr || "")).trim()}`);
  }
}

function folderSize(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += folderSize(full);
    else total += fs.statSync(full).size;
  }
  return total;
}

function checkIosGestures() {
  section("iOS jestleri (RNGH + stack)");
  const pkg = readJson("mobile/package.json");
  if (!pkg?.dependencies?.["react-native-gesture-handler"]) {
    fail("react-native-gesture-handler mobile/package.json içinde yok");
  } else {
    pass("react-native-gesture-handler bağımlılığı tanımlı");
  }

  const rootLayout = path.join(mobileDir, "app", "_layout.tsx");
  if (!fs.existsSync(rootLayout)) {
    fail("app/_layout.tsx yok");
    return;
  }
  const rootText = fs.readFileSync(rootLayout, "utf8");
  if (!rootText.includes('import "react-native-gesture-handler"')) {
    fail('app/_layout.tsx: import "react-native-gesture-handler" eksik');
  } else {
    pass("RNGH kök import mevcut");
  }
  if (!rootText.includes("GestureHandlerRootView")) {
    fail("app/_layout.tsx: GestureHandlerRootView sarmalayıcı eksik");
  } else {
    pass("GestureHandlerRootView kök sarmalayıcı mevcut");
  }
  if (!/gestureEnabled:\s*true/.test(rootText)) {
    fail("app/_layout.tsx: stack gestureEnabled eksik");
  } else {
    pass("Kök stack gestureEnabled: true");
  }

  const stackLayouts = [
    "app/card/_layout.tsx",
    "app/(tabs)/explore/_layout.tsx",
    "app/(tabs)/routes/_layout.tsx",
  ];
  for (const rel of stackLayouts) {
    const full = path.join(mobileDir, rel);
    if (!fs.existsSync(full)) {
      fail(`${rel} yok`);
      continue;
    }
    const text = fs.readFileSync(full, "utf8");
    if (!/gestureEnabled:\s*true/.test(text) || !/fullScreenGestureEnabled:\s*true/.test(text)) {
      fail(`${rel}: iOS geri kaydırma seçenekleri eksik`);
    } else {
      pass(`${rel} gesture + fullScreenGesture`);
    }
  }

  const babel = path.join(mobileDir, "babel.config.js");
  if (fs.existsSync(babel)) {
    const babelText = fs.readFileSync(babel, "utf8");
    if (!babelText.includes("react-native-reanimated/plugin")) {
      fail("babel.config.js: react-native-reanimated/plugin eksik");
    } else {
      pass("Reanimated Babel eklentisi (jest + animasyon)");
    }
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

    const exportDir = path.join(mobileDir, ".expo-check-export");
    const jsDir = path.join(exportDir, "_expo", "static", "js");
    const jsBytes = fs.existsSync(jsDir) ? folderSize(jsDir) : folderSize(exportDir);
    const mb = jsBytes / (1024 * 1024);
    const BUDGET_MB = 9;
    if (mb > BUDGET_MB) {
      fail(`JS bundle ${mb.toFixed(1)} MB — bütçe ${BUDGET_MB} MB`);
    } else {
      pass(`JS bundle ${mb.toFixed(1)} MB (bütçe ≤${BUDGET_MB} MB)`);
    }

    fs.rmSync(exportDir, { recursive: true, force: true });
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
checkContentAudit();
checkQualitySignals();
checkAppRoutes();
checkNavigationExit();
checkIosGestures();
checkTypeScript();

if (withBuild) {
  checkWebExport();
} else {
  console.log("\n→ Production bundle için: npm run mobile:check -- --build");
}

console.log(failures ? `\n${failures} kontrol başarısız.` : "\nTüm kontroller geçti.");
process.exit(failures ? 1 : 0);
