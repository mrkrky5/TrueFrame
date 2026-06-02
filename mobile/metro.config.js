const { getDefaultConfig } = require("expo/metro-config");
const fs = require("fs");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");
const sharedRoot = path.join(projectRoot, "shared");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

const sharedImport = /^@shared\/(.+)$/;
const defaultResolve = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const match = moduleName.match(sharedImport);
  if (match) {
    const rel = match[1];
    const candidates = [
      path.join(sharedRoot, `${rel}.ts`),
      path.join(sharedRoot, `${rel}.tsx`),
      path.join(sharedRoot, rel, "index.ts"),
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return { type: "sourceFile", filePath: candidate };
      }
    }
  }

  if (defaultResolve) {
    return defaultResolve(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
