#!/usr/bin/env node
/**
 * shared/, data/, types/ ve gerekli lib/ dosyalarını mobile/ altına kopyalar.
 * Metro production bundle, projectRoot dışındaki dosyalarda sorun çıkarır.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileDir = path.resolve(__dirname, "..", "mobile");
const root = path.resolve(mobileDir, "..");

const DATA_RUNTIME_FILES = [
  "cards.tr.json",
  "cards.en.json",
  "cards.index.tr.json",
  "cards.index.en.json",
  "routes.tr.json",
  "routes.en.json",
];

try {
  execSync("node scripts/build-card-index.mjs", { cwd: root, stdio: "pipe" });
} catch (e) {
  console.warn("build-card-index:", e.message);
}

function syncDir(name) {
  const src = path.join(root, name);
  const dest = path.join(mobileDir, name);
  if (!fs.existsSync(src)) {
    console.warn(`Skip: ${src} yok`);
    return;
  }
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Synced mobile/${name}`);
}

function writeMinifiedJson(src, dest) {
  const data = JSON.parse(fs.readFileSync(src, "utf8"));
  fs.writeFileSync(dest, `${JSON.stringify(data)}\n`, "utf8");
}

function syncDataRuntime() {
  const srcDir = path.join(root, "data");
  const destDir = path.join(mobileDir, "data");
  if (!fs.existsSync(srcDir)) {
    console.warn(`Skip: ${srcDir} yok`);
    return;
  }
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of DATA_RUNTIME_FILES) {
    const src = path.join(srcDir, file);
    if (!fs.existsSync(src)) {
      console.warn(`Skip missing data file: ${file}`);
      continue;
    }
    writeMinifiedJson(src, path.join(destDir, file));
  }
  console.log(
    `Synced mobile/data (${DATA_RUNTIME_FILES.length} minified runtime JSON files)`,
  );
}

syncDir("shared");
syncDataRuntime();
syncDir("types");

const mobileLib = path.join(mobileDir, "lib");
fs.rmSync(mobileLib, { recursive: true, force: true });

const dictSrc = path.join(root, "lib", "dictionaries");
const dictDest = path.join(mobileDir, "lib", "dictionaries");
if (fs.existsSync(dictSrc)) {
  fs.mkdirSync(path.dirname(dictDest), { recursive: true });
  fs.rmSync(dictDest, { recursive: true, force: true });
  fs.cpSync(dictSrc, dictDest, { recursive: true });
  console.log("Synced mobile/lib/dictionaries");
}

const i18nSrc = path.join(root, "lib", "i18n-config.ts");
const i18nDest = path.join(mobileDir, "lib", "i18n-config.ts");
if (fs.existsSync(i18nSrc)) {
  fs.mkdirSync(path.dirname(i18nDest), { recursive: true });
  fs.copyFileSync(i18nSrc, i18nDest);
  console.log("Synced mobile/lib/i18n-config.ts");
}

for (const file of ["site-brand.ts", "config.ts"]) {
  const src = path.join(root, "lib", file);
  const dest = path.join(mobileLib, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Synced mobile/lib/${file}`);
  }
}

const clearAppShim = path.join(mobileDir, "lib", "clearAppStorage.ts");
fs.writeFileSync(
  clearAppShim,
  '/** Re-export; canonical module is `@/utils/clearAppStorage`. */\nexport * from "../utils/clearAppStorage";\n'
);
console.log("Wrote mobile/lib/clearAppStorage.ts");
