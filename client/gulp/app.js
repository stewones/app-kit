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


gulp.task('app', ['app-env', 'app-setting']);
//enviroment config constants
gulp.task('app-env', function() {
    var config = require('../src/core/env.json');
    var env = args.env || 'development';
    var envConfig = config[env];
    return ngConstant({
        name: 'app.env',
        constants: envConfig,
        stream: true
    }).pipe($.uglify({
        preserveComments: $.uglifySaveLicense
    })).pipe(rename('app.env.js')).pipe(gulp.dest('./src/core/main'));
});
//app settings constants
gulp.task('app-setting', function() {
    var config = require('../src/core/app.json');
    return ngConstant({
        name: 'app.setting',
        constants: config,
        stream: true
    }).pipe($.uglify({
        preserveComments: $.uglifySaveLicense
    })).pipe(rename('app.setting.js')).pipe(gulp.dest('./src/core/main'));
});