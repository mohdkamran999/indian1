# IHS Fresh Storefront

Independent rebuild for Indian Handicraft Standards. This branch does not change the existing production branch or live domain.

## Files
- `index.html`: premium landing page.
- `shop.html` and `admin.html`: visual/local-browser preview only; not production secure.
- `shop-live.html` and `admin-live.html`: Supabase-backed catalogue and password sign-in interface.
- `config.js`: browser-safe project URL and publishable key placeholder.
- `supabase-schema.sql`: product, variant, order and admin profile schema with row-level security.

## Implemented in this branch
- Premium responsive landing page and collection sections.
- Database-backed product records and basic variant inventory.
- Supabase email/password admin sign-in; writes require a row in `ihs_profiles` for the authenticated user.
- Public product reads limited to active products.
- Admin-only product and order table policies.
- Catalogue search and category filters.

## Required setup before production
1. In Supabase project `uscsoscckihhlmiwzqny`, open SQL Editor and run `supabase-schema.sql`.
2. Create your own admin account in Supabase Authentication (do not send the password to anyone).
3. Copy that user's UUID and run the commented insert at the end of the SQL file, replacing the placeholder with the UUID.
4. In Supabase Project Settings → API Keys, copy the **publishable** key (or legacy anon public key) and replace `REPLACE_WITH_SUPABASE_PUBLISHABLE_KEY` in `config.js`. Never use a service-role or secret key in browser files.
5. Set the actual IHS WhatsApp business number in `config.js` using international digits only, with no plus sign or spaces.
6. Host these files on a separate preview path or subdomain first. Test login, product add/edit, active product display and row-level security from a logged-out browser before switching the live domain.

## Production gaps — not yet complete
This is not yet a complete transactional ecommerce platform. Online payment integration, checkout, customer order submission, secure shipping-label/tracking workflow, true image uploads to Supabase Storage, stock decrement/locking, order emails, privacy/terms/returns pages, tax/shipping rules, and live Meta/Google catalogue feed setup still need provider credentials and end-to-end testing. The schema includes an order table but this branch does not expose a public order-creation endpoint; do not claim checkout or payments are live.

## Preview
Open `index.html` for the landing page, `shop-live.html` for the database-backed catalogue, and `admin-live.html` for the database-backed admin interface after setup.
