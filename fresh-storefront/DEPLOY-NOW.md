# IHS fresh storefront — Hostinger deployment checklist

This branch is a separate preview. It does NOT replace the live website or deploy itself.

## 1. Prepare the database (required for the live catalogue/admin)
1. Open the Supabase project at https://supabase.com/dashboard/project/uscsoscckihhlmiwzqny
2. Go to SQL Editor and run the complete file `supabase-schema.sql` from this folder.
3. In Authentication, create an admin user with your own email and a strong unique password.
4. Copy that user's UUID from Authentication > Users.
5. In SQL Editor run the insert below, replacing both placeholders with the real UUID and email:
   ```sql
   insert into public.ihs_profiles (id, email, role)
   values ('YOUR_AUTH_USER_UUID', 'YOUR_ADMIN_EMAIL', 'admin');
   ```
6. In Project Settings > API, copy the **publishable key** (or legacy anon public key). Do not copy a secret/service_role key.
7. Edit `config.js` and replace `REPLACE_WITH_SUPABASE_PUBLISHABLE_KEY` with that public key. Add your WhatsApp number using country code, digits only, no + or spaces.

## 2. Preview on Hostinger without replacing the existing website
1. In Hostinger hPanel, open Websites > Manage > Node.js Web App (or File Manager if you are deploying as static files).
2. Keep the current website files untouched. Create a preview subdomain or separate preview directory first.
3. Upload the CONTENTS of `fresh-storefront/` to the preview web root. The `index.html` file must be directly inside that web root, not one folder deeper.
4. If using a static hosting option, no Node.js build is required for these HTML files. If the selected Hostinger product only serves a Node app, use a static site/preview directory or configure the app to serve this folder; do not point the existing production app at it without testing.
5. Visit the preview URL and test the home page, catalogue, admin login, adding/editing a test product, and WhatsApp link on mobile.

## 3. Before switching the main domain
- Confirm product listing works after refreshing and on a second device.
- Confirm a non-admin user cannot manage products.
- Confirm admin login/logout works.
- Confirm the WhatsApp link opens the correct business number.
- Confirm SSL/HTTPS and mobile layout.
- Do not advertise online payments, checkout, delivery tracking, or Meta/Google feeds as live yet: those still require implementation and testing.

## Current status / limitations
- The database-backed catalogue and product admin screens are scaffolds; they require the Supabase steps above and real browser testing.
- The admin currently saves product image URLs, not uploaded image files.
- There is no completed payment checkout, customer order-placement flow, order tracking interface, or verified Meta Commerce / WhatsApp catalogue / Google Merchant Center connection.
- Do not put a Supabase secret/service_role key in `config.js` or any browser-visible file.
- Keep this work on `fresh-storefront` until preview checks pass. Do not merge to `main` or overwrite the production domain as a shortcut.
