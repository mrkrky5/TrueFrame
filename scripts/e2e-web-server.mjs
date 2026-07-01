#!/usr/bin/env node
/** Lightweight static server for Playwright (no npx serve). */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "mobile", ".expo-e2e");
const port = Number(process.env.E2E_PORT || 4173);
const host = "127.0.0.1";

if (!fs.existsSync(path.join(outDir, "index.html"))) {
  console.error("E2E build yok. Önce: npm run e2e:prepare");
  process.exit(1);
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function send(res, code, body, type = "text/plain; charset=utf-8") {
  res.writeHead(code, { "Content-Type": type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const raw = (req.url || "/").split("?")[0];
  const rel = decodeURIComponent(raw === "/" ? "/index.html" : raw);
  let file = path.normalize(path.join(outDir, rel));

  if (!file.startsWith(outDir)) return send(res, 403, "Forbidden");

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(outDir, "index.html");
  }

  try {
    const data = fs.readFileSync(file);
    const ext = path.extname(file).toLowerCase();
    send(res, 200, data, MIME[ext] || "application/octet-stream");
  } catch {
    send(res, 404, "Not found");
  }
});

server.listen(port, host, () => {
  console.log(`E2E server ready http://${host}:${port}`);
});
