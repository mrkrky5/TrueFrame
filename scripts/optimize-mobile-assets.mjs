#!/usr/bin/env node
/**
 * mobile/assets görsellerini Expo gereksinimlerine uygun şekilde sıkıştırır.
 * Gereksinim: npx pngquant-bin (otomatik indirilir)
 *
 *   node scripts/optimize-mobile-assets.mjs
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const imagesDir = path.join(root, "mobile", "assets", "images");

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("Install sharp: npm install --no-save sharp");
  process.exit(1);
}

async function ensureSize(name, size) {
  const file = path.join(imagesDir, name);
  const meta = await sharp(file).metadata();
  if (meta.width === size && meta.height === size) return;
  const tmp = `${file}.resize.tmp.png`;
  await sharp(file)
    .resize(size, size, { fit: "cover", position: "center" })
    .png({ compressionLevel: 9 })
    .toFile(tmp);
  fs.renameSync(tmp, file);
}

function pngquant(file, quality) {
  const before = fs.statSync(file).size;
  const tmp = `${file}.opt.tmp.png`;
  execSync(
    `npx --yes pngquant-bin --quality=${quality} --speed 1 --force --output "${tmp}" "${file}"`,
    { stdio: "pipe" },
  );
  fs.renameSync(tmp, file);
  const after = fs.statSync(file).size;
  return { before, after };
}

await ensureSize("icon.png", 1024);
await ensureSize("splash-icon.png", 512);

const icon = pngquant(path.join(imagesDir, "icon.png"), "65-88");
const splash = pngquant(path.join(imagesDir, "splash-icon.png"), "75-92");

console.log(
  JSON.stringify(
    {
      icon: { ...icon, savedPct: Math.round((1 - icon.after / icon.before) * 100) },
      splash: { ...splash, savedPct: Math.round((1 - splash.after / splash.before) * 100) },
    },
    null,
    2,
  ),
);
