<?php
if (!defined('ABSPATH')) { exit; }
function ihs_heritage_setup() {
 load_theme_textdomain('ihs-heritage', get_template_directory() . '/languages');
 add_theme_support('title-tag'); add_theme_support('post-thumbnails');
 add_theme_support('custom-logo', array('height'=>90,'width'=>300,'flex-height'=>true,'flex-width'=>true));
 add_theme_support('html5', array('search-form','comment-form','comment-list','gallery','caption','style','script'));
 add_theme_support('woocommerce'); add_theme_support('wc-product-gallery-zoom'); add_theme_support('wc-product-gallery-lightbox'); add_theme_support('wc-product-gallery-slider');
 register_nav_menus(array('primary'=>__('Primary Menu','ihs-heritage'),'footer'=>__('Footer Menu','ihs-heritage')));
}
add_action('after_setup_theme','ihs_heritage_setup');
function ihs_heritage_assets(){wp_enqueue_style('ihs-heritage-style',get_stylesheet_uri(),array(),'1.0.0');}
add_action('wp_enqueue_scripts','ihs_heritage_assets');
function ihs_heritage_cart_count(){if(function_exists('WC') && WC()->cart){return (string)WC()->cart->get_cart_contents_count();}return '0';}
function ihs_heritage_customize_register($wp_customize){
 $wp_customize->add_section('ihs_contact',array('title'=>__('IHS Contact Details','ihs-heritage'),'priority'=>35));
 $wp_customize->add_setting('ihs_whatsapp_number',array('default'=>'','sanitize_callback'=>'sanitize_text_field'));
 $wp_customize->add_control('ihs_whatsapp_number',array('label'=>__('WhatsApp number (country code, digits only)','ihs-heritage'),'section'=>'ihs_contact','type'=>'text'));
 $wp_customize->add_setting('ihs_announcement_text',array('default'=>'Authentic Lucknowi Chikankari • Thoughtfully crafted','sanitize_callback'=>'sanitize_text_field'));
 $wp_customize->add_control('ihs_announcement_text',array('label'=>__('Announcement bar text','ihs-heritage'),'section'=>'ihs_contact','type'=>'text'));
}
add_action('customize_register','ihs_heritage_customize_register');
