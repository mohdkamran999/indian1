// @lovable.dev/vite-tanstack-config already includes the shared React/TanStack plugins.
// Keep the Hostinger Node build explicit so the server output is generated in dist/server.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const hostingerNodeBuild =
  process.env.HOSTINGER === "1" ||
  process.env.NITRO_PRESET === "node-server" ||
  process.env.NITRO_PRESET === "node";

const vercelBuild = process.env.NITRO_PRESET === "vercel";

export default defineConfig({
  nitro: hostingerNodeBuild
    ? {
        preset: "node-server",
        output: { dir: "dist", serverDir: "dist/server", publicDir: "dist/client" },
      }
    : vercelBuild
      ? { preset: "vercel" }
      : undefined,
  tanstackStart: {
    server: { entry: "server" },
    // Generate the SPA shell without prerendering routes through a local HTTP server.
    // Hostinger's build environment may not expose that temporary server port;
    // prepare-hostinger-static.mjs copies _shell.html to index.html when needed.
    spa: {
      enabled: true,
    },
  },
});
