'use strict';
/**
 * @ngdoc directive
 * @name core.login.directive:login
 * @restrict EA
 * @description 
 * Diretiva "wrapper" pro template de login
 * @element div
 **/
angular.module('core.login').directive('login', /*@ngInject*/ function() {
    return {
        scope: {},
        templateUrl: 'core/login/login.tpl.html',
        controller: '$LoginCtrl',
        controllerAs: 'vm',
        restrict: 'EA'
    }
});