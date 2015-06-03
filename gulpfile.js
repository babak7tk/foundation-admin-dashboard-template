'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var del = require('del');
var runSequence = require('run-sequence');


//web server setup
gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    root: ['target'],
    port: 8092
  });
});


// Lint Task - make sure no error in JS files
gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Compile Our Sass
gulp.task('compilesass', function() {
    return gulp.src([
      './bower_components/foundation/scss'
      ])
        .pipe(sass({
          includePaths: [
              './bower_components/foundation/scss'
          ]
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./src/css'));
});

// Concatenate lib CSS
gulp.task('concatcssdependency', function() {
    return gulp.src([
      './bower_components/foundation/css/foundation.css',
      './bower_components/foundation/css/normalize.css',
      './bower_components/foundation-icon-fonts/foundation-icons.css',
      ])
        .pipe(concat('main.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./target/css'));
});

// Concatenate app CSS
gulp.task('appcss', function() {
    return gulp.src([
      './src/*.css'
      ])
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest('./target/css'));
});

// Concatenate lib JS
gulp.task('concatjsdependency', function() {
    return gulp.src([
      './bower_components/foundation/js/vendor/modernizr.js',
      './bower_components/foundation/js/vendor/jquery.js',
      './bower_components/foundation/js/foundation.js',
      './bower_components/foundation/js/foundation/foundation.offcanvas.js',
      './bower_components/foundation/js/foundation/foundation.topbar.js'
      ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./target/js'));
});

// Concatenate & Minify app JS
gulp.task('appscripts', function() {
    return gulp.src('./src/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./target/js'));
});

//copy module html & minify
gulp.task('apphtmlmodule', function() {
  return gulp.src([
    './src/modules/**/*.html'
])
.pipe(minifyHTML())
.pipe(gulp.dest('./target/modules/'));
});

//copy index html & minify
gulp.task('apphtmlindex', function() {
  return gulp.src([
    './src/index.html'
])
.pipe(minifyHTML())
.pipe(gulp.dest('./target/'));
});

//copy assets
gulp.task('copyassets', function() {
  return gulp.src([
    './src/assets/**/*'
])
.pipe(gulp.dest('./target/assets/'));
});

//copy foundation icons
gulp.task('copyfoundationicons', function() {
  return gulp.src([
    './bower_components/foundation-icon-fonts/*.eot',
    './bower_components/foundation-icon-fonts/*.svg',
    './bower_components/foundation-icon-fonts/*.ttf',
    './bower_components/foundation-icon-fonts/*.woff'
])
.pipe(gulp.dest('./target/css/'));
});

gulp.task('cleanTarget', function() {
  return del(['target/*'], function (err, deletedFiles) {
    console.log('Files deleted:', deletedFiles.join(', '));
    });
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/*.js', ['lint', 'appscripts']);
    gulp.watch('src/*.css', ['appcss']);
    gulp.watch('bower_components/*.css', ['concatcssdependency']);
    gulp.watch('bower_components/*.js', ['concatjsdependency']);
    gulp.watch('src/*.html', ['apphtmlmodule', 'apphtmlindex']);
    gulp.watch('src/assets/*', ['copyassets']);
});

// build package
gulp.task('build:tar', function () {
    return gulp.src('./target/**/*')
        .pipe(tar('archive.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./target'));
});

gulp.task('default', function () {
    runSequence('lint', 'cleanTarget',
    'concatcssdependency', 'concatjsdependency',
    'appscripts', 'appcss', 'apphtmlmodule', 'apphtmlindex', 'copyassets', 'copyfoundationicons',
    'webserver', 'watch');
});

gulp.task('package', function () {
    runSequence('lint', 'cleanTarget',
    'concatcssdependency', 'concatjsdependency',
    'appscripts', 'appcss', 'apphtmlmodule', 'apphtmlindex', 'copyassets', 'copyfoundationicons',
    'build:tar');
});
