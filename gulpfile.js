var gulp = require('gulp');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

function makeBundle(name) {
    return gulp.src([
        'src/main.js',
        'src/Auth.js',
        'src/AuthProvider.js',
        'src/AuthToken.js',
        'src/HttpAuthInterceptor.js',
        'src/JwtAuth.js',
        ])
        .pipe(concat(name))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'));
}

gulp.task('makeNormal', function() {
    makeBundle('JwtAuth.js')
        .pipe(gulp.dest("./dist"));
});

gulp.task('makeMinified', function() {
    makeBundle('JwtAuth.min.js')
        .pipe(uglify())
        .pipe(gulp.dest("./dist"));
});

gulp.task('default', ['lint', 'makeNormal', 'makeMinified']);
