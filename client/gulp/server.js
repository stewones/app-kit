'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var middleware = require('./proxy');


function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if(baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  if(middleware.length > 0) {
    server.middleware = middleware;
  }

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser

  });

}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

gulp.task('serve', ['watch','app','i18n','build-lib'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['i18n','build-lib','build'], function () {
  browserSyncInit(conf.paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(conf.paths.dist, []);
});
