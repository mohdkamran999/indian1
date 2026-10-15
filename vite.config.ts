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
    // Hostinger runs the Nitro Node server. Disable TanStack's prerender crawl for
    // this build because it attempts to fetch a temporary local server during build.
    prerender: {
      enabled: !hostingerNodeBuild,
    },
    // Keep the SPA-shell prerenderer disabled for the Hostinger Node deployment.
    spa: {
      enabled: !hostingerNodeBuild,
    },
  },
});
