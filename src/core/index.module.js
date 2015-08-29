'use strict';
var window = window ? window : {};
if (window && window.length !== undefined) {
    /**
     * @ngdoc overview
     * @name app.kit
     * @description
     * Kit para criação de aplicações frontend com angular 1.x <br />
     * Serviços dos módulos com namespace "core" são identificados pelo prefixo $
     **/
    angular.module('app.kit', ['ngMaterial',
    						   'ngAnimate',
    						   'ngTouch',
    						   'ngSanitize',
    						   'angulartics',
    						   'angulartics.google.analytics',
    						   'ui.router',
    						   'core.app']);
}
//
// Node.js
//
else {
    var Commission = require('utils/services/commission/commission');
    module.exports = Commission;
}