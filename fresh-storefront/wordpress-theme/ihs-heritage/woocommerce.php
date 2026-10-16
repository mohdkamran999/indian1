<?php
if (!defined('ABSPATH')) { exit; }
get_header();
?>
<main class="ihs-content"><div class="ihs-container">
<?php if (function_exists('woocommerce_breadcrumb')) { woocommerce_breadcrumb(); } ?>
<?php woocommerce_content(); ?>
</div></main>
<?php get_footer(); ?>
