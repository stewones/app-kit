'use strict';
/**
 * @ngdoc directive
 * @name login.module.directive:login
 * @restrict EA
 * @description 
 * Diretiva "wrapper" pro template de login
 * @element div
 **/
angular.module('login.module').directive('login', /*@ngInject*/ function() {
    return {
        scope: {},
        templateUrl: 'core/login/login.tpl.html',
        controller: '$LoginCtrl',
        controllerAs: 'vm',
        restrict: 'EA'
    }
});