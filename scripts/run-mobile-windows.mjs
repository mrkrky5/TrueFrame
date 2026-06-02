import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mobileDir = path.join(root, "mobile");

function run(command, args, { cwd = root, env = {} } = {}) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("node", ["scripts/setup-mobile-links.mjs"]);
run("npm", ["run", "web"], {
  cwd: mobileDir,
  env: { EXPO_PUBLIC_RESET_FIRST_RUN: "true" },
});
