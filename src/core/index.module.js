'use strict';
/**
 * @ngdoc overview
 * @name app.kit
 * @description
 * Kit para criação de aplicações frontend com angular 1.x <br />
 * Serviços dos módulos com namespace "core" são identificados pelo prefixo $
 **/
angular.module('app.kit', [
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'angulartics',
    'angulartics.google.analytics',
    'ui.router',
    'core.app'
]);