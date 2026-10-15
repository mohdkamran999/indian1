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

const shellCandidates = [
  resolve(clientDir, "index.html"),
  resolve(clientDir, "_shell.html"),
];
const shellSource = (await Promise.all(shellCandidates.map(async (path) => (await exists(path)) ? path : null))).find(Boolean);
if (!shellSource) {
  throw new Error("No static HTML shell was generated. Expected dist/client/index.html or dist/client/_shell.html.");
}

// Hostinger's configured output directory is ".dist" and its entry file is
// "app.js". Package the complete Nitro server and client assets together so
// the deployed app can serve both API/server routes and static assets.
await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, resolve(outputDir, "client"), { recursive: true });
await cp(serverDir, resolve(outputDir, "server"), { recursive: true });

if (!(await exists(resolve(outputDir, "client", "index.html")))) {
  const { copyFile } = await import("node:fs/promises");
  await copyFile(shellSource, resolve(outputDir, "client", "index.html"));
}

await writeFile(
  resolve(outputDir, "app.js"),
  'const entry = new URL("./server/index.mjs", import.meta.url);\\nawait import(entry.href);\\n',
  "utf8",
);

console.log("Hostinger production package is ready in .dist/ (app.js, server/, client/).");
