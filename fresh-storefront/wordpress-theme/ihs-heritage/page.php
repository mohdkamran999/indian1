<?php
if (!defined('ABSPATH')) { exit; }
get_header();
?>
<main class="ihs-content"><div class="ihs-container">
<?php while (have_posts()) : the_post(); ?>
<article <?php post_class(); ?>>
<header><h1><?php the_title(); ?></h1></header>
<div class="entry-content"><?php the_content(); ?></div>
</article>
<?php endwhile; ?>
</div></main>
<?php get_footer(); ?>
