# Hostinger Node.js deployment — Indian Handicraft Standards

This repository workflow builds and packages the app; it does **not** automatically deploy to Hostinger.

## Hostinger settings

- **Node version:** 22.12 or newer
- **Install command:** `npm install --no-audit --no-fund`
- **Build command (if building on Hostinger):** `npm run build:hostinger`
- **Start command:** `npm run start:hostinger`
- **Startup / Entry file:** `hostinger-server.mjs`
- **Build output:** `dist/` (the server entry is expected at `dist/server/index.mjs`)

## Downloadable deployment package

After a successful GitHub Actions run named **Hostinger build verification**:

1. Open the run at https://github.com/mohdkamran999/indian1/actions.
2. In the run's **Artifacts** section, download `ihs-hostinger-<commit>`.
3. Extract it into the Hostinger Node.js application's root. Keep `dist/`, `hostinger-server.mjs`, `package.json`, and `package-lock.json` together.
4. Run `npm install --no-audit --no-fund` in that root. Use `npm install`, not `npm ci`, because the current lockfile has previously been reported out of sync with `package.json`.
5. Restart the Node.js app.

The artifact is retained for 14 days. The successful GitHub build checks compilation and package creation, not the live Hostinger deployment.

## Required environment variables

Set the matching values for the existing Supabase project in the Hostinger app's server-side environment:

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

The storefront also recognizes `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. If setting Vite-prefixed variables, make sure they contain only the public project URL and publishable/anon key. Do not create a new Supabase project just for deployment.

Admin-only server operations may require `SUPABASE_SERVICE_ROLE_KEY`. If it is needed, set it only as a private server-side environment variable; never expose it in client-side `VITE_*` variables, browser code, or GitHub files. Never commit database passwords, Hostinger credentials, or verification codes.

## Safe rollout and checks

1. Back up the current website files and database before replacing any live files. Do not delete the existing database or catalogue.
2. Upload/extract the package into the Node app root and configure the entry file as `hostinger-server.mjs`.
3. Restart the app and test in a private/incognito browser window:
   - https://indianhandicraftstandards.com/
   - https://indianhandicraftstandards.com/shop
   - a product detail page, cart, and checkout flow
4. Confirm published IHS products, prices, stock, admin access, and existing orders remain correct.

The live shop has previously shown 22 catalogue items including some marked “Sample”. Do not remove sample fallback code or delete records until the real database connection and published products are verified. The production fallback change in PR #5 is intentionally unmerged because it could make the shop empty if the database connection is still failing.

## Known Hostinger 403 check

If Hostinger shows 403, confirm the domain is attached to the Node.js app rather than only `public_html`, the app starts successfully, and the entry file is `hostinger-server.mjs`. If necessary, use Hostinger **Node.js App → Settings & Redeploy** and restart/redeploy so Hostinger refreshes its generated routing configuration.

## Status

- Latest merged storefront environment-resolution change: production build passed in GitHub Actions.
- Artifact packaging: successful on the PR verification run; the main-branch artifact workflow is being verified.
- Hostinger deployment and live database-backed catalogue: not yet verified by this workflow and must be checked after deployment.
