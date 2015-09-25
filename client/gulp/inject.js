'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');


gulp.task('inject', ['scripts', 'styles'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/core/**/*.css'),
    path.join(conf.paths.src, '/core/**/*.css'),//inject components
    path.join('!' + conf.paths.tmp, '/serve/core/vendor.css')
  ], { read: false });


  var injectScripts = gulp.src([

    path.join(conf.paths.src, '/core/**/*.module.js'),
    path.join(conf.paths.src, '/core/**/*.js'),

    path.join('!' + conf.paths.src, '/core/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/core/**/*.mock.js')

  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));


  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});