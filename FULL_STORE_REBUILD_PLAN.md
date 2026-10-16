# IHS Full Store and Owner-Friendly Admin Rebuild

## Goal
Build a polished, complete e-commerce experience for Indian Handicraft Standards (Lucknowi Chikankari clothing) with an owner-friendly admin. Develop on an isolated feature branch first; do not replace the current live site until tests pass and the owner approves deployment.

## Non-negotiable safety rules
- Preserve existing Supabase project, product records, customer accounts, orders, inventory, auth, and current live deployment.
- Never create a replacement database as a shortcut.
- Never expose service-role keys or private API credentials in browser code, `VITE_*` variables, settings forms, screenshots, or logs.
- No production destructive migrations or mass product changes without a backup and explicit review.
- Do not claim Google, Meta, or WhatsApp is connected just because IDs or feed routes exist.
- Use original/appropriately licensed brand imagery; do not copy another retailer's copyrighted photos, logos, or exact proprietary design. Use the existing IHS visual identity as the reference.

## Brand and storefront
- Premium Lucknowi Chikankari aesthetic: warm ivory, heritage navy, muted antique gold, generous whitespace, readable typography, editorial product photography.
- Responsive mobile-first header, search, categories, account, wishlist, cart, and WhatsApp support.
- Home page sections editable from admin: hero/banner, featured collections, best sellers, new arrivals, trust/returns/delivery content, testimonials and footer.
- Collection pages: keyword search, category, size, colour, price, work type, fabric, availability and sorting filters; pagination and clear-filter action.
- Product page: multiple images, zoom/gallery, SKU, product title, fabric, embroidery/work, length, size and colour variants, price/MRP/discount, stock, care/delivery/returns, size guide, related items, canonical URL and structured product metadata.
- Accessible controls, useful empty/error/loading states, no sample products presented as real inventory.

## Owner-friendly admin
Use plain labels, helpful hints, validation, save/cancel actions, search, status badges, and confirmation for destructive actions. No code entry should be required for ordinary store management.

### Products and bulk catalogue
- Create/edit/duplicate/archive products using forms.
- Fields: title, slug, description, category, fabric, work type, colour, length, size chart, MRP, sale price, tax/HSN if applicable, SKU per variant, stock per variant, images/gallery/alt text, care instructions, shipping weight/dimensions, publish status, SEO title/description, GTIN/MPN/brand where applicable, and channel eligibility.
- CSV template download, preview-before-import, row-level validation/errors, duplicate detection, update-existing vs create-new choice, and import summary.
- Bulk image upload and mapping to SKU; preserve existing media unless the owner confirms replacement.
- Product publishing and stock updates must use existing validated data functions and access control.

### Orders, shipping and customers
- Search/filter orders by date, status, payment method and order number.
- Order detail with line items, customer/shipping address, payment/COD state, notes, status history and printable invoice/packing slip.
- Shipment/carrier, tracking number, tracking URL, dispatch date, delivery status, and customer notification status in a clear form.
- Customer information must be permission-protected and only used for fulfilment/support.

### Promotions, content and support
- Coupons/discounts with date, usage and eligibility rules; banners and landing-page content; reviews moderation; returns/refunds policy content; size guides; WhatsApp click-to-chat number and prefilled message.
- Show confirmation and errors; do not claim a message or notification was sent unless the provider confirms it.

### Business integrations
- A single integration settings page for public IDs, feed URLs, verification tokens and connection status.
- Google Merchant Center: XML/RSS feed with valid required product attributes, stable item IDs, availability, price/currency, image/link, shipping/returns policies and landing pages; submit only after a live feed test.
- Meta Commerce Manager: compatible CSV feed and scheduled-refresh guidance; catalogue, business and page IDs; domain verification and optional Pixel/CAPI status.
- WhatsApp Business: click-to-chat contact, catalogue association checklist and status; the actual catalogue association must be verified in the account.
- Settings forms may store non-secret identifiers only. Private access tokens belong in server-side secrets managed by an authorized account owner.
- Report each integration as Not configured / Needs verification / Connected / Feed error. Do not mark connected merely because an ID is saved.

### Checkout and reliability
- Validate cart totals, variants, stock, shipping and order payload on the server.
- Use an authorized server-side order path with appropriate database permissions; never solve a missing service-role key by exposing privileged access or weakening row-level security.
- Keep cart contents on recoverable errors and show plain-language messages.
- Verify COD and any online payment provider separately; do not place live paid test orders without authorization.
- Add basic automated checks for route rendering, product feed format, required product fields and build success.

## Delivery gates
1. Inspect existing routes, admin features, schema, RLS policies, and current production build before changing code.
2. Implement the rebuild in this branch; keep the live branch untouched.
3. Run production build and relevant tests; fix failures before proposing merge.
4. Verify catalogue feeds and product pages against real published data without modifying production records.
5. Obtain owner review of the preview and explicit deployment approval.
6. Deploy through the established Hostinger workflow and verify live storefront, product detail, cart, checkout error handling, feed URLs and account-level catalogue status.
7. Publish a final checklist that clearly separates code complete, deployed, connected, feed syncing, and items approved by each platform.

## Definition of done
- Owner can manage products, variant sizes/colours, stock, images, pricing, orders, shipment tracking, homepage content and integration settings from forms without editing code.
- Existing customer/product/order data remains intact.
- Production build and relevant tests pass.
- Real checkout/order creation is verified safely.
- Google, Meta and WhatsApp status is only marked connected after account-side confirmation.
