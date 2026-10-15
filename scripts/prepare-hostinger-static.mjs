import { cp, mkdir, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const buildDir = resolve("dist");
const clientDir = resolve(buildDir, "client");
const serverDir = resolve(buildDir, "server");
const outputDir = resolve(".dist");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(clientDir))) {
  throw new Error("The client build was not found at dist/client.");
}
if (!(await exists(serverDir))) {
  throw new Error("The Node server build was not found at dist/server.");
}

// Hostinger's Node launcher loads app.js through CommonJS require(). Avoid
// top-level await so the entry can be synchronously loaded, then dynamically
// import the Nitro ESM server and report startup failures clearly.
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, resolve(outputDir, "client"), { recursive: true });
await cp(serverDir, resolve(outputDir, "server"), { recursive: true });

await writeFile(
  resolve(outputDir, "app.js"),
  'import("./server/index.mjs").catch((error) => { console.error("Failed to start Nitro server:", error); process.exitCode = 1; });\n',
  "utf8",
);

console.log("Hostinger production package is ready in .dist/ (app.js, server/, client/).");
