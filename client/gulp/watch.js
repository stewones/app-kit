'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

gulp.task('watch', ['inject'], function() {

    gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);


    gulp.watch([
        path.join(conf.paths.src, '/core/**/*.css'),
        path.join(conf.paths.src, '/core/**/*.less')
    ], function(event) {

        if (isOnlyChange(event)) {
            gulp.start('styles');
            browserSync.reload(event.path);
        } else {
            gulp.start('inject');
        }
    });



    gulp.watch(path.join(conf.paths.src, '/core/**/*.js'), function(event) {

        if (isOnlyChange(event)) {
            gulp.start('scripts');
        } else {
            gulp.start('inject');
        }
    });



    gulp.watch(path.join(conf.paths.src, '/core/**/*.html'), function(event) {
        browserSync.reload(event.path);
    });
});