import { existsSync } from "node:fs";
import { resolve } from "node:path";

process.env.HOSTINGER ??= "1";
process.env.NITRO_PRESET ??= "node-server";
process.env.HOST ??= "0.0.0.0";

// Hostinger may flatten the configured output directory (dist) into the
// runtime root. In that layout the server entry is server/index.mjs rather
// than dist/server/index.mjs. Support both layouts.
const candidates = [
  resolve("server/index.mjs"),
  resolve("dist/server/index.mjs"),
];

const serverEntry = candidates.find((candidate) => existsSync(candidate));

if (!serverEntry) {
  console.error(
    "Hostinger start failed: could not find server/index.mjs or dist/server/index.mjs. Check the Hostinger output directory and build logs.",
  );
  process.exit(1);
}

await import(serverEntry);
