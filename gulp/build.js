'use strict';
var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'strip-*', 'main-bower-files', 'uglify-save-license', 'del']
});
gulp.task('partials', function() {
    return gulp.src([
        //path.join(conf.paths.src, '/sample/**/*.html'),
        path.join(conf.paths.src, '/core/**/*.html'),
        //path.join(conf.paths.tmp, '/serve/sample/**/*.html')
    ]).pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    })).pipe($.angularTemplatecache('templateCacheHtml.js', {
        module: conf.appName,
        root: 'core'
    })).pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});
gulp.task('html', ['inject', 'partials'], function() {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {
        read: false
    });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };
    var htmlFilter = $.filter('*.html');
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;
    return gulp.src(path.join(conf.paths.tmp, '/serve/sample/*.html')).pipe($.inject(partialsInjectFile, partialsInjectOptions)).pipe(assets = $.useref.assets()).pipe($.rev()).pipe(jsFilter).pipe($.ngAnnotate()).pipe($.uglify({
        preserveComments: $.uglifySaveLicense
    })).on('error', conf.errorHandler('Uglify')).pipe(jsFilter.restore()).pipe(cssFilter).pipe($.csso()).pipe(cssFilter.restore()).pipe(assets.restore()).pipe($.useref()).pipe($.revReplace()).pipe(htmlFilter).pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true,
        conditionals: true
    })).pipe(htmlFilter.restore()).pipe(gulp.dest(path.join(conf.paths.dist, '/sample'))).pipe($.size({
        title: path.join(conf.paths.dist, '/sample'),
        showFiles: true
    }));
});
// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function() {
    return gulp.src($.mainBowerFiles()).pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}')).pipe($.flatten()).pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});
gulp.task('other', function() {
    return gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/**/*.{html,css,js,less}')
    ]).pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});
gulp.task('clean', function(done) {
    $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});
gulp.task('serve-fa', function() {
    return gulp.src([
        path.join(conf.paths.src, '/core/layout/icons/font-awesome/fonts')
    ]).pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/sample')));
});
gulp.task('lib-js-min', [], function() {
    return gulp.src([
        path.join(conf.paths.src, '/core/**/*.module.js'),
        path.join(conf.paths.src, '/core/**/*.js'),
        path.join('!' + conf.paths.src, '/core/**/*.spec.js'),
        path.join('!' + conf.paths.src, '/core/**/*.mock.js')
    ]).pipe($.ngAnnotate()).pipe($.concat('app-module.min.js')).pipe($.uglify({
        preserveComments: $.uglifySaveLicense
    })).pipe($.size()).pipe(gulp.dest(path.join(conf.paths.src, '/')));
});
gulp.task('lib-js', ['partials'], function() {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {
        read: false
    });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };
    return gulp.src([
            path.join(conf.paths.src, '/core/**/*.module.js'),
            path.join(conf.paths.src, '/core/**/*.js'),
            path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'),
            path.join('!' + conf.paths.src, '/core/**/*.spec.js'),
            path.join('!' + conf.paths.src, '/core/**/*.mock.js')
        ])
        //.pipe($.ngAnnotate())
        .pipe($.concat('app-module.js'))
        // .pipe($.uglify({
        //     preserveComments: $.uglifySaveLicense
        // }))
        .pipe($.size()).pipe(gulp.dest(path.join(conf.paths.src, '/')));
});
gulp.task('lib-css', [], function() {
    return gulp.src([
        path.join(conf.paths.src, '/core/**/*.css')
    ]).pipe($.concat('app-module.css')).pipe($.size()).pipe(gulp.dest(path.join(conf.paths.src, '/')));
});
gulp.task('build-docs', [], function() {
    var gulpDocs = require('gulp-ngdocs');
    var options = {
        //scripts: ['../app.min.js'],
        html5Mode: true,
        startPage: '/api',
        title: "app kit api",
        //image: "path/to/my/image.png",
        //imageLink: "http://my-domain.com",
        titleLink: "/api"
    }
    return gulp.src(path.join(conf.paths.src, '/core/**/*.js')).pipe(gulpDocs.process(options)).pipe(gulp.dest('docs'));
});
gulp.task('build-core', ['lib-js', 'lib-css' /*,'serve-fa'*/ ]);
gulp.task('build', ['html', 'fonts', 'other', /*'doc-pro', 'lib-js-min'*/ , 'build-core']);