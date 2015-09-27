'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var args = require('yargs').argv;
var ngConstant = require('gulp-angular-constant');
var rename = require("gulp-rename");
var path = require('path');
var conf = require('./conf');
var browserSync = require('browser-sync');
var _ = require('lodash');
var angularTranslate = require('gulp-angular-translate');

gulp.task('i18n', function() {
  return gulp.src('./src/core/locale/locale-*.json')
    .pipe(angularTranslate('app.i18n.js',{module:'app.i18n'}))
    .pipe(gulp.dest('./src/core/main'));
});