'use strict';

angular.module('login.module', [
    'app.env',
    'app.setting',
    'ui.router',
    'satellizer',
    'google.login',
    'facebook.login'
]).run( /*@ngInject*/ function (CoreLogin, $rootScope) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams) {	
        if (CoreLogin.config.templateUrl && toState.name === 'app.login') {
         	toState.views.content.templateUrl = CoreLogin.config.templateUrl;
        }
    });
});