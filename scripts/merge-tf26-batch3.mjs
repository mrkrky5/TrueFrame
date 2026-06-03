#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BATCH3 } from "./batch3-patches-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const [block, add] of Object.entries(BATCH3)) {
  const filePath = path.join(root, "data", "tf26-patches", `${block}.json`);
  const doc = JSON.parse(fs.readFileSync(filePath, "utf8"));
  doc.cardIds = [...new Set([...(doc.cardIds || []), ...add.cardIds])];
  doc.patches = { ...doc.patches, ...add.patches };
  fs.writeFileSync(filePath, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
  console.log(`${block}: +${add.cardIds.length}`);
}
