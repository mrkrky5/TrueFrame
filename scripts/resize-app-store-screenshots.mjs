#!/usr/bin/env node
/**
 * Resize iPhone screenshots to App Store Connect 6.5" accepted sizes.
 * Default output: 1284×2778 (portrait, #EDE9E1 letterbox if needed).
 *
 * Usage:
 *   node scripts/resize-app-store-screenshots.mjs [inputDir] [outputDir]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const TARGET_W = 1284;
const TARGET_H = 2778;
const BG = { r: 237, g: 233, b: 225, alpha: 1 }; // #EDE9E1

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputDir =
  process.argv[2] ||
  path.join(
    process.env.USERPROFILE || "",
    ".cursor",
    "projects",
    "c-Users-Emre-Desktop-Tarih",
    "assets"
  );
const outputDir =
  process.argv[3] || path.join(root, "dist", "app-store-screenshots-1284x2778");

const files = fs
  .readdirSync(inputDir)
  .filter((f) => /IMG_604\d|IMG_6050/i.test(f) && /\.(png|jpe?g)$/i.test(f))
  .sort();

if (!files.length) {
  console.error("No IMG_604x / IMG_6050 screenshots in:", inputDir);
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const results = [];

for (const file of files) {
  const input = path.join(inputDir, file);
  const match = file.match(/IMG_(\d+)/i);
  const id = match ? match[1] : file.replace(/\W+/g, "_");
  const outName = `iphone-65-${id}.png`;
  const output = path.join(outputDir, outName);

  await sharp(input)
    .resize(TARGET_W, TARGET_H, { fit: "contain", background: BG })
    .png({ compressionLevel: 9 })
    .toFile(output);

  const meta = await sharp(output).metadata();
  results.push({
    outName,
    width: meta.width,
    height: meta.height,
    ok: meta.width === TARGET_W && meta.height === TARGET_H,
  });
}

const manifest = {
  target: `${TARGET_W}x${TARGET_H}`,
  acceptedByConnect: [
    "1242x2688",
    "2688x1242",
    "1284x2778",
    "2778x1284",
  ],
  files: results,
  suggestedTrOrder: [
    "iphone-65-6040.png — Onboarding TR",
    "iphone-65-6043.png — Ana sayfa TR",
    "iphone-65-6045.png — Keşfet TR",
    "iphone-65-6049.png — Rotalar TR",
    "iphone-65-6050.png — Rota detay TR",
  ],
  suggestedEnOrder: [
    "iphone-65-6041.png — Onboarding EN",
    "iphone-65-6044.png — Home EN",
    "iphone-65-6046.png — Explore EN",
    "iphone-65-6047.png — Routes EN",
    "iphone-65-6048.png — Route detail EN",
  ],
};

fs.writeFileSync(
  path.join(outputDir, "README.json"),
  JSON.stringify(manifest, null, 2),
  "utf8"
);

console.log(`Output: ${outputDir}\n`);
for (const r of results) {
  console.log(
    `${r.ok ? "OK" : "FAIL"}  ${r.outName}  ${r.width}x${r.height}`
  );
}

const allOk = results.every((r) => r.ok);
process.exit(allOk ? 0 : 1);
