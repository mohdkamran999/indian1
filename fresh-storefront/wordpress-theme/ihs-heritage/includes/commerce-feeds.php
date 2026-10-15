<?php
/**
 * WooCommerce product feeds for IHS.
 * URLs: /?ihs_google_feed=1 and /?ihs_meta_feed=1
 */
if (!defined('ABSPATH')) { exit; }

add_action('template_redirect', function () {
    if (!class_exists('WooCommerce')) { return; }

    if (isset($_GET['ihs_google_feed'])) {
        ihs_heritage_render_google_feed();
        exit;
    }
    if (isset($_GET['ihs_meta_feed'])) {
        ihs_heritage_render_meta_feed();
        exit;
    }
});

function ihs_heritage_feed_products() {
    return wc_get_products(array(
        'status' => 'publish',
        'limit' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'return' => 'objects',
        'visibility' => 'visible',
    ));
}

function ihs_heritage_feed_image($product) {
    $image_id = $product->get_image_id();
    if (!$image_id && $product->is_type('variation')) {
        $parent = wc_get_product($product->get_parent_id());
        if ($parent) { $image_id = $parent->get_image_id(); }
    }
    return $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';
}

function ihs_heritage_feed_items() {
    $items = array();
    foreach (ihs_heritage_feed_products() as $product) {
        if (!$product || !$product->is_visible() || $product->get_status() !== 'publish') { continue; }
        $image = ihs_heritage_feed_image($product);
        if (!$image || $product->get_price() === '') { continue; }
        $items[] = array(
            'id' => (string) $product->get_id(),
            'title' => wp_strip_all_tags($product->get_name()),
            'description' => wp_strip_all_tags($product->get_short_description() ?: $product->get_description()),
            'availability' => $product->is_in_stock() ? 'in stock' : 'out of stock',
            'condition' => 'new',
            'price' => wc_format_decimal($product->get_price(), 2) . ' ' . get_woocommerce_currency(),
            'link' => get_permalink($product->get_id()),
            'image_link' => $image,
            'brand' => 'Indian Handicraft Standards',
        );
    }
    return $items;
}

function ihs_heritage_render_google_feed() {
    nocache_headers();
    header('Content-Type: application/xml; charset=UTF-8');
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>';
    echo '<title>' . esc_html(get_bloginfo('name')) . '</title>';
    echo '<link>' . esc_url(home_url('/')) . '</link>';
    echo '<description>Published products from Indian Handicraft Standards</description>';
    foreach (ihs_heritage_feed_items() as $item) {
        echo '<item>';
        foreach ($item as $key => $value) {
            echo '<g:' . esc_html($key) . '>' . esc_html($value) . '</g:' . esc_html($key) . '>';
        }
        echo '</item>';
    }
    echo '</channel></rss>';
}

function ihs_heritage_render_meta_feed() {
    nocache_headers();
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: inline; filename="ihs-meta-product-feed.csv"');
    $out = fopen('php://output', 'w');
    // UTF-8 BOM helps spreadsheet applications; Meta accepts standard UTF-8 CSV.
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, array('id','title','description','availability','condition','price','link','image_link','brand'));
    foreach (ihs_heritage_feed_items() as $item) {
        fputcsv($out, array($item['id'],$item['title'],$item['description'],$item['availability'],$item['condition'],$item['price'],$item['link'],$item['image_link'],$item['brand']));
    }
    fclose($out);
}
