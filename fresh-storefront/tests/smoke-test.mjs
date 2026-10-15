import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = ["index.html","shop.html","admin.html","config.js","supabase-schema.sql","shop-live.html","admin-live.html","README.md"];
for (const file of required) {
  assert.ok(existsSync(resolve(root,file)), `Missing required file: ${file}`);
  console.log("PASS file exists:", file);
}
const read = (f) => readFileSync(resolve(root,f),"utf8");
const htmlFiles = ["index.html","shop.html","admin.html","shop-live.html","admin-live.html"];
for (const file of htmlFiles) {
  const html = read(file);
  assert.match(html, /<html[\\s>]/i, `${file} has html root`);
  assert.match(html, /<title[\\s>]/i, `${file} has a title`);
  assert.match(html, /<meta[^>]+name=["']viewport["']/i, `${file} has mobile viewport`);
  assert.doesNotMatch(html, /REPLACE_WITH_SERVICE_ROLE|SUPABASE_SERVICE_ROLE_KEY/i, `${file} must not expose service-role credentials`);
  console.log("PASS HTML baseline:", file);
}
const home = read("index.html");
for (const target of ["shop-live.html","admin-live.html"]) {
  assert.ok(home.includes(target), `Homepage must link to ${target}`);
  console.log("PASS homepage navigation:", target);
}
const config = read("config.js");
assert.match(config, /supabaseUrl:/);
assert.match(config, /supabasePublishableKey:/);
assert.doesNotMatch(config, /service_role|secret[_ -]?key/i);
console.log("PASS browser config uses no service-role key");
const sql = read("supabase-schema.sql");
for (const term of ["enable row level security","ihs_products","ihs_product_variants","ihs_orders","ihs_profiles"]) {
  assert.ok(sql.toLowerCase().includes(term.toLowerCase()), `Schema missing ${term}`);
  console.log("PASS schema contains:", term);
}
console.log("NOTE: This is static smoke testing only. Supabase auth, live database permissions, checkout, payments, and Hostinger deployment require environment credentials and end-to-end tests.");
