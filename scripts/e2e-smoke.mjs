#!/usr/bin/env node
/**
 * Browser E2E smoke (Playwright chromium API — avoids hung `playwright test` CLI on some Windows setups).
 * Run: npm run e2e
 */
import { chromium } from "@playwright/test";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = process.env.E2E_PORT || "4173";
const baseURL = `http://127.0.0.1:${port}`;

const tabs = {
  home: "Ana Sayfa",
  explore: "Keşfet",
  routes: "Rotalar",
  saved: "Kitaplık",
  settings: "Ayarlar",
};

async function serverUp() {
  try {
    return (await fetch(baseURL)).ok;
  } catch {
    return false;
  }
}

async function ensureServer() {
  if (await serverUp()) {
    console.log(`E2E: server ${baseURL}`);
    return null;
  }
  const child = spawn("node", ["scripts/e2e-web-server.mjs"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, E2E_PORT: port },
  });
  child.stdout?.on("data", (d) => process.stdout.write(d));
  child.stderr?.on("data", (d) => process.stderr.write(d));
  for (let i = 0; i < 150; i++) {
    if (await serverUp()) return child;
    await new Promise((r) => setTimeout(r, 200));
  }
  child.kill();
  throw new Error(`Server did not start: ${baseURL}`);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function waitForApp(page) {
  await page.goto(baseURL, { waitUntil: "networkidle", timeout: 45_000 });
  await page.getByRole("button", { name: tabs.home, exact: true }).waitFor({ timeout: 45_000 });
}

async function runTests(page) {
  console.log("  · tab bar");
  for (const label of Object.values(tabs)) {
    assert(await page.getByRole("button", { name: label, exact: true }).isVisible(), `tab missing: ${label}`);
  }

  console.log("  · explore screen");
  await page.goto(`${baseURL}/explore`, { waitUntil: "networkidle" });
  assert(page.url().includes("/explore"), "explore URL");
  await page.getByText("Keşfet").first().waitFor();

  console.log("  · settings screen");
  await page.goto(`${baseURL}/settings`, { waitUntil: "networkidle" });
  assert(page.url().includes("/settings"), "settings URL");
  await page.getByText("Dil", { exact: true }).waitFor();

  console.log("  · daily card CTA visible");
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Her gün yeni bir gerçeklik kontrolü/i }).waitFor();

  console.log("  · card reader loads");
  await page.goto(`${baseURL}/card/ac-odyssey-athens`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Geri", exact: true }).waitFor({ timeout: 20_000 });
  await page.getByText(/Renkli Atina/i).first().waitFor({ timeout: 15_000 });

  console.log("  · routes screen");
  await page.goto(`${baseURL}/routes`, { waitUntil: "networkidle" });
  assert(page.url().includes("/routes"), "routes URL");
  await page.getByText("Rotalar").first().waitFor();
}

console.log("E2E: prepare…");
execSync("node scripts/e2e-prepare.mjs", { cwd: root, stdio: "inherit" });

let server = null;
let browser = null;
let exitCode = 1;

try {
  server = await ensureServer();
  console.log("E2E: launching browser…");
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const page = await browser.newPage();
  console.log("E2E: smoke tests…");
  await waitForApp(page);
  await runTests(page);
  console.log("\nE2E: 6/6 passed");
  exitCode = 0;
} catch (e) {
  console.error("\nE2E FAILED:", e instanceof Error ? e.message : e);
} finally {
  await browser?.close().catch(() => {});
  server?.kill("SIGTERM");
  process.exit(exitCode);
}
