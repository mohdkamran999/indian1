<?php
$wa=preg_replace('/[^0-9]/','',(string)get_theme_mod('ihs_whatsapp_number',''));
$shop_url=function_exists('wc_get_page_permalink')?wc_get_page_permalink('shop'):home_url('/shop');
?>
<footer class="ihs-footer"><div class="ihs-container ihs-footer-grid">
<div><strong>INDIAN HANDICRAFT STANDARDS</strong><br><small>Celebrating the heritage of Lucknowi Chikankari.</small></div>
<div><?php if($wa){ ?><a href="<?php echo esc_url('https://wa.me/'.$wa); ?>" target="_blank" rel="noopener">WhatsApp size &amp; order help</a><br><?php } ?><small>Product availability, delivery and return terms are shown at checkout.</small></div>
<div><small>&copy; <?php echo esc_html(wp_date('Y')); ?> Indian Handicraft Standards</small></div>
</div></footer>
<nav class="ihs-mobile-bottom" aria-label="<?php esc_attr_e('Mobile navigation','ihs-heritage'); ?>">
<a href="<?php echo esc_url(home_url('/')); ?>"><span aria-hidden="true">⌂</span><small>Home</small></a>
<a href="<?php echo esc_url($shop_url); ?>"><span aria-hidden="true">◇</span><small>Shop</small></a>
<?php if(function_exists('wc_get_cart_url')){ ?><a href="<?php echo esc_url(wc_get_cart_url()); ?>"><span aria-hidden="true">▢</span><small>Bag (<?php echo esc_html(ihs_heritage_cart_count()); ?>)</small></a><?php } ?>
<?php if($wa){ ?><a href="<?php echo esc_url('https://wa.me/'.$wa); ?>" target="_blank" rel="noopener"><span aria-hidden="true">↗</span><small>WhatsApp</small></a><?php } ?>
</nav>
<?php wp_footer(); ?></body></html>
