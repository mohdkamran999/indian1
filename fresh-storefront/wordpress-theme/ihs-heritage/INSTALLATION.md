# IHS Heritage — installation guide

## Important
This is a WordPress theme, not a complete WordPress installation or a payment integration. Keep the existing IHS production website untouched until staging has passed the checklist.

## Install on a separate staging WordPress site
1. In Hostinger hPanel, use **Websites → Add website → WordPress** to create a separate installation on a temporary domain or subdomain. Do not point the production domain at it yet.
2. Open the new WordPress dashboard and install/activate **WooCommerce** from Plugins → Add New Plugin.
3. Download the repository branch archive from GitHub, extract it, then locate `fresh-storefront/wordpress-theme/ihs-heritage`. WordPress needs the theme directory itself as a ZIP. If you cannot create that ZIP on your device, use Hostinger File Manager to upload the theme folder into the staging site's `wp-content/themes/` directory.
4. In Appearance → Themes, activate **IHS Heritage**.
5. In Appearance → Customize → IHS Contact Details, enter your WhatsApp number in international format using digits only, and set the announcement text.
6. In Appearance → Menus, create a menu and assign it to **Primary Menu**. Add Home, Shop, Long Kurtis, Short Kurtis, Co-ord Sets, Our Story, Contact, and My Account as applicable.
7. In WooCommerce → Settings, set the store address, India, INR, shipping zones, taxes as appropriate, and customer email settings. Install a reputable payment gateway and begin in test mode.
8. Create product categories with the slugs `long-kurtis`, `short-kurtis`, `co-ord-sets`, and `bottoms` or update the category links in `front-page.php` to match your category slugs.
9. Add real products with correct SKU, price, stock, size/colour variations, original images and accurate claims. No demo product data is included.
10. Create and review Our Story, Contact, Privacy Policy, Terms, Shipping, Returns/Refunds, and Size Guide pages. Set the relevant pages in WooCommerce settings.
11. Configure a backup, SSL, no-index protection for staging, and complete every item in `../INTEGRATIONS-AND-QA.md`.

## Safety and launch
- Do not paste WordPress, hosting, payment, or Meta passwords into source files or chat.
- Never put payment gateway secret keys in a theme file.
- Do not use the Hostinger staging **Publish** action until ready: it replaces live files and database with staging content. Take an independent backup first and verify rollback.
- This repository work does not mean the theme has been installed on Hostinger or that checkout, payment, shipping, email, Meta, WhatsApp, or Google Merchant Center has passed a live test.
