var gulp = require('gulp');
var coffee = require('gulp-coffee');
var stylus = require('gulp-stylus');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var nano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var coffeelint = require('gulp-coffeelint');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();

var debug = !!(argv.debug); // true if --debug flag is used
var local_wp = require('./local-wp.json'); // Load local WP dev env

// Project config

var project = {
	name: 'ted_x',

	scripts: 'src/scripts/**/*.coffee',

	styles: 'src/sass/**/*.scss',

	templates: [
	'src/**/*',
	'!src/**/*.css',
	'!src/sass/**/*.scss',
	'!src/**/*.txt'
	],

	images: 'src/images/**/*',

	build: './build/',

	dist: './build/**/*'
};

// Emancipate yourself from build-folder slavery
// None but ourselves can free our project
//    - Bob Marley
gulp.task('clean', function(cb) {
	del(project.build, cb);
	});

// Process styling and minify
gulp.task('styles', function() {
	return gulp.src(project.styles)
	.pipe(sourcemaps.init())
	.pipe(plumber())
	.pipe(sass({
		errLogToConsole: true,
		 outputStyle: 'expanded'    // nested, expanded, compact, compressed
		 }))
	.pipe(autoprefixer({
		browsers: ['last 3 versions'],
		cascade: false
		}))
	.pipe(gulpif(debug, sourcemaps.write({ sourceRoot: 'src/sass/' })))
	.pipe(gulp.dest(project.build))
	.pipe(browserSync.stream({match: '**/*.css'}));
	});

// Transpile coffee, minify and provide sourcemaps
gulp.task('scripts', function() {
	return gulp.src(project.scripts)
	.pipe(plumber())
	.pipe(gulpif(debug, sourcemaps.init()))
	.pipe(coffeelint({
		no_tabs: { level: "ignore" },
		indentation: { value: 1 },
		max_line_length: { level: "ignore" }
		}))
	.pipe(coffeelint.reporter())
	.pipe(coffee())
	.pipe(uglify({
		mangle: false,
		beautify: false
		}))
	.pipe(gulpif(debug, sourcemaps.write()))
	.pipe(gulp.dest(project.build + 'scripts'))
	.pipe(browserSync.stream({match: '**/*.js'}));
	});

// Copy templates
gulp.task('templates', function(){
	return gulp.src(project.templates)
	.pipe(gulp.dest(project.build));
	});

// Copy images
gulp.task('images', function(){
	return gulp.src(project.images)
	.pipe(gulp.dest(project.build + 'images'));
	});

// Do a complete build
gulp.task('build', function() {
	gulp.start('styles', 'scripts', 'templates', 'images');
	});

// Rerun the task when a file changes
gulp.task('watch', function() {
	browserSync.init({
		files: ['**/*.php'],
		proxy: local_wp.devUrl
	});
	gulp.watch(project.templates, ['templates']);
	gulp.watch(project.styles, ['styles']);
	gulp.watch(project.scripts, ['scripts']);
	});

// Copy to local WP
gulp.task('deploy', ['styles', 'scripts', 'templates', 'images'], function() {
	return gulp.src(project.dist)
	.pipe(gulp.dest(local_wp.path + project.name))
	});

// The default task (called when you run `gulp` from cli)
gulp.task('default', function(){
	gutil.log('No default task, use', gutil.colors.green('gulp <task>'), 'instead');
	gutil.log('Tasks available:');
	gutil.log(gutil.colors.green('gulp clean'), 'to clean the project of previous builds');
	gutil.log(gutil.colors.green('gulp build'), 'to make a complete build for development');
	gutil.log(gutil.colors.green('gulp watch'), 'to watch for changes and reload with browser-sync');
  gutil.log(gutil.colors.green('gulp deploy'), 'to make a complete build and save it in deploy folder');
	});
