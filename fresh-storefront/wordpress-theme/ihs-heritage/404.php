<?php
if (!defined('ABSPATH')) { exit; }
get_header();
?>
<main class="ihs-content"><div class="ihs-container" style="text-align:center;padding-block:70px">
<div class="ihs-eyebrow">404 • Page not found</div>
<h1 style="font:normal clamp(34px,5vw,54px) Georgia,serif;color:var(--ihs-ink)">This page has wandered off.</h1>
<p>Let's help you find your way back to our Chikankari collection.</p>
<a class="ihs-cta" href="<?php echo esc_url(home_url('/')); ?>">Back to home</a>
<?php if (function_exists('wc_get_page_permalink')) : ?> <a class="ihs-cta" href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">Shop the collection</a><?php endif; ?>
</div></main>
<?php get_footer(); ?>
