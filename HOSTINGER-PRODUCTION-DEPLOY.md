# Hostinger production deployment

This project is a Node/Nitro application. Do **not** deploy the static prototype ZIP over it.

## Build settings

Configure the Hostinger Node.js application as follows:

- Node.js: 22.12 or newer (Node 22 is selected in the current build setup)
- Build command: `npm run build`
- Output directory: `.dist` (exact spelling, including the leading dot)
- Entry file: `app.js`
- Application type: Nitro / Node.js

The build runs Vite/TanStack Start and then packages both the Nitro server and client assets into `.dist/`. The output must contain `.dist/app.js`, `.dist/server/index.mjs`, and `.dist/client/`.

## Environment and data services

Before taking real customer orders, set the required production environment variables in Hostinger's environment-variable panel. Never commit production secrets or paste them into chat. The project uses Supabase packages, so verify the actual server-side data/auth configuration and set the appropriate project URL and server-side key. Use a least-privilege server key, enable row-level security, and test admin authorization before opening the admin panel publicly.

Configure and test a real payment provider in test mode first; do not advertise online payment as available until successful test and refund flows pass. WhatsApp Business, Meta Commerce Manager/Pixel, and Google Merchant Center also require the business's own IDs, domain verification, approved catalog/feed, and account permissions. Adding IDs alone does not grant platform approval.

## Safe rollout checklist

1. Back up the current Hostinger site and database before changing production.
2. Confirm the GitHub build completes successfully and the output directory contains the three paths listed above.
3. Deploy to a staging domain or preview first.
4. Test mobile and desktop browsing, product variants/stock, cart persistence, checkout validation, order creation, admin login/permissions, order status, and shipping/tracking.
5. Test the configured payment provider and order notifications.
6. Verify HTTPS, privacy/returns/shipping policies, SEO metadata, sitemap, robots rules, and product feed URLs.
7. Only then switch the live domain. Keep the previous deployment available for rollback.

## Important status note

A successful build is not proof that payment processing, shared database persistence, admin security, shipping, or Meta/WhatsApp/Google integrations are production-ready. Each must be verified with the relevant credentials and a live or sandbox test.
