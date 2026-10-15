<!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open(); ?>
<div class="ihs-announcement"><?php echo esc_html(get_theme_mod('ihs_announcement_text','Authentic Lucknowi Chikankari • Thoughtfully crafted')); ?></div>
<header class="ihs-header"><div class="ihs-container ihs-headrow">
<a class="ihs-brand" href="<?php echo esc_url(home_url('/')); ?>"><?php if(has_custom_logo()){the_custom_logo();}else{ ?>INDIAN HANDICRAFT STANDARDS<small>THE ART OF CHIKANKARI</small><?php } ?></a>
<nav class="ihs-nav" aria-label="<?php esc_attr_e('Primary navigation','ihs-heritage'); ?>"><?php if(has_nav_menu('primary')){wp_nav_menu(array('theme_location'=>'primary','container'=>false,'items_wrap'=>'%3$s'));}else{ ?>
<a href="<?php echo esc_url(home_url('/')); ?>">Home</a><a href="<?php echo esc_url(function_exists('wc_get_page_permalink')?wc_get_page_permalink('shop'):home_url('/shop')); ?>">Shop</a><a href="<?php echo esc_url(home_url('/our-story/')); ?>">Our Story</a><?php } ?>
<?php if(function_exists('wc_get_cart_url')){ ?><a href="<?php echo esc_url(wc_get_cart_url()); ?>">Bag (<?php echo esc_html(ihs_heritage_cart_count()); ?>)</a><?php } ?></nav>
</div></header>
