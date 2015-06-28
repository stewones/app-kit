'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'stream-*', 'main-bower-files', 'uglify-save-license', 'del']
});

var wiredep = require('wiredep').stream;
var _ = require('lodash');


gulp.task('inject', ['scripts', 'styles', 'build-core','build-docs'], function() {
    var injectStyles = gulp.src([
        path.join(conf.paths.tmp, '/serve/sample/**/*.css'),
        path.join(conf.paths.src, '/sample/**/*.css'), //inject components
        //path.join('!' + conf.paths.tmp, '/serve/sample/vendor.css')
    ], {
        read: false
    });


    var injectScripts = gulp.src([
        path.join(conf.paths.src, '/**/*.module.js'),
        path.join(conf.paths.src, '/**/*.js'),
        path.join('!' + conf.paths.src, '/**/*.spec.js'),
        path.join('!' + conf.paths.src, '/**/*.mock.js')
    ]).pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));


    var injectLibScripts = gulp.src([
        path.join(conf.paths.src, '/core/**/*.module.js'),
        path.join(conf.paths.src, '/core/**/*.js'),
        path.join('!' + conf.paths.src, '/core/**/*.spec.js'),
        path.join('!' + conf.paths.src, '/core/**/*.mock.js')

    ]).pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));


    var injectDocScripts = gulp.src([
        path.join(conf.paths.src, '/sample/**/*.js'),

        path.join('!' + conf.paths.src, '/sample/**/*.spec.js'),
        path.join('!' + conf.paths.src, '/sample/**/*.mock.js')

    ])
        .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));


    var injectOptions = {
        ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve/sample')],
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.src, '/sample/*.html'))
        .pipe($.inject(injectStyles, injectOptions))
        //.pipe($.inject(injectScripts, injectOptions))
        .pipe($.inject($.streamSeries(/*injectLibScripts,*/ injectDocScripts), injectOptions))
        .pipe(wiredep(_.extend({
            exclude: [/angular-mocks/]
        }, conf.wiredep)))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/sample')));
});