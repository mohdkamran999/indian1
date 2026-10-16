const fs = require("node:fs");
const required = ["index.html", "shop-live.html", "admin-live.html", "config.js"];
const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error("Missing required IHS storefront files:", missing.join(", "));
  process.exit(1);
}
console.log("IHS storefront files verified. Hostinger will serve the green storefront from this directory.");
