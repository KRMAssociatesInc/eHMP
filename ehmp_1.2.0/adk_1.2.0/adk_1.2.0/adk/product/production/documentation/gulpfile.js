/* jshint node:true */
'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var inject = require('gulp-inject');
var plumber = require('gulp-plumber');

gulp.task('vendorjs', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/underscore/underscore.js',
        'bower_components/backbone/backbone.js',
        'bower_components/waypoints/lib/jquery.waypoints.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/markdown-it/dist/markdown-it.js',
        'bower_components/markdown-it-container/dist/markdown-it-container.js',
        'bower_components/prism/prism.js',
        'bower_components/prism/components/prism-handlebars.js',
        'bower_components/q/q.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('vendorcss', ['vendorfonts'], function() {
    return gulp.src([
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/font-awesome/css/font-awesome.css',
        'bower_components/spinkit/css/spinkit.css',
        'bower_components/prism/themes/prism.css'
    ])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(minifyCSS())
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('vendorfonts', function() {
    return gulp.src([
        'bower_components/bootstrap/dist/fonts/**.{eof,svg, ttf,woff,woff2}',
        'bower_components/font-awesome/fonts/**.{eof,svg,ttf,woff,woff2}'
    ])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
    return gulp.src('image/*')
        .pipe(gulp.dest('dist/image'));
});

gulp.task('lint', function() {
    return gulp.src('markdown-reader.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

function handleError(err) {
    console.log(err);
    this.emit('end');  // jshint ignore:line
}

gulp.task('scss', function() {
    return gulp.src('scss/app.scss')
        .pipe(plumber(handleError))
        .pipe(sass())
        .pipe(concat('app.css'))
        .pipe(minifyCSS())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
    return gulp.src('js/*.js')
        .pipe(plumber(handleError))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html', ['alljs', 'allcss', 'images'], function() {
    gulp.src('./index.src.html')
        //.pipe(rename('./dist/index.html'))
        .pipe(inject(gulp.src([
            './dist/css/vendor.min.css',
            './dist/js/vendor.min.js'
        ], {read: false}), {relative: true, name: 'vendor'}))
        .pipe(inject(gulp.src([
            './dist/css/app.min.css',
            './dist/js/app.min.js'
        ], {read: false}), {relative: true}))
        .pipe(rename('./index.html'))
        .pipe(minifyHtml())
        //.pipe(gulp.dest('./dist'));
        .pipe(gulp.dest('./'));
});

gulp.task('watch', ['html'], function() {
    gulp.watch('js/*.js', ['lint', 'js']);
    gulp.watch('scss/*.scss', ['scss']);
    gulp.watch('index.src.html', ['html']);
});

gulp.task('copyfiles', ['vendorfonts', 'images']);
gulp.task('alljs', ['js', 'vendorjs']);
gulp.task('allcss', ['scss', 'vendorcss']);

gulp.task('default', ['html']);

