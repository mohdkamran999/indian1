import { cp, mkdir, rm, stat } from "node:fs/promises";
import { resolve } from "node:path";

const clientDir = resolve("dist/client");
const outputDir = resolve("Dist");

try {
  await stat(clientDir);
} catch {
  throw new Error("The static client build was not found at dist/client.");
}

let htmlSource = resolve(clientDir, "index.html");
try {
  await stat(htmlSource);
} catch {
  // TanStack Start uses _shell.html as the default SPA shell filename.
  htmlSource = resolve(clientDir, "_shell.html");
  try {
    await stat(htmlSource);
  } catch {
    throw new Error(
      "No static HTML shell was generated. Expected dist/client/index.html or dist/client/_shell.html.",
    );
  }
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true, force: true });

// Hostinger's saved output directory is case-sensitive ("Dist"). Make sure
// the static app has an index document regardless of the shell file name.
const targetIndex = resolve(outputDir, "index.html");
if (htmlSource !== targetIndex) {
  const { copyFile } = await import("node:fs/promises");
  await copyFile(htmlSource, targetIndex);
}

console.log("Hostinger static output is ready in Dist/.");
