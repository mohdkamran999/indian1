# Hostinger Node.js deployment — Indian Handicraft Standards

This repository workflow builds and packages the app; it does **not** automatically deploy to Hostinger.

## Hostinger settings

- **Node version:** 22.12 or newer
- **Install command:** `npm install --no-audit --no-fund`
- **Build command:** `npm run build:hostinger`
- **Start command:** `npm run start:hostinger`
- **Startup / Entry file:** `hostinger-server.mjs`
- **Build output:** `dist/` (the server entry is expected at `dist/server/index.mjs`)

## Downloadable deployment package

After a successful GitHub Actions run named **Hostinger build verification**:

1. Open the run at https://github.com/mohdkamran999/indian1/actions.
2. In the run's **Artifacts** section, download `ihs-hostinger-<commit>`.
3. The artifact contains a tested `dist/` build and a full-source archive named `ihs-hostinger-source.zip`.
4. **Recommended for the live site:** use the source archive. Extract `ihs-hostinger-source.zip` into the Hostinger Node.js app root. This lets the production bundle be rebuilt using the existing Supabase values configured in Hostinger. Do not deploy a prebuilt `dist/` without confirming that the browser-side Vite variables were included.
5. In the app root, run `npm install --no-audit --no-fund`, then run `npm run build:hostinger` after setting the environment variables below.
6. Set the entry/start file to `hostinger-server.mjs` (equivalent start command: `npm run start:hostinger`), then restart the app.

The artifact is retained for 14 days. GitHub verifies compilation and packaging, not the live Hostinger deployment.

## Required environment variables

Set the matching values for the existing Supabase project in Hostinger **before building**:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The Vite-prefixed values are needed during the build for browser-side Supabase access. Use only the public project URL and publishable/anon key in `VITE_*` variables. Do not create a new Supabase project just for deployment.

Admin-only server operations may require `SUPABASE_SERVICE_ROLE_KEY`. If needed, set it only as a private server-side environment variable; never expose it in client-side `VITE_*` variables, browser code, or GitHub files. Never commit database passwords, Hostinger credentials, or verification codes.

## Safe rollout and checks

1. Back up the current website files and database before replacing any live files. Do not delete the existing database or catalogue.
2. Upload/extract the source archive into the Node app root, configure the environment variables, install dependencies, and build.
3. Restart the app and test in a private/incognito browser window:
   - https://indianhandicraftstandards.com/
   - https://indianhandicraftstandards.com/shop
   - a product detail page, cart, and checkout flow
4. Confirm published IHS products, prices, stock, admin access, and existing orders remain correct.

The live shop has previously shown 22 catalogue items including some marked “Sample”. Do not remove sample fallback code or delete records until the real database connection and published products are verified. The production fallback change in PR #5 is intentionally unmerged because it could make the shop empty if the database connection is still failing.

## Known Hostinger 403 check

If Hostinger shows 403, confirm the domain is attached to the Node.js app rather than only `public_html`, the app starts successfully, and the entry file is `hostinger-server.mjs`. If necessary, use Hostinger **Node.js App → Settings & Redeploy** and restart/redeploy so Hostinger refreshes its generated routing configuration.

## Status

- Storefront environment-resolution code is merged.
- GitHub Actions successfully built the app and produced a deployment artifact before the source-archive enhancement.
- Hostinger deployment and live database-backed catalogue: not yet verified by this workflow and must be checked after deployment.
