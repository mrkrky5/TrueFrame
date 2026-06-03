#!/usr/bin/env node
/**
 * icon1.png → icon.png (1024), splash-icon.png, favicon.png (48)
 * Removes icon1.png after success.
 *
 *   npm install --no-save sharp
 *   node scripts/apply-app-icon.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dir = path.join(root, "mobile", "assets", "images");
const src = path.join(dir, "icon1.png");

if (!fs.existsSync(src)) {
  console.error("Missing mobile/assets/images/icon1.png");
  process.exit(1);
}

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("Install sharp once: npm install --no-save sharp");
  process.exit(1);
}

const meta = await sharp(src).metadata();
console.log(`Source: ${meta.width}x${meta.height}`);

async function write(name, size) {
  const out = path.join(dir, name);
  await sharp(src)
    .resize(size, size, { fit: "cover", position: "center" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(out);
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`  ${name} → ${size}x${size} (${kb} KB)`);
}

await write("icon.png", 1024);
await write("splash-icon.png", 512);
await write("favicon.png", 48);

fs.unlinkSync(src);
console.log("\nRemoved icon1.png (merged into icon.png).");
console.log("Rebuild iOS: eas build -p ios --profile production");
