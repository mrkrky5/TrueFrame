#!/usr/bin/env node
/**
 * Eski ürün adı "Medyadan Gerçeğe" kullanıcıya görünen dosyalarda kalmamalı.
 * Eski domain/e-posta (medyadangercege.com) de taranır.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const BANNED = [
  /medyadan\s+gerçeğe/gi,
  /medyadan\s+gercege/gi,
  /medyadan\s+gerçege/gi,
  /medyadangercege\.com/gi,
  /iletisim@medyadangercege\.com/gi,
  /com\.medyadangercege\.app/gi,
];

const SCAN_DIRS = ["mobile", "lib", "shared", "data", "docs"];
const SCAN_FILES = ["package.json", "mobile/app.json"];
const SKIP_FILES = new Set([
  "scripts/check-branding.mjs",
  "scripts/check-mobile.mjs",
]);
const SKIP = new Set(["node_modules", ".git", ".expo", ".expo-check-export", "dist", "out", ".next"]);

function shouldScan(file) {
  return /\.(tsx?|jsx?|json|html|css|md|mjs)$/.test(file);
}

function walk(dir, hits) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, hits);
    else if (shouldScan(name)) scanFile(p, hits);
  }
}

function scanFile(filePath, hits) {
  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  if (SKIP_FILES.has(rel)) return;
  if (rel.includes("docs/incoming/") || rel.includes("docs/archive/")) return;
  if (rel === "scripts/check-branding.mjs") return;
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const re of BANNED) {
      if (re.test(lines[i])) {
        hits.push({ file: rel, line: i + 1, text: lines[i].trim().slice(0, 120) });
        re.lastIndex = 0;
      }
    }
  }
}

const hits = [];
for (const d of SCAN_DIRS) walk(path.join(root, d), hits);
for (const f of SCAN_FILES) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) scanFile(p, hits);
}

if (hits.length) {
  console.error("Eski marka adı bulundu (Medyadan Gerçeğe):\n");
  for (const h of hits) console.error(`  ${h.file}:${h.line}  ${h.text}`);
  process.exit(1);
}
console.log("✓ Marka kontrolü: True Frame (trueframe.app, eski ad/domain yok)");
