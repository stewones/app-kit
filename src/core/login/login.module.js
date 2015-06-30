'use strict';
/**
    * @ngdoc overview
    * @name login.module
    * @requires app.env
    * @requires app.setting
    * @requires satellizer
**/
angular.module('login.module', [
    'app.env',
    'app.setting',
    'ui.router',
    'satellizer',
    'google.login',
    'facebook.login'
]);