'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var karma = require('karma');

function runTests (singleRun, done) {
  karma.server.start({
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, done);
}

gulp.task('test', ['scripts','app'], function(done) {
  runTests(true, done);
});

gulp.task('test:auto', ['watch','app'], function(done) {
  runTests(false, done);
});
