#!/usr/bin/env node
/**
 * Tüm proje kaynağını tek zip (Mac’te klasörü komple yenilemek için).
 * Hariç: node_modules, .expo, ios, .env, dist, .git, build çıktıları
 *
 *   npm run pack:mac:project
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const stage = path.join(distDir, ".mac-full-staging");
const stamp = new Date().toISOString().slice(0, 10);
const zipName = `trueframe-mac-project-${stamp}.zip`;
const zipPath = path.join(distDir, zipName);

const manifestPath = path.join(root, "data", "mac-drop-manifest.json");
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : { deleteOnMac: [], deleteOptionalDirs: [] };

/** Klasör adı eşleşirse tüm alt ağaç atlanır */
const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".expo",
  ".next",
  "out",
  "build",
  "dist",
  ".git",
  "coverage",
  ".vercel",
  ".expo-check-export",
  ".vscode",
  "ios",
  "android",
  ".cursor",
  ".claude",
]);

const SKIP_FILE_NAMES = new Set([".DS_Store"]);
const SKIP_FILE_EXT = [".tsbuildinfo", ".pem"];
const SKIP_REL_PREFIXES = [
  "dist/",
  ...manifest.deleteOnMac.map((p) => p.replace(/\\/g, "/")),
];

function shouldSkip(relPosix) {
  if (SKIP_REL_PREFIXES.some((p) => relPosix === p || relPosix.startsWith(`${p}/`))) {
    return true;
  }
  const parts = relPosix.split("/");
  if (parts.some((p) => SKIP_DIR_NAMES.has(p))) return true;
  const base = parts[parts.length - 1];
  if (SKIP_FILE_NAMES.has(base)) return true;
  if (base.startsWith(".env")) return true;
  if (SKIP_FILE_EXT.some((ext) => base.endsWith(ext))) return true;
  if (base.endsWith(".zip") && parts[0] === "dist") return true;
  return false;
}

function copyTree(srcDir, destDir, rel = "") {
  for (const name of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const relPosix = rel ? `${rel}/${name.name}` : name.name;
    if (shouldSkip(relPosix)) continue;
    const src = path.join(srcDir, name.name);
    const dest = path.join(destDir, name.name);
    if (name.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      copyTree(src, dest, relPosix);
    } else {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }
}

// Eski swipe route dosyalarını Windows’ta da pakete sokma
for (const rel of manifest.deleteOnMac ?? []) {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { force: true });
    console.log(`  (kaldırıldı, zip’e girmez) ${rel}`);
  }
}
for (const rel of manifest.deleteOptionalDirs ?? []) {
  const p = path.join(root, rel);
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

fs.rmSync(stage, { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });

console.log("Tam proje paketleniyor (node_modules / ios / .env hariç)…\n");
try {
  execSync("node scripts/setup-mobile-links.mjs", { stdio: "inherit", cwd: root });
} catch (e) {
  console.warn("mobile:sync atlanamadı:", e.message);
}
copyTree(root, stage);

const readme = `# True Frame — tam proje (Mac)

## Mac’te önerilen yol (replace sorunu yaşamıyorsan)

1. Eski klasörü yedekle:
   mv ~/path/to/Tarih ~/path/to/Tarih-backup-$(date +%Y%m%d)

2. Yeni klasör oluştur, zip’i içine aç:
   mkdir -p ~/path/to/Tarih
   cd ~/path/to
   unzip ~/Downloads/${zipName} -d Tarih

3. **Eski Mac kurulumundan kopyala** (yedekten):
   - Tarih-backup-*/mobile/ios/  →  Tarih/mobile/ios/
   - Tarih-backup-*/.env*         →  Tarih/  (varsa)
   - Tarih-backup-*/mobile/.env*  →  Tarih/mobile/  (varsa)

4. Kurulum + build:
   cd ~/path/to/Tarih
   npm install
   cd mobile && npm install && cd ..
   npm run mobile:sync
   cd mobile
   npx eas build -p ios --profile production

## Mevcut klasörün ÜZERİNE açmak istersen

- Zip’i aynı köke aç → Replace.
- mobile/ios ve .env silinmiş olabilir → yedekten geri kopyala.
- Sonra: npm install, cd mobile && npm install, npm run mobile:sync, eas build

## Zip’te yok (Mac’te yeniden oluşur)

node_modules, mobile/node_modules, mobile/.expo, mobile/ios, .env

Oluşturulma: ${new Date().toISOString()}
`;
fs.writeFileSync(path.join(stage, "MAC-FULL-UNPACK.txt"), readme, "utf8");

// mac-delete (eski Mac’te kalmış dosyalar için)
if (manifest.deleteOnMac?.length) {
  const sh = [
    "#!/bin/bash",
    "set -euo pipefail",
    'ROOT="$(cd "$(dirname "$0")" && pwd)"',
    'echo "Eski swipe dosyaları siliniyor…"',
    ...manifest.deleteOnMac.map((rel) => `rm -f "$ROOT/${rel}"`),
    ...(manifest.deleteOptionalDirs ?? []).map(
      (rel) => `rmdir "$ROOT/${rel}" 2>/dev/null || true`
    ),
    'echo "Tamam."',
  ];
  fs.writeFileSync(path.join(stage, "mac-delete.sh"), `${sh.join("\n")}\n`, "utf8");
}

fs.mkdirSync(distDir, { recursive: true });
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const tarCmd =
  process.platform === "win32"
    ? `tar -a -cf "${zipPath}" -C "${stage}" .`
    : `tar -czf "${zipPath}" -C "${stage}" .`;

execSync(tarCmd, { stdio: "inherit", cwd: root });
fs.rmSync(stage, { recursive: true, force: true });

const mb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(1);
console.log(`\n✓ ${zipPath} (${mb} MB)`);
console.log("Mac: yedek al → yeni klasöre aç → ios/.env yedekten kopyala → npm install → eas build");
