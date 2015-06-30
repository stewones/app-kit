'use strict';
/**
 * @ngdoc overview
 * @name app.kit
 * @description
 * Kit para criação de aplicações frontend com angular 1.x
 * Serviços dos módulos com namespace "core" são identificados pelo prefixo $
 **/
angular.module('app.kit', [
    'app.setting',
    'app.env',
    'core.utils',
    'ui.router',
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'angulartics',
    'angulartics.google.analytics',
    'core.page',
    'core.login',
    'core.user',
    'core.profile',
    'core.account'
]);