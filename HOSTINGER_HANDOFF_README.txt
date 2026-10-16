IHS GREEN STOREFRONT — HOSTINGER HANDOFF

This is a source-code package, not a completed live deployment.
The original .env file was intentionally excluded for safety.

Hostinger settings from the project's own HOSTINGER_DEPLOYMENT.md:
- Node.js: 22.x or newer
- Install command: npm install
- Build command: npm run build:hostinger
- Start command: npm run start:hostinger
- Entry/startup file: hostinger-server.mjs
- Output directory: dist

Important:
- Do not use the old .output or .dist output setting for this project.
- The website's interface/routes are included in the source.
- Product data is not copied into a new empty database.
- Supabase URL and publishable key are needed for database-backed catalogue/auth features.
- Admin write operations may require SUPABASE_SERVICE_ROLE_KEY on the server, or the project's documented alternative admin workflow.
- Payment, shipping, chat and other external integrations will not work until their own credentials are configured.
- Keep secret keys out of GitHub and never place server secrets in VITE_ variables.
- Deploy to craftchikan.store only after confirming it is the intended test domain. Do not change indianhandicraftstandards.com.
