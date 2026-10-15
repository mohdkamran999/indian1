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
- `SUPABASE_SERVICE_ROLE_KEY` (required for checkout, order tracking, coupon validation, and trusted server-side order/payment operations; obtain it from the owner of the existing Supabase project)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The Vite-prefixed values are needed during the build for browser-side Supabase access. Use only the public project URL and publishable/anon key in `VITE_*` variables. Do not create a new Supabase project just for deployment.

`SUPABASE_SERVICE_ROLE_KEY` is required by the current server-side order and payment code. If the developer who owns the Supabase project has not granted access, ask them to set this private variable in Hostinger or grant you authorized access to the existing project. Do not create a replacement database to work around this. Set the key only as a private server-side environment variable; never expose it in client-side `VITE_*` variables, browser code, or GitHub files. Never commit database passwords, Hostinger credentials, or verification codes.

## Safe rollout and checks

1. Back up the current website files and database before replacing any live files. Do not delete the existing database or catalogue.
2. Upload/extract the source archive into the Node app root, configure the environment variables, install dependencies, and build.
3. Restart the app and test in a private/incognito browser window:
   - https://indianhandicraftstandards.com/
   - https://indianhandicraftstandards.com/shop
   - a product detail page, cart, and checkout flow
4. Confirm published IHS products, prices, stock, admin access, and existing orders remain correct.

Production storefront code now avoids presenting static sample products as real inventory. If the database connection or published catalogue is unavailable, the shop can appear empty; verify the existing Supabase project connection and published products. No database records should be deleted as part of deployment.

## Known Hostinger 403 check

If Hostinger shows 403, confirm the domain is attached to the Node.js app rather than only `public_html`, the app starts successfully, and the entry file is `hostinger-server.mjs`. If necessary, use Hostinger **Node.js App → Settings & Redeploy** and restart/redeploy so Hostinger refreshes its generated routing configuration.

## Status

- Storefront environment-resolution code is merged.
- GitHub Actions successfully built the app and produced a deployment artifact before the source-archive enhancement.
- Hostinger's deployment page has shown the latest `main` commit as Completed/Current, and the live shop has been observed rendering products. Checkout is not fully verified until `SUPABASE_SERVICE_ROLE_KEY` is configured and a safe end-to-end test can be completed.
- The GitHub workflow validates build and packaging; it does not validate the live checkout or external Meta/Google account approvals.
