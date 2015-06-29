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
]).run( /*@ngInject*/ function ($login, $rootScope) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        if ($login.templateUrl && toState.name === 'app.login') {
         	toState.views.content.templateUrl = $login.templateUrl;
        }
    });
});