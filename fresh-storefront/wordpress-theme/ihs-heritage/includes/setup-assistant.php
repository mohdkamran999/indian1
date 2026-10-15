<?php
if (!defined('ABSPATH')) { exit; }
/** Lightweight, opt-in first-run setup for the IHS Heritage theme. */
function ihs_heritage_setup_admin_notice() {
    if (!current_user_can('manage_options') || get_option('ihs_heritage_setup_done') || !isset($_GET['ihs_setup'])) return;
    if ($_GET['ihs_setup'] !== 'ready') return;
    echo '<div class="notice notice-info"><p><strong>IHS Heritage setup is available.</strong> Create the standard store pages and product categories with one click. Existing pages and products will not be deleted.</p><p><a class="button button-primary" href="' . esc_url(wp_nonce_url(admin_url('admin-post.php?action=ihs_heritage_run_setup'), 'ihs_heritage_run_setup')) . '">Set up IHS store pages</a></p></div>';
}
add_action('admin_notices', 'ihs_heritage_setup_admin_notice');
function ihs_heritage_setup_admin_link($links) {
    if (current_user_can('manage_options') && !get_option('ihs_heritage_setup_done')) {
        $links[] = '<a href="' . esc_url(admin_url('themes.php?ihs_setup=ready')) . '">Set up store pages</a>';
    }
    return $links;
}
add_filter('theme_action_links_ihs-heritage', 'ihs_heritage_setup_admin_link');
function ihs_heritage_run_setup() {
    if (!current_user_can('manage_options')) wp_die('You do not have permission to run this setup.');
    check_admin_referer('ihs_heritage_run_setup');
    $pages = [
        'home' => ['Home', ''],
        'our-story' => ['Our Story', '<!-- wp:heading --><h2>Our Story</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Indian Handicraft Standards celebrates the delicate artistry of Lucknowi Chikankari. Add your brand story here.</p><!-- /wp:paragraph -->'],
        'contact' => ['Contact', '<!-- wp:heading --><h2>Contact Indian Handicraft Standards</h2><!-- /wp:heading --><!-- wp:paragraph --><p>For order assistance, product questions and size help, contact our customer care team.</p><!-- /wp:paragraph -->'],
        'size-guide' => ['Size Guide', '<!-- wp:heading --><h2>Size Guide</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Please check the measurements listed on each product page. Add your verified garment measurements and fit guidance here before launch.</p><!-- /wp:paragraph -->'],
        'shipping-and-returns' => ['Shipping & Returns', '<!-- wp:heading --><h2>Shipping & Returns</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Publish your confirmed dispatch times, shipping charges, delivery regions, cancellation terms and return/refund policy before accepting orders.</p><!-- /wp:paragraph -->'],
    ];
    $ids = [];
    foreach ($pages as $slug => $data) {
        $existing = get_page_by_path($slug, OBJECT, 'page');
        if ($existing) { $ids[$slug] = $existing->ID; continue; }
        $id = wp_insert_post(['post_type'=>'page','post_status'=>'publish','post_title'=>$data[0],'post_name'=>$slug,'post_content'=>$data[1]]);
        if (!is_wp_error($id) && $id) $ids[$slug] = $id;
    }
    if (isset($ids['home'])) { update_option('show_on_front', 'page'); update_option('page_on_front', (int)$ids['home']); }
    if (class_exists('WooCommerce')) {
        foreach ([['long-kurtis','Long Kurtis'],['short-kurtis','Short Kurtis'],['co-ord-sets','Co-ord Sets'],['bottoms','Bottoms']] as $cat) {
            if (!term_exists($cat[0], 'product_cat')) wp_insert_term($cat[1], 'product_cat', ['slug'=>$cat[0]]);
        }
        if (function_exists('wc_create_pages')) wc_create_pages();
    }
    $menu = wp_get_nav_menu_object('IHS Main Menu');
    $menu_id = $menu ? (int)$menu->term_id : wp_create_nav_menu('IHS Main Menu');
    if (!is_wp_error($menu_id)) {
        $menu_items = [['Home','home'],['Shop','shop'],['Long Kurtis','long-kurtis'],['Short Kurtis','short-kurtis'],['Co-ord Sets','co-ord-sets'],['Our Story','our-story'],['Size Guide','size-guide'],['Contact','contact']];
        if (!wp_get_nav_menu_items($menu_id)) foreach ($menu_items as $item) {
            if ($item[0] === 'Shop' && function_exists('wc_get_page_id') && wc_get_page_id('shop') > 0) {
                wp_update_nav_menu_item($menu_id, 0, ['menu-item-title'=>$item[0],'menu-item-object'=>'page','menu-item-object-id'=>wc_get_page_id('shop'),'menu-item-type'=>'post_type','menu-item-status'=>'publish']);
            } elseif (isset($ids[$item[1]])) {
                wp_update_nav_menu_item($menu_id, 0, ['menu-item-title'=>$item[0],'menu-item-object'=>'page','menu-item-object-id'=>$ids[$item[1]],'menu-item-type'=>'post_type','menu-item-status'=>'publish']);
            } elseif (strpos($item[1], 'kurtis') !== false || $item[1] === 'co-ord-sets' || $item[1] === 'bottoms') {
                wp_update_nav_menu_item($menu_id, 0, ['menu-item-title'=>$item[0],'menu-item-url'=>home_url('/product-category/'.$item[1].'/'),'menu-item-type'=>'custom','menu-item-status'=>'publish']);
            }
        }
        $locations = get_theme_mod('nav_menu_locations', []); $locations['primary'] = $menu_id; $locations['footer'] = $menu_id; set_theme_mod('nav_menu_locations', $locations);
    }
    update_option('ihs_heritage_setup_done', 1);
    wp_safe_redirect(admin_url('themes.php?ihs_setup_complete=1')); exit;
}
add_action('admin_post_ihs_heritage_run_setup', 'ihs_heritage_run_setup');
function ihs_heritage_setup_complete_notice() {
    if (isset($_GET['ihs_setup_complete']) && current_user_can('manage_options')) echo '<div class="notice notice-success is-dismissible"><p><strong>IHS store setup finished.</strong> Review pages before taking orders. Payment, shipping, taxes and real product data still need your confirmation.</p></div>';
}
add_action('admin_notices', 'ihs_heritage_setup_complete_notice');
