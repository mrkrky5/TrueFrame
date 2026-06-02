#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const aliasSrc = fs.readFileSync(path.join(root, "shared/cardAliases.ts"), "utf8");
const aliases = {};
for (const m of aliasSrc.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
  aliases[m[1]] = m[2];
}

function normalizeCardIds(ids) {
  const seen = new Set();
  const out = [];
  for (const raw of ids) {
    const id = aliases[raw] || raw;
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

for (const file of ["data/routes.tr.json", "data/routes.en.json"]) {
  const full = path.join(root, file);
  const routes = JSON.parse(fs.readFileSync(full, "utf8"));
  let changes = 0;
  for (const route of routes) {
    const before = route.cardIds.join(",");
    route.cardIds = normalizeCardIds(route.cardIds);
    if (route.cardIds.join(",") !== before) changes++;
  }
  fs.writeFileSync(full, JSON.stringify(routes, null, 2) + "\n");
  console.log(`${file}: ${changes} rota güncellendi`);
}
