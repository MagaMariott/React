import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// One id per build. The page shows it, and the service worker names its cache after it.
const buildVersion = new Date().toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)],
  );
}

// The application shell: everything the app needs to start with no network.
// Sign data and the photo are left to the runtime caches.
function isShellFile(path) {
  if (path === "sw.js" || path.startsWith("api/") || path.endsWith(".map")) return false;
  return /\.(html|js|css|json|png|jpe?g|svg|ico|woff2?)$/i.test(path);
}

// After the build, write the build id and the list of shell files into dist/sw.js.
function serviceWorkerPrecache() {
  let outDir;
  return {
    name: "sign-routes-service-worker",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const files = listFiles(outDir)
        .map((file) => relative(outDir, file).split(sep).join("/"))
        .filter(isShellFile)
        .sort();
      const target = join(outDir, "sw.js");
      const source = readFileSync(target, "utf8");
      if (!source.includes('"__BUILD_VERSION__"') || !source.includes('["__PRECACHE_URLS__"]')) {
        throw new Error("sw.js is missing its build placeholders");
      }
      writeFileSync(
        target,
        source
          .replace('"__BUILD_VERSION__"', JSON.stringify(buildVersion))
          .replace('["__PRECACHE_URLS__"]', JSON.stringify(files)),
      );
      console.log(`service worker ${buildVersion}: ${files.length} shell files precached`);
    },
  };
}

export default defineConfig({
  plugins: [react(), serviceWorkerPrecache()],
  base: "/React/routes/",
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion),
  },
});
