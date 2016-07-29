<?php
/**
 * Template Name: Custom Contact Page
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package ted_x
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<section class="red-page-header">
				<div class="red-page-header__line"></div>
				<h2 class="red-page-header__headline"><?php the_field('get_in_touch_headline'); ?></h2>
				<p class="red-page-header__text"><?php the_field('get_in_touch_intro_p'); ?></p>
			</section>

			<?php
			while ( have_posts() ) : the_post();

				get_template_part( 'template-parts/content', 'page' );

			endwhile; // End of the loop.
			?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
get_footer();
