#!/usr/bin/env node
/**
 * Windows → Mac aktarım paketi (kurulumu bozmaz).
 *
 *   node scripts/pack-mac-drop.mjs
 *       → data + sözlük + swipe (7 dosya) + MAC-DELETE listesi
 *   node scripts/pack-mac-drop.mjs --content-only
 *       → yalnızca data + sözlük (swipe yok)
 *   node scripts/pack-mac-drop.mjs --mobile
 *       → yukarı + tüm mobile kaynak (node_modules / ios / .expo yok)
 *   node scripts/pack-mac-drop.mjs --code --mobile
 *       → + shared, types, lib/*.ts
 *
 * Mac: zip'i repo köküne aç → ./mac-delete.sh (varsa) → npm run mobile:sync → eas build
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const contentOnly = process.argv.includes("--content-only");
const withSwipe = !contentOnly;
const withCode = process.argv.includes("--code");
const withMobile = process.argv.includes("--mobile");

const manifestPath = path.join(root, "data", "mac-drop-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const stamp = new Date().toISOString().slice(0, 10);
const tag = [
  withSwipe && "swipe",
  withCode && "code",
  withMobile && "mobile",
  contentOnly && "content",
]
  .filter(Boolean)
  .join("-") || "drop";
const zipName = `trueframe-mac-${tag}-${stamp}.zip`;
const distDir = path.join(root, "dist");
const stage = path.join(distDir, ".mac-drop-staging");

function cp(rel) {
  const src = path.join(root, rel);
  if (!fs.existsSync(src)) {
    console.warn(`  skip (yok): ${rel}`);
    return false;
  }
  const dest = path.join(stage, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.copyFileSync(src, dest);
  }
  console.log(`  + ${rel}`);
  return true;
}

fs.rmSync(stage, { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });

console.log("Paketleniyor…\n");

cp("data");
cp("lib/dictionaries");

if (withCode) {
  for (const dir of ["shared", "types"]) cp(dir);
  for (const file of ["lib/i18n-config.ts", "lib/config.ts", "lib/site-brand.ts"]) cp(file);
}

if (withSwipe) {
  console.log("\n── Swipe / kart stack (7 dosya) ──");
  let copied = 0;
  for (const rel of manifest.swipeCopy) {
    if (cp(rel)) copied++;
  }
  if (copied !== manifest.swipeCopy.length) {
    console.warn(
      `\nUyarı: ${manifest.swipeCopy.length - copied} swipe dosyası eksik (repo kontrol et).`
    );
  }

  const deleteList = manifest.deleteOnMac.join("\n");
  const optionalDirs = (manifest.deleteOptionalDirs ?? []).join("\n");
  fs.writeFileSync(
    path.join(stage, "MAC-DELETE.txt"),
    `# Mac'te zip açtıktan SONRA sil (eski route çakışmasını önler)\n\n${deleteList}\n\n# İçi boşsa klasörü de sil:\n${optionalDirs}\n\n# veya: chmod +x mac-delete.sh && ./mac-delete.sh\n`,
    "utf8"
  );

  const shLines = [
    "#!/bin/bash",
    "set -euo pipefail",
    'ROOT="$(cd "$(dirname "$0")" && pwd)"',
    'echo "Mac drop: eski dosyalar siliniyor…"',
  ];
  for (const rel of manifest.deleteOnMac) {
    shLines.push(`rm -f "$ROOT/${rel}"`);
  }
  for (const rel of manifest.deleteOptionalDirs ?? []) {
    shLines.push(`rmdir "$ROOT/${rel}" 2>/dev/null || true`);
  }
  shLines.push('echo "Tamam."');
  fs.writeFileSync(path.join(stage, "mac-delete.sh"), `${shLines.join("\n")}\n`, "utf8");
  console.log("  + MAC-DELETE.txt");
  console.log("  + mac-delete.sh");
}

const MOBILE_SRC = [
  "mobile/app",
  "mobile/components",
  "mobile/context",
  "mobile/hooks",
  "mobile/utils",
  "mobile/constants",
  "mobile/assets",
  "mobile/app.json",
  "mobile/package.json",
  "mobile/package-lock.json",
  "mobile/tsconfig.json",
  "mobile/babel.config.js",
  "mobile/metro.config.js",
  "mobile/eas.json",
];

if (withMobile) {
  console.log("\n── Mobil kaynak (tam) ──");
  for (const rel of MOBILE_SRC) cp(rel);
}

const swipeNote = withSwipe
  ? `
4. **Swipe fix (henüz Mac'e gitmemiş 7 dosya)** zip'te — üzerine yaz.
5. **Mac'te sil:** \`chmod +x mac-delete.sh && ./mac-delete.sh\`
   veya MAC-DELETE.txt'teki 3 dosyayı elle sil:
   - mobile/app/(tabs)/card/[id].tsx
   - mobile/app/(tabs)/card/_layout.tsx
   - mobile/hooks/useReaderGestureBack.ts
`
  : "";

const readme = `# True Frame — Mac unpack

1. Zip'i **mevcut repo köküne** aç (TrueFrame/ veya Tarih/).
2. Dokunulmaz (zip'te yok): mobile/node_modules, mobile/.expo, mobile/ios, .env
${swipeNote}
3. Terminal:
   cd /path/to/Tarih
   ${withSwipe ? "./mac-delete.sh\n   " : ""}npm run mobile:sync
   cd mobile
   npx expo start
   # TestFlight: npx eas build -p ios --profile production

Profil: ${tag}
Oluşturulma: ${new Date().toISOString()}
`;
fs.writeFileSync(path.join(stage, "MAC-UNPACK.txt"), readme, "utf8");

fs.mkdirSync(distDir, { recursive: true });
const zipPath = path.join(distDir, zipName);
if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

const tarCmd =
  process.platform === "win32"
    ? `tar -a -cf "${zipPath}" -C "${stage}" .`
    : `tar -czf "${zipPath}" -C "${stage}" .`;

execSync(tarCmd, { stdio: "inherit", cwd: root });
fs.rmSync(stage, { recursive: true, force: true });

const mb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(1);
console.log(`\n✓ ${zipPath} (${mb} MB)`);
if (withSwipe) {
  console.log("  İçerik: data + sözlük + swipe (7) + MAC-DELETE + mac-delete.sh");
}
console.log("\nMac: unzip → mac-delete.sh → mobile:sync → eas build");
