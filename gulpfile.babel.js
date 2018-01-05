'use strict';

// Proxy URL (optional)
const proxyUrl = 'base-theme.localhost';
// API keys
const TINYPNG_KEY = '';
// fonts
const fontList = [];
// vendors
const jsVendorList  = [];
const cssVendorList = [];

// paths to relevant directories
const dirs = {
  src: './src',
  dest: './dist'
};

// paths to file sources
const sources = {
  js: `${dirs.src}/**/*.js`,
  scss: `${dirs.src}/**/*.scss`,
  coreScss: `${dirs.src}/scss/main.scss`,
  img: `./images/**/*.{png,jpg,jpeg}`,
  font: fontList,
  jsVendor: jsVendorList,
  cssVendor: cssVendorList
};

// paths to file destinations
const dests = {
  js: `./js`,
  css: `./css`,
  img: `${dirs.dest}/img`,
  sigFile: `./images/.tinypng-sigs`,
  font: `${dirs.dest}/fonts`,
  vendor: `${dirs.dest}/vendors`
};

// plugins
import gulp from 'gulp';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

// auto-load plugins
const $ = gulpLoadPlugins();

/****************************************
  Gulp Tasks
*****************************************/

// launch browser sync as a standalone local server
gulp.task('browser-sync-local', browserSyncLocal());
// browser-sync task for starting the server by proxying a local url
gulp.task('browser-sync-proxy', browserSyncProxy());
// copy vendor CSS
gulp.task('css-vendors', cssVendors());
// copy fonts
gulp.task('fonts', fonts());
// Lint Javascript Task
gulp.task('js-lint', javascriptLint());
// Concatenate and Minify Vendor JS
gulp.task('js-vendors', javascriptVendors());
// lint sass task
gulp.task('sass-lint', sassLint());
// Concatenate & Minify JS
gulp.task('scripts', ['js-lint'], scripts());
// compile, prefix, and minify the sass
gulp.task('styles', styles());
// compress and combine svg icons
gulp.task('svg', svg());
// Unit testing
gulp.task('test', test());
// compress png and jpg images via tinypng API
gulp.task('tinypng', tinypng());
// Watch Files For Changes
gulp.task('watch', watch());

// default task builds src, opens up a standalone server, and watches for changes
gulp.task('default', [
  'fonts',
  'styles',
  'scripts',
  'browser-sync-local',
  'watch'
]);

// local task builds src, opens up a standalone server, and watches for changes
gulp.task('local', [
  'fonts',
  'styles',
  'scripts',
  'browser-sync-local',
  'watch'
]);

// proxy task builds src, opens up a proxy server, and watches for changes
gulp.task('proxy', [
  'fonts',
  'styles',
  'scripts',
  'browser-sync-proxy',
  'watch'
]);

// builds everything
gulp.task('build', [
  'fonts',
  'styles',
  'scripts',
  'css-vendors',
  'js-vendors'
]);

// builds the vendor files
gulp.task('vendors', [
  'css-vendors',
  'js-vendors'
]);

// compresses imagery
gulp.task('images', [
  'svg',
  'tinypng'
]);

/****************************************
  Task Logic
*****************************************/

function browserSyncLocal () {
  return () => {
    browserSync.init({
      server: '../../../../'
    });
  };
}

function browserSyncProxy () {
  return () => {
    browserSync.init({
      proxy: proxyUrl
    });
  };
}

function cssVendors () {
  return () => {
    return gulp.src(sources.cssVendor)
      .pipe(gulp.dest(dests.vendor));
  };
}

function fonts () {
  return () => {
    gulp.src(sources.font)
      .pipe(gulp.dest(dests.font));
  };
}

function javascriptLint () {
  return () => {
    return gulp.src(sources.js)
      .pipe($.jshint({esversion: 6}))
      .pipe($.jshint.reporter('jshint-stylish'));
  };
}

function javascriptVendors () {
  return () => {
    return gulp.src(sources.jsVendor)
      .pipe($.plumber())
      .pipe($.concat('vendors.min.js'))
      .pipe($.uglify())
      .pipe(gulp.dest(dests.vendor));
  };
}

function sassLint () {
  return () => {
    return gulp.src(sources.scss)
      .pipe($.sassLint())
      .pipe($.sassLint.format())
      .pipe($.sassLint.failOnError());
  };
}

function scripts () {
  return () => {
    return gulp.src(sources.js)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
        .pipe($.concat('main.js'))
        .pipe($.babel())
        .pipe(gulp.dest(dests.js))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dests.js))
      .pipe(browserSync.stream());
  };
}

function styles () {
  return () => {
    return gulp.src(sources.coreScss)
      .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer(["> 1%", "last 2 versions"], { cascade: true }))
        .pipe(gulp.dest(dests.css))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cleanCss())
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(dests.css))
      .pipe(browserSync.stream());
  };
}

function svg () {
  return () => {
    return gulp.src('./img/icons/*.svg')
      .pipe($.svgmin())
      .pipe($.svgstore())
      .pipe(gulp.dest('./img/icons'));
  };
}

function test (done) {
  return () => {
    let server = new karma.Server('./karma.conf.js', done);
    server.start();
  };
}

function tinypng () {
  return () => {
    return gulp.src(sources.img)
      .pipe($.tinypngCompress({
        key: TINYPNG_KEY,
        sigFile: dests.sigFile
      }))
      .pipe(gulp.dest(dests.img));
  };
}

function watch () {
  return () => {
    gulp.watch(sources.js, ['scripts']);
    gulp.watch(sources.scss, ['styles']);
    gulp.watch('**/*.php', browserSync.reload);
    gulp.watch('**/*.twig', browserSync.reload);
  };
}
