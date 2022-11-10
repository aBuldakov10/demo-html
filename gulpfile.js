/*** Variables ***/
const { task, src, dest, series, parallel, watch } = require('gulp'), // Include gulp
  postcss = require('gulp-postcss'), // Use several CSS plugins
  sass = require('gulp-sass'), // Include SASS
  cssnano = require('cssnano'), // Minify CSS in postcss
  fileinclude = require('gulp-file-include'), // Include HTML into HTML
  webpHtml = require('gulp-webp-html'), // Auto add webp for img
  pug = require('gulp-pug'), // Include Pug
  imagemin = require('gulp-imagemin'), // Minify images
  imagewebp = require('gulp-webp'), // Minify images
  uglifyJS = require('gulp-uglify'), // Minify JS
  babel = require('gulp-babel'), // Transform ES6 into ES5
  ttf2woff = require('gulp-ttf2woff'), // Convert ttf to woff
  ttf2woff2 = require('gulp-ttf2woff2'), // Convert ttf to woff2
  sourcemaps = require('gulp-sourcemaps'), // Add site map
  concat = require('gulp-concat'), // Files concatination
  clean = require('gulp-clean'), // Clean destination directory
  browserSync = require('browser-sync'); // Include Browser Sync

const compileDir = 'dest';
const buildDir = 'docs'; // Use 'docs' directory for GitHub Pages and 'build' in other cases

/*** Path ***/
const path = {
  src: {
    html: ['app/templates_html/*.html', '!app/templates_html/assets/_*.html'],
    pug: 'app/templates_pug/*.pug',
    scss: 'app/scss/**/main.scss',
    js: ['app/js/main.js'], // Array of included js files
    img: 'app/img/**/*.*',
    fonts_ttf: 'app/fonts/**/*.ttf',
    fonts_woff: ['app/fonts/**/*.*', '!app/fonts/**/*.ttf'],
  },
  watch: {
    html: 'app/templates_html/**/*.html',
    pug: 'app/templates_pug/**/*.pug',
    scss: 'app/scss/**/*.scss',
    js: 'app/js/*.js',
    img: 'app/img/**/*.*',
  },
  build: {
    html: 'dest/*.html',
    css: 'dest/css/**/*.css',
    js: 'dest/js/*.js',
    img: 'dest/img/**/*.*',
    fonts: 'dest/fonts/**/*.*',
  },
};

/*** Dev tasks ***/
// HTML task
task('clean-html', function () {
  return src(`${compileDir}/**/*.html`, { allowEmpty: true }).pipe(clean());
});

task('compile-html', function () {
  return src(path.src.html)
    .pipe(
      fileinclude({
        prefix: '@', // Prefix before include file ex. @include('path/_head.html', {})
        basepath: '@file',
      })
    )
    .pipe(webpHtml()) // Add webp for img
    .pipe(dest(compileDir))
    .pipe(browserSync.reload({ stream: true })); // Update html after change
});

task('html', series('clean-html', 'compile-html'));

// PUG task
task('compile-pug', function () {
  return src(path.src.pug)
    .pipe(pug({ pretty: true })) // Transform html easy reading
    .pipe(dest(compileDir))
    .pipe(browserSync.reload({ stream: true })); // Update html after change
});

task('pug', series('clean-html', 'compile-pug'));

// SCSS task
task('sass', function () {
  return src(path.src.scss)
    .pipe(sourcemaps.init()) // Site map init
    .pipe(sass({ outputStyle: 'expanded' })) // Transform sass/scss into css
    .pipe(postcss(require('./postcss.config')))
    .pipe(sourcemaps.write('.')) // SourceMaps path write
    .pipe(dest(`${compileDir}/css`))
    .pipe(browserSync.reload({ stream: true })); // Update CSS after change
});

// JS task
task('js', function () {
  return src(path.src.js)
    .pipe(sourcemaps.init()) // Site map init
    .pipe(concat('main.js')) // Files concatination
    .pipe(babel()) // Transform ES6 into ES5
    .pipe(dest(`${compileDir}/js`))
    .pipe(browserSync.reload({ stream: true })); // Update images after change
});

// IMG tasks
task('clean-images', function () {
  return src(`${compileDir}/img`, { allowEmpty: true }).pipe(clean());
});

task('compile-images', function () {
  return src(path.src.img)
    .pipe(
      imagemin({
        // Minify images
        progressive: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(`${compileDir}/img`))
    .pipe(
      imagewebp({
        quality: 70,
      })
    )
    .pipe(dest(`${compileDir}/img`))
    .pipe(browserSync.reload({ stream: true })); // Update images after change
});

task('images', series('clean-images', 'compile-images'));

// Fonts
// -- Convert ttf to woff --
task('ttf2woff', function () {
  return src(path.src.fonts_ttf)
    .pipe(ttf2woff())
    .pipe(dest(`${compileDir}/fonts`));
});

// -- Convert ttf to woff2 --
task('ttf2woff2', function () {
  return src(path.src.fonts_ttf)
    .pipe(ttf2woff2())
    .pipe(dest(`${compileDir}/fonts`));
});

// -- Move woff/woff2 fonts from app to dest without convert --
task('woff2', function () {
  return src(path.src.fonts_woff).pipe(dest(`${compileDir}/fonts`));
});

// Browser Sync task
task('browser-sync', function () {
  browserSync({
    server: {
      // Set server parameters
      baseDir: compileDir, // Server directory
    },
    notify: false, // Notification off
    // online: false, // Work offline without internet
    // tunnel: true, tunnel: 'projectname' // Demonstration page: http://projectname.localtunnel.me
  });
});

// Watchers
task('watch', function () {
  // watch(path.watch.pug, parallel('pug')); // Watch Pug files
  watch(path.watch.html, parallel('html')); // Watch HTML files
  watch(path.watch.scss, parallel('sass')); // Watch SASS files
  watch(path.watch.js, parallel('js')); // Watch JS files
  watch(path.watch.img, parallel('images')); // Watch image files
});

// Run tasks
task('fonts', parallel('ttf2woff', 'ttf2woff2', 'woff2')); // Convert and move fonts to dest before run gulp
task('compile', parallel('html', 'sass', 'js', 'images')); // Run with HTML
// task('compile', parallel('pug', 'sass', 'js', 'images')); // Run with Pug
task('watch-changes', parallel('browser-sync', 'watch'));
task('default', series('compile', 'watch-changes')); // Default task for run gulp

/*** Build tasks ***/
// Clean build directory task
task('build-clean', function () {
  return src(buildDir, { allowEmpty: true }).pipe(clean()); // Clean build directory
});

// Task for moving all HTML files from dest to build directory
task('build-html', function () {
  return src(path.build.html).pipe(dest(buildDir));
});

// Task for moving all CSS files from dest to build directory
task('build-css', function () {
  return src(path.build.css)
    .pipe(postcss([cssnano({ preset: 'default' })]))
    .pipe(dest(`${buildDir}/css`));
});

// Task for moving all JS files from dest to build directory
task('build-js', function () {
  return src(path.build.js)
    .pipe(uglifyJS()) // Minify JS
    .pipe(dest(`${buildDir}/js`));
});

// Task for moving all images from dest to build directory
task('build-images', function () {
  return src(path.build.img).pipe(dest(`${buildDir}/img`));
});

// Task for moving all fonts from dest to build directory
task('build-fonts', function () {
  return src(path.build.fonts).pipe(dest(`${buildDir}/fonts`));
});

// Run build
task(
  'build',
  series(
    'build-clean',
    'build-html',
    'build-css',
    'build-js',
    'build-images',
    'build-fonts'
  )
);
