'use strict';
/**
    * @ngdoc overview
    * @name core.login
    * @requires app.env
    * @requires app.setting
    * @requires satellizer
**/
angular.module('core.login', [
    'app.env',
    'app.setting',
    'core.user',
    'core.page',
    'ui.router',
    'satellizer',
    'google.login',
    'facebook.login'
]);