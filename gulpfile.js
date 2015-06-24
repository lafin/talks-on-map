'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var base64 = require('gulp-base64');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var chalk = require('chalk');

var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

var isProd = process.env.PRODUCTION === 'true' ? true : false;

function errorHandler(error) {
    return console.log(chalk.red(error.message));
}

gulp.task('js', function () {
    browserify({
            entries: __dirname + '/public/js/app.jsx',
            extensions: ['.jsx', '.js'],
            debug: true,
            ignore: ['bower_components']
        })
        .transform(babelify)
        .bundle()
        .on('error', errorHandler)
        .pipe(source('script.js'))
        .pipe(gulpif(isProd, streamify(uglify())))
        .pipe(gulp.dest('build/js'));
});

gulp.task('less', function () {
    var less = require('gulp-less');
    return gulp.src(['public/less/**/*.less'])
        .pipe(concat('style.css'))
        .pipe(less().on('error', errorHandler))
        .pipe(base64().on('error', errorHandler))
        .pipe(csso().on('error', errorHandler))
        .pipe(gulp.dest('build/css'));
});

gulp.task('vendor', function () {
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
            'bower_components/L.EasyButton/easy-button.js',
            'public/vendor/js/*.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/vendor'));
});

gulp.task('watch', function () {
    gulp.watch(['public/js/**/*.{js,jsx}', '*.{js,jsx}'], ['js']);
    gulp.watch(['public/less/**/*.less', '*.less'], ['less']);
});

gulp.task('server', function () {
    var nodemon = require('gulp-nodemon');
    nodemon({
        script: 'app.js',
        nodeArgs: [],
        ext: 'jade js',
        ignore: ['public/**', 'build/**', 'node_modules/**', 'bower_components/**']
    }).on('error', errorHandler);
});

gulp.task('default', ['js', 'less', 'watch', 'server']);
gulp.task('prod', ['vendor', 'js', 'less']);