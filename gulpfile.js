/*** Variables ***/
const { task, src, dest, series, parallel, watch } = require('gulp'),
  postcss = require('gulp-postcss'),
  sass = require('gulp-sass'),
  cssnano = require('cssnano'),
  fileinclude = require('gulp-file-include'),
  webpHtml = require('gulp-webp-html'),
  imagemin = require('gulp-imagemin'),
  imagewebp = require('gulp-webp'),
  uglifyJS = require('gulp-uglify'),
  babel = require('gulp-babel'),
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  clean = require('gulp-clean'),
  browserSync = require('browser-sync');

const compileDir = 'dest';
const buildDir = 'docs';

/*** Path ***/
const path = {
  src: {
    html: ['app/templates_html/*.html', '!app/templates_html/assets/_*.html'],
    scss: 'app/scss/**/main.scss',
    js: ['app/js/main.js'],
    img: 'app/img/**/*.*',
    fonts_ttf: 'app/fonts/**/*.ttf',
    fonts_woff: ['app/fonts/**/*.*', '!app/fonts/**/*.ttf'],
  },
  watch: {
    html: 'app/templates_html/**/*.html',
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
        prefix: '@',
        basepath: '@file',
      })
    )
    .pipe(webpHtml())
    .pipe(dest(compileDir))
    .pipe(browserSync.reload({ stream: true }));
});

task('html', series('clean-html', 'compile-html'));

// SCSS task
task('sass', function () {
  return src(path.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss(require('./postcss.config')))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(`${compileDir}/css`))
    .pipe(browserSync.reload({ stream: true }));
});

// JS task
task('js', function () {
  return src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(dest(`${compileDir}/js`))
    .pipe(browserSync.reload({ stream: true }));
});

// IMG tasks
task('clean-images', function () {
  return src(`${compileDir}/img`, { allowEmpty: true }).pipe(clean());
});

task('compile-images', function () {
  return src(path.src.img)
    .pipe(
      imagemin({
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
    .pipe(browserSync.reload({ stream: true }));
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
      baseDir: compileDir,
    },
    notify: false,
  });
});

// Watchers
task('watch', function () {
  watch(path.watch.html, parallel('html'));
  watch(path.watch.scss, parallel('sass'));
  watch(path.watch.js, parallel('js'));
  watch(path.watch.img, parallel('images'));
});

// Run tasks
task('fonts', parallel('ttf2woff', 'ttf2woff2', 'woff2'));
task('compile', parallel('html', 'sass', 'js', 'images'));
task('watch-changes', parallel('browser-sync', 'watch'));
task('default', series('compile', 'watch-changes'));

/*** Build tasks ***/
// Clean build directory task
task('build-clean', function () {
  return src(buildDir, { allowEmpty: true }).pipe(clean());
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
    .pipe(uglifyJS())
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
