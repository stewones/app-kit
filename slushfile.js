var _ = require('lodash'),
    gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    inquirer = require('inquirer');

gulp.task('default', function (done) {
    inquirer.prompt([
        { type: 'input', name: 'name', message: 'Give your app a name', default: gulp.args.join(' ') }, // Get app name from arguments by default
        { type: 'confirm', name: 'moveon', message: 'Continue?' }
    ],
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.nameDashed = _.kebabCase(answers.name);
            var inject = [__dirname + '/client/**', '!' + __dirname + '/client/build/**'];
            gulp.src(inject) // Note use of __dirname to be relative to generator
                .pipe(template(answers))                 // Lodash template support
                .pipe(conflict('./client'))                    // Confirms overwrites on file conflicts
                .pipe(gulp.dest('./client'))                   // Without __dirname here = relative to cwd
                .pipe(install())                         // Run `bower install` and/or `npm install` if necessary
                .on('end', function () {
                    done();                              // Finished!
                })
                .resume();
        });
});

gulp.task('angular-controller', function (done) {
    inquirer.prompt([
        { type: 'input', name: 'module', message: 'What is the module?', default: gulp.args.join(' ') },
        { type: 'input', name: 'name', message: 'What is the name of controller?', default: gulp.args.join(' ') },
        { type: 'confirm', name: 'moveon', message: 'Continue?' }
    ],
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.nameDashed = _.kebabCase(answers.name);
            answers.nameCamel = _.camelCase(answers.name);
            answers.nameStart = _.startCase(answers.name);
            answers.moduleCamel = _.camelCase(answers.module);

            var inject = [__dirname + '/template/angularController.js'];
            gulp.src(inject) // Note use of __dirname to be relative to generator              
                .pipe(template(answers))                 // Lodash template support

                .pipe(conflict('./client/src/app/modules/' + answers.moduleCamel))                    // Confirms overwrites on file conflicts
                .pipe(rename(answers.nameCamel + '.controller.js'))
                .pipe(gulp.dest('./client/src/app/modules/' + answers.moduleCamel))                   // Without __dirname here = relative to cwd
                .pipe(install())                         // Run `bower install` and/or `npm install` if necessary
                .on('end', function () {
                    done();                              // Finished!
                })
                .resume();
        });
});