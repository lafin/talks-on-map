'use strict';

let gulp = require('gulp');
let concat = require('gulp-concat');
let csso = require('gulp-csso');
let base64 = require('gulp-base64');
let uglify = require('gulp-uglify');
let gulpif = require('gulp-if');
let chalk = require('chalk');

let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let streamify = require('gulp-streamify');
let path = require('path');

let isProd = process.env.PRODUCTION === 'true' ? true : false;

function errorHandler(error) {
  return console.log(chalk.red(error.message));
}

gulp.task('js', function() {
  browserify({
    entries: path.join(__dirname, '/public/js/app.jsx'),
    extensions: ['.jsx', '.js'],
    debug: true,
    ignore: []
  })
  .transform(babelify)
  .bundle().on('error', errorHandler)
  .pipe(source('script.js'))
  .pipe(gulpif(isProd, streamify(uglify())))
  .pipe(gulp.dest('build/js'));
});

gulp.task('less', function() {
  let less = require('gulp-less');
  return gulp.src(['public/less/**/*.less'])
    .pipe(concat('style.css'))
    .pipe(less().on('error', errorHandler))
    .pipe(base64().on('error', errorHandler))
    .pipe(csso().on('error', errorHandler))
    .pipe(gulp.dest('build/css'));
});

gulp.task('other', function() {
  return gulp.src(['public/vendor/other/*'])
    .pipe(gulp.dest('build'));
});

gulp.task('vendor', function() {
  // copy images
  gulp.src(['node_modules/leaflet/dist/images/*.png',
      'public/image/*'
    ])
    .pipe(gulp.dest('build/vendor/image'));

  // copy fonts
  gulp.src(['public/vendor/font/*'])
    .pipe(gulp.dest('build/vendor/font'));

  // build css
  gulp.src(['node_modules/leaflet/dist/leaflet.css',
      'public/vendor/css/*'
    ])
    .pipe(concat('vendor.css'))
    .pipe(base64())
    .pipe(csso())
    .pipe(gulp.dest('build/vendor'));

  // build js
  gulp.src(['node_modules/d3/d3.js',
      'node_modules/leaflet/dist/leaflet-src.js',
      'public/vendor/js/*.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/vendor'));
});

gulp.task('watch', function() {
  gulp.watch(['public/js/**/*.{js,jsx}', '*.{js,jsx}'], ['js']);
  gulp.watch(['public/less/**/*.less', '*.less'], ['less']);
});

gulp.task('server', function() {
  let nodemon = require('gulp-nodemon');
  nodemon({
    script: 'app.js',
    nodeArgs: ['--harmony'],
    ext: 'jade js',
    ignore: ['public/**', 'build/**', 'node_modules/**']
  }).on('error', errorHandler);
});

gulp.task('default', ['js', 'less', 'watch', 'server']);
gulp.task('prod', ['vendor', 'js', 'less', 'other']);
