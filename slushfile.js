var _ = require('lodash'),
    gulp = require('gulp'),
    install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    inquirer = require('inquirer'),
    colors = require('colors');

gulp.task('default', function (done) {
    inquirer.prompt([
        { type: 'input', name: 'name', message: 'Give your app a name. Default is `appkit`', default: gulp.args.join('appkit') }, // Get app name from arguments by default
        { type: 'input', name: 'version', message: 'Give version for your app. default is `0.0.1`', default: gulp.args.join('0.0.1') },
        { type: 'input', name: 'authorName', message: 'Give an author name for your app. default is `bot`', default: gulp.args.join('bot') },
        { type: 'input', name: 'authorEmail', message: 'Give an author email for your app. default is `hello@world.com`', default: gulp.args.join('hello@world.com') },
        { type: 'input', name: 'license', message: 'Give a license for your app. default is `MIT`', default: gulp.args.join('MIT') },
        { type: 'confirm', name: 'moveon', message: 'Continue?' }
    ],
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.nameDashed = _.kebabCase(answers.name);
            var inject = [__dirname + '/template/client/**', '!' + __dirname + '/template/client/build/**'];
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

gulp.task('client-controller', function (done) {
    var args = this.args;
    if (!this.args[0] || !this.args[1]) {
        console.log('###################################################################################'.yellow);
        console.log('######   Incorrect usage                                                     ######'.yellow);
        console.log('######   Try slush appkit:client-controller <moduleName> <controllerName>  ######'.yellow);
        console.log('######   Example: `slush appkit:client-controller user list`                 ######'.yellow);
        console.log('###################################################################################'.yellow);
        return done();
    }
    inquirer.prompt([
        //{ type: 'input', name: 'module', message: 'What is the module?', default: gulp.args.join(' ') },
        //{ type: 'input', name: 'name', message: 'What is the name of controller?', default: gulp.args.join(' ') },
        { type: 'confirm', name: 'moveon', message: 'Continue?' }
    ],
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.moduleName = args[0];
            answers.controllerName = args[1];
            
            var inject = [__dirname + '/template/angular/controller.js'];
            gulp.src(inject) // Note use of __dirname to be relative to generator              
                .pipe(template(answers))                 // Lodash template support

                .pipe(conflict('./client/src/app/modules/' + answers.moduleName))                    // Confirms overwrites on file conflicts
                .pipe(rename(answers.controllerName + '.controller.js'))
                .pipe(gulp.dest('./client/src/app/modules/' + answers.moduleName))                   // Without __dirname here = relative to cwd
                .pipe(install())                         // Run `bower install` and/or `npm install` if necessary
                .on('end', function () {
                    done();                              // Finished!
                })
                .resume();
        });
});