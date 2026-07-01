#!/usr/bin/env node
/**
 * E2E runner: prepare → start server → playwright → stop server.
 */
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const port = process.env.E2E_PORT || "4173";
const baseURL = `http://127.0.0.1:${port}`;

async function serverUp() {
  try {
    const res = await fetch(baseURL);
    return res.ok;
  } catch {
    return false;
  }
}

console.log("E2E: prepare…");
execSync("node scripts/e2e-prepare.mjs", { cwd: root, stdio: "inherit" });

let server = null;
let ownedServer = false;

if (await serverUp()) {
  console.log(`E2E: reusing server at ${baseURL}`);
} else {
  console.log("E2E: starting static server…");
  ownedServer = true;
  server = spawn("node", ["scripts/e2e-web-server.mjs"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, E2E_PORT: port },
  });
  server.stdout?.on("data", (d) => process.stdout.write(d));
  server.stderr?.on("data", (d) => process.stderr.write(d));
  server.on("error", (e) => console.error("E2E server error:", e.message));

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (await serverUp()) break;
    await new Promise((r) => setTimeout(r, 200));
  }
  if (!(await serverUp())) {
    console.error(`E2E: server failed to start at ${baseURL}`);
    server?.kill();
    process.exit(1);
  }
}

function runPlaywright() {
  return new Promise((resolve, reject) => {
    const bin = path.join(root, "node_modules", "@playwright", "test", "cli.js");
    const child = spawn(process.execPath, [bin, "test", "--config", "playwright.config.mjs"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`playwright exit ${code}`))));
    child.on("error", reject);
  });
}

let exitCode = 1;
try {
  console.log("E2E: running Playwright…");
  await runPlaywright();
  exitCode = 0;
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
} finally {
  if (ownedServer) server?.kill("SIGTERM");
  process.exit(exitCode);
}
