<?php
if (!defined('ABSPATH')) { exit; }
get_header();
?>
<main class="ihs-content"><div class="ihs-container">
<?php while (have_posts()) : the_post(); ?>
<article <?php post_class(); ?>>
<header><h1><?php the_title(); ?></h1><p class="ihs-muted"><?php echo esc_html(get_the_date()); ?></p></header>
<?php if (has_post_thumbnail()) { the_post_thumbnail('large'); } ?>
<div class="entry-content"><?php the_content(); ?></div>
</article>
<?php endwhile; ?>
</div></main>
<?php get_footer(); ?>
