const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
  res.end(body);
}

http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;

  if (pathname === "/config.js") {
    const projectUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://uscsoscckihhlmiwzqny.supabase.co";
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
    const projectId = process.env.SUPABASE_PROJECT_ID || process.env.VITE_SUPABASE_PROJECT_ID || "uscsoscckihhlmiwzqny";
    const whatsappNumber = process.env.IHS_WHATSAPP_NUMBER || "";
    const config = {
      supabaseUrl: projectUrl,
      supabasePublishableKey: publishableKey,
      supabaseProjectId: projectId,
      whatsappNumber
    };
    return send(res, 200, "window.IHS_CONFIG = " + JSON.stringify(config) + ";\n", "text/javascript; charset=utf-8");
  }

  let relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname).replace(/^\/+/, "");
  const resolved = path.resolve(ROOT, relative);
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    return send(res, 403, "Forbidden");
  }

  fs.stat(resolved, (err, stat) => {
    if (err || !stat.isFile()) return send(res, 404, "Page not found");
    const type = MIME[path.extname(resolved).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "X-Content-Type-Options": "nosniff" });
    fs.createReadStream(resolved).pipe(res);
  });
}).listen(PORT, "0.0.0.0", () => {
  console.log("IHS green storefront server listening on port " + PORT);
});
