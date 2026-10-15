# Meta, WhatsApp Catalogue, and Google Merchant Center setup

This project supports website-side setup for Indian Handicraft Standards. Business-account authorization must be completed inside the owner's Meta and Google accounts; never put passwords, access tokens, or service-role keys in this repository.

## WordPress + WooCommerce theme feeds

The IHS Heritage WordPress theme includes optional WooCommerce feeds generated from published products that have a price and product image:

- Google Merchant Center XML: `https://YOUR-STAGING-DOMAIN/?ihs_google_feed=1`
- Meta Commerce CSV: `https://YOUR-STAGING-DOMAIN/?ihs_meta_feed=1`

Replace `YOUR-STAGING-DOMAIN` with the actual staging hostname. These URLs become available only after the updated IHS Heritage theme is installed with WooCommerce active. Test the URLs in a browser before submitting them to either platform. The feeds do not create or invent products; add accurate product titles, descriptions, prices, stock, images and shipping/returns policies first.

## Hostinger React app (separate deployment path)

The original React/Vite app is separate from WordPress. If it is used instead of the WordPress storefront, its environment variables belong in the Hostinger Node.js application and require a rebuild:

- `VITE_META_PIXEL_ID`: numeric Pixel ID from Meta Events Manager.
- `VITE_META_DOMAIN_VERIFICATION`: token value from Meta domain verification.
- `VITE_GOOGLE_SITE_VERIFICATION`: token value from Google Search Console HTML-tag verification.

Do not put Meta access tokens, payment secrets, or Supabase service-role keys in `VITE_*` variables.

## Meta Commerce Manager and WhatsApp Business

1. In Meta Business Suite / Commerce Manager, select the IHS business and verify the actual store domain.
2. Add the WordPress Meta CSV feed URL as a scheduled data source if the account supports it.
3. Check Commerce Manager diagnostics and resolve missing images, prices, availability, shipping, or policy issues.
4. Connect the approved catalogue to WhatsApp Business using Meta's available catalogue connection flow.

## Google Merchant Center

1. Verify the store domain in Search Console or Merchant Center.
2. Configure accurate business details, shipping, returns and contact information.
3. Submit the WordPress XML feed URL as a product data source.
4. Review product diagnostics and resolve all disapprovals.

## Important limitations

A successful theme installation or feed URL does not automatically authorize Meta/Google accounts or mean products are approved. Business ownership, domain verification, product policy compliance, and any requested business checks must be completed in the owner's accounts. Payment gateway, shipping, email, and checkout must be separately configured and tested on staging before launch.
