# IHS WooCommerce integrations and launch QA

## Required before connecting channels
- Confirm the staging store uses HTTPS and the final canonical domain plan is set.
- Set store country India, INR currency, address, shipping zones/rates, tax configuration with an accountant, return/refund/shipping/privacy policies, and support contact.
- Add real IHS products only. Each product needs a stable SKU, accurate title/description, price, stock, images, category, size/colour variants and availability.

## Meta and WhatsApp catalogue
1. Install the official/approved Meta for WooCommerce integration from WordPress Plugins.
2. Connect the correct Meta Business Portfolio, Commerce account, Facebook Page and Instagram account.
3. Select the IHS WooCommerce product catalogue or create one dedicated to IHS.
4. Ensure product sync is enabled and variant IDs/SKUs, availability, prices and product URLs match WooCommerce.
5. Configure WhatsApp Business catalogue according to Meta's current account eligibility and commerce policies; confirm the correct WhatsApp Business phone/account is connected.
6. Test a product update and verify it reaches Commerce Manager; check diagnostics and resolve disapprovals. Do not assume a WhatsApp connection automatically links every existing catalogue.
7. Keep WooCommerce as the source of truth for price, stock and product content.

## Google Merchant Center
1. Install the official Google for WooCommerce plugin (verify publisher and current compatibility before install).
2. Connect the correct Google account, Merchant Center and Google Ads only if needed.
3. Verify and claim the final website domain in Merchant Center.
4. Configure shipping, tax, returns and contact information consistently with the website.
5. Map product categories and identifiers correctly; do not invent GTINs or brand identifiers.
6. Submit product data and review Merchant Center diagnostics for price/availability mismatches, missing shipping, image issues and policy problems.
7. Test a product price/stock change and verify the feed updates.

## Pre-launch test matrix
- [ ] Backup of current website files and database stored outside the public web root.
- [ ] Staging is separate from the production domain and protected from indexing.
- [ ] HTTPS certificate valid; canonical URLs and redirects checked.
- [ ] Homepage and navigation tested on mobile and desktop.
- [ ] Category pages, search, sort, filters and pagination tested.
- [ ] Product image gallery, size/colour variations, SKU and stock tested.
- [ ] Add-to-cart, cart quantity, remove item, coupon and totals tested.
- [ ] Checkout with valid/invalid address and shipping rates tested.
- [ ] Payment gateway test mode: success, failure, cancellation, webhook and refund tested.
- [ ] Order emails, stock decrement/restock, admin order status and tracking tested.
- [ ] Privacy, terms, shipping, returns/refunds and contact pages reviewed.
- [ ] Meta catalogue diagnostics and WhatsApp destination verified.
- [ ] Google Merchant Center diagnostics reviewed.
- [ ] Performance, accessibility, backup restore and rollback plan checked.
- [ ] Only after all checks pass: schedule launch, preserve backup and verify live DNS/SSL.

## Scope and safety
This is an implementation checklist, not evidence that integrations or checkout are already connected. Never store payment secrets or service-role keys in theme files. Do not publish staging data or switch the production domain before testing and owner approval.
