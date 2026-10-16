const fs = require("node:fs");
const required = ["index.html", "shop-live.html", "admin-live.html", "config.js"];
const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error("Missing required IHS storefront files:", missing.join(", "));
  process.exit(1);
}
const projectId = process.env.SUPABASE_PROJECT_ID || process.env.VITE_SUPABASE_PROJECT_ID || "uscsoscckihhlmiwzqny";
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://" + projectId + ".supabase.co";
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
const config = {
  supabaseUrl,
  supabasePublishableKey: publishableKey,
  supabaseProjectId: projectId,
  whatsappNumber: process.env.IHS_WHATSAPP_NUMBER || ""
};
fs.writeFileSync("ihs-runtime-config.json", JSON.stringify(config), { mode: 0o644 });
if (!publishableKey) {
  console.warn("Supabase publishable key is missing. The storefront will show setup guidance until it is configured.");
}
console.log("IHS storefront files verified for Hostinger.");
