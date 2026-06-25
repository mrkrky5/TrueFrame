#!/usr/bin/env node
/**
 * Compose marketing-style App Store screenshots from resized device captures.
 *
 * Input:  dist/app-store-screenshots-1284x2778/*.png
 * Output: dist/app-store-screenshots-marketing-1284x2778/{en,tr}/
 *
 * Usage:
 *   node scripts/compose-app-store-screenshots.mjs [inputDir] [outputDir]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const W = 1284;
const H = 2778;

const COLORS = {
  bgTop: "#F7F3EC",
  bgMid: "#EDE9E1",
  bgBottom: "#E4DDD2",
  ink: "#0A0A0A",
  muted: "#5C5C5C",
  accent: "#8B4513",
  bezel: "#1C1C1E",
  bezelHighlight: "#3A3A3C",
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputDir =
  process.argv[2] || path.join(root, "dist", "app-store-screenshots-1284x2778");
const outputRoot =
  process.argv[3] ||
  path.join(root, "dist", "app-store-screenshots-marketing-1284x2778");

const copy = JSON.parse(
  fs.readFileSync(
    path.join(root, "scripts", "app-store-screenshot-copy.json"),
    "utf8"
  )
);

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function backgroundSvg() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLORS.bgTop}"/>
      <stop offset="55%" stop-color="${COLORS.bgMid}"/>
      <stop offset="100%" stop-color="${COLORS.bgBottom}"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="18%" r="45%">
      <stop offset="0%" stop-color="${COLORS.accent}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${COLORS.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
</svg>`);
}

function headlineSvg(headline, subhead) {
  const lines = headline.split("\n");
  const lineHeight = 86;
  const startY = 148;
  const headlineSpans = lines
    .map(
      (line, i) =>
        `<tspan x="642" dy="${i === 0 ? 0 : lineHeight}" text-anchor="middle">${escapeXml(line)}</tspan>`
    )
    .join("");

  return Buffer.from(`<svg width="${W}" height="420" xmlns="http://www.w3.org/2000/svg">
  <text x="642" y="${startY}" font-family="Georgia, 'Times New Roman', serif" font-size="72" font-weight="700" fill="${COLORS.ink}" letter-spacing="-1.5">
    ${headlineSpans}
  </text>
  <text x="642" y="${startY + lines.length * lineHeight + 36}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" fill="${COLORS.muted}">
    ${escapeXml(subhead)}
  </text>
  <rect x="602" y="${startY + lines.length * lineHeight + 68}" width="80" height="4" rx="2" fill="${COLORS.accent}" opacity="0.85"/>
</svg>`);
}

function roundMask(width, height, radius) {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="white"/>
    </svg>`
  );
}

function shadowSvg(width, height, radius, offsetY = 28) {
  return Buffer.from(`<svg width="${width}" height="${height + offsetY + 40}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="28"/>
      </filter>
    </defs>
    <rect x="0" y="${offsetY}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#000000" opacity="0.22" filter="url(#blur)"/>
  </svg>`);
}

function bezelSvg(screenW, screenH, radius, bezel = 14) {
  const outerW = screenW + bezel * 2;
  const outerH = screenH + bezel * 2;
  return Buffer.from(`<svg width="${outerW}" height="${outerH}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="${outerW}" height="${outerH}" rx="${radius + bezel}" ry="${radius + bezel}" fill="${COLORS.bezel}"/>
    <rect x="${bezel}" y="${bezel}" width="${screenW}" height="${screenH}" rx="${radius}" ry="${radius}" fill="${COLORS.bezelHighlight}"/>
    <rect x="${bezel + 2}" y="${bezel + 2}" width="${screenW - 4}" height="${screenH - 4}" rx="${radius - 2}" ry="${radius - 2}" fill="#000"/>
  </svg>`);
}

async function prepareScreen(inputPath) {
  const meta = await sharp(inputPath).metadata();
  const cropTop = Math.round(meta.height * 0.052);
  const cropped = await sharp(inputPath)
    .extract({
      left: 0,
      top: cropTop,
      width: meta.width,
      height: meta.height - cropTop,
    })
    .toBuffer();

  const screenW = 944;
  const screenH = Math.round((screenW / meta.width) * (meta.height - cropTop));
  const radius = 52;

  const screen = await sharp(cropped)
    .resize(screenW, screenH, { fit: "fill" })
    .png()
    .toBuffer();

  const rounded = await sharp(screen)
    .composite([{ input: roundMask(screenW, screenH, radius), blend: "dest-in" }])
    .png()
    .toBuffer();

  const bezel = 14;
  const outerW = screenW + bezel * 2;
  const outerH = screenH + bezel * 2;

  const shadow = await sharp(shadowSvg(outerW, outerH, radius + bezel))
    .png()
    .toBuffer();

  const frame = await sharp(bezelSvg(screenW, screenH, radius))
    .composite([{ input: rounded, left: bezel, top: bezel }])
    .png()
    .toBuffer();

  return { frame, shadow, outerW, outerH };
}

async function composeOne(inputPath, outputPath, headline, subhead) {
  const { frame, shadow, outerW, outerH } = await prepareScreen(inputPath);

  const phoneTop = 430;
  const phoneLeft = Math.round((W - outerW) / 2);
  const shadowLeft = phoneLeft;
  const shadowTop = phoneTop - 8;

  const background = await sharp(backgroundSvg()).png().toBuffer();
  const headlineLayer = await sharp(headlineSvg(headline, subhead)).png().toBuffer();

  await sharp(background)
    .composite([
      {
        input: shadow,
        left: shadowLeft,
        top: shadowTop,
      },
      {
        input: frame,
        left: phoneLeft,
        top: phoneTop,
      },
      {
        input: headlineLayer,
        left: 0,
        top: 0,
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function runLocale(locale, files) {
  const outDir = path.join(outputRoot, locale);
  fs.mkdirSync(outDir, { recursive: true });
  const results = [];

  for (const [fileName, text] of Object.entries(files)) {
    const input = path.join(inputDir, fileName);
    if (!fs.existsSync(input)) {
      console.warn(`SKIP  missing ${fileName}`);
      continue;
    }
    const output = path.join(outDir, fileName);
    await composeOne(input, output, text.headline, text.subhead);
    const meta = await sharp(output).metadata();
    results.push({
      fileName,
      width: meta.width,
      height: meta.height,
      ok: meta.width === W && meta.height === H,
    });
    console.log(`OK    ${locale}/${fileName}`);
  }

  return results;
}

async function main() {
  if (!fs.existsSync(inputDir)) {
    console.error("Input dir not found:", inputDir);
    process.exit(1);
  }

  const manifest = {
    target: `${W}x${H}`,
    inputDir,
    outputRoot,
    locales: {},
  };

  for (const locale of ["en", "tr"]) {
    manifest.locales[locale] = await runLocale(locale, copy[locale]);
  }

  fs.writeFileSync(
    path.join(outputRoot, "README.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  console.log(`\nOutput: ${outputRoot}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
