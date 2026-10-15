<footer class="ihs-footer"><div class="ihs-container ihs-footer-grid">
<div><strong>INDIAN HANDICRAFT STANDARDS</strong><br><small>Celebrating the heritage of Lucknowi Chikankari.</small></div>
<div><?php $wa=preg_replace('/[^0-9]/','',(string)get_theme_mod('ihs_whatsapp_number','')); if($wa){ ?><a href="<?php echo esc_url('https://wa.me/'.$wa); ?>" target="_blank" rel="noopener">WhatsApp size &amp; order help</a><br><?php } ?><small>Product availability, delivery and return terms are shown at checkout.</small></div>
<div><small>&copy; <?php echo esc_html(wp_date('Y')); ?> Indian Handicraft Standards</small></div>
</div></footer><?php wp_footer(); ?></body></html>
