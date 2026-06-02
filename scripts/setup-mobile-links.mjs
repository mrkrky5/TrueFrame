#!/usr/bin/env node
/**
 * shared/, data/, types/ ve gerekli lib/ dosyalarını mobile/ altına kopyalar.
 * Metro production bundle, projectRoot dışındaki dosyalarda sorun çıkarır.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileDir = path.resolve(__dirname, "..", "mobile");
const root = path.resolve(mobileDir, "..");

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

syncDir("shared");
syncDir("data");
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
