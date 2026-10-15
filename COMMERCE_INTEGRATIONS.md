# Meta, WhatsApp Catalogue, and Google Merchant Center setup

This project supports the website-side setup for Indian Handicraft Standards. The actual business-account authorization must be completed inside the owner's Meta and Google accounts; never put passwords, access tokens, or service-role keys in this repository.

## Website URL and crawl files

- Canonical website: https://indianhandicraftstandards.com/
- Shop: https://indianhandicraftstandards.com/shop
- Sitemap: https://indianhandicraftstandards.com/sitemap.xml
- Google Merchant Center XML feed: https://indianhandicraftstandards.com/google-product-feed.xml
- Meta Commerce Manager CSV feed: https://indianhandicraftstandards.com/meta-product-feed.csv
- Google Merchant Center product feed: https://indianhandicraftstandards.com/google-product-feed.xml (published database products only)
- Robots: https://indianhandicraftstandards.com/robots.txt

## Hostinger environment variables

Set these optional public values in the Node.js app's environment variables, then rebuild and restart the app:

- `VITE_META_PIXEL_ID`: numeric Pixel ID from Meta Events Manager. Leave blank until you have the correct ID.
- `VITE_META_DOMAIN_VERIFICATION`: verification token from Meta Business Settings → Brand Safety / Domains. Enter only the token value, not the full meta tag.
- `VITE_GOOGLE_SITE_VERIFICATION`: the content token from Google Search Console's HTML-tag verification method. Enter only the content value.

The Meta Pixel loads only when a valid numeric ID is supplied. Meta and Google verification tags are added only when their tokens are supplied. These values are identifiers/verification tokens, not passwords. Do not put a Meta access token or Google API secret in any `VITE_*` variable.

Google Analytics and Google Tag Manager are already included in the site source with IDs `G-HC5QHDQQN0` and `GTM-NGJKBBQK`. Confirm that these IDs belong to the correct IHS accounts before relying on reports.

## Meta Commerce Manager and WhatsApp Business Catalogue

1. In Meta Business Suite / Commerce Manager, select the IHS business and claim/verify `indianhandicraftstandards.com`.
2. Copy the domain verification token into Hostinger as `VITE_META_DOMAIN_VERIFICATION`, rebuild/restart, then press Verify in Meta.
3. If using a Meta Pixel, copy its numeric ID into `VITE_META_PIXEL_ID`, rebuild/restart, then test PageView in Events Manager.
4. In WhatsApp Business, open the business catalogue settings and follow Meta's available connection/sync flow for the same Commerce account. Keep the WhatsApp Business number and business ownership consistent.
5. Add the CSV feed URL above as a scheduled data feed in Commerce Manager if the account offers that source option, then check diagnostics and item status. Use the same business catalogue for WhatsApp only if Meta presents that connection option for the account. Feeds include published database products with images; they do not fabricate products.

## Google Merchant Center

1. Create/open the IHS Merchant Center account and add `https://indianhandicraftstandards.com` as the website.
2. Verify ownership with Google Search Console (recommended) or the HTML-tag method. For HTML-tag verification, set the token in `VITE_GOOGLE_SITE_VERIFICATION`, rebuild/restart, then click Verify.
3. Submit `https://indianhandicraftstandards.com/sitemap.xml` in Search Console.
4. In Merchant Center, configure business details, shipping, returns, and contact information before submitting products.
5. Add the XML feed URL above as a scheduled data source in Merchant Center, then review diagnostics and item approval status. The feed includes only published database products with images.

## Important limits

A successful website build does not by itself authorize a Meta Business, connect a WhatsApp catalogue, or verify a Merchant Center account. Account ownership, domain verification and any requested business checks must be approved by Meta/Google. After changing environment variables in Hostinger, rebuild the app (not just restart it) because these `VITE_*` values are embedded during the build.
