#!/usr/bin/env node
/**
 * Remove tf26-* card ids from route lists (curated routes = legacy quality only).
 * Cards stay in cards.*.json for Explore catalog.
 *
 *   node scripts/prune-tf26-from-routes.mjs
 *   node scripts/prune-tf26-from-routes.mjs --write
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const write = process.argv.includes("--write");
const prefix = "tf26-";

function pruneRoutes(filePath) {
  const routes = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let removed = 0;
  for (const route of routes) {
    const before = route.cardIds.length;
    route.cardIds = route.cardIds.filter((id) => !id.startsWith(prefix));
    removed += before - route.cardIds.length;
  }
  return { routes, removed };
}

for (const name of ["routes.tr.json", "routes.en.json"]) {
  const filePath = path.join(root, "data", name);
  const { routes, removed } = pruneRoutes(filePath);
  console.log(`${name}: removed ${removed} tf26 ids from routes`);
  if (write) {
    fs.writeFileSync(filePath, `${JSON.stringify(routes, null, 2)}\n`, "utf8");
  }
}

if (!write) console.log("\nDry run. Pass --write to apply.");
