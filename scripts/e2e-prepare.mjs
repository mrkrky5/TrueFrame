#!/usr/bin/env node
/** Build static web bundle for E2E if missing. */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mobileDir = path.join(root, "mobile");
const outDir = path.join(mobileDir, ".expo-e2e");
const force = process.argv.includes("--force");

execSync("node scripts/setup-mobile-links.mjs", { cwd: root, stdio: "inherit" });

if (force && fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}

if (!fs.existsSync(path.join(outDir, "index.html"))) {
  console.log("E2E: building Expo web export (ilk sefer ~30–60 sn)…");
  execSync("npx expo export --platform web --output-dir .expo-e2e", {
    cwd: mobileDir,
    stdio: "inherit",
    env: { ...process.env, CI: "1", EXPO_NO_TELEMETRY: "1" },
  });
  console.log("E2E: export tamam.");
} else {
  console.log("E2E: mevcut export kullanılıyor (.expo-e2e). Yenilemek için: npm run e2e:prepare -- --force");
}
