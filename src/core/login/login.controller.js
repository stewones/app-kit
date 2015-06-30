'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LoginCtrl
 * @requires core.login.$loginProvider
 * @requires page.module.factory:$page
 * @requires setting
 * @requires api
 **/
'use strict';
angular.module('core.login').controller('$LoginCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $location, $login, $page, setting, api) {
    $page.title(setting.name + setting.titleSeparator + 'Login');
    $page.description('Entre para o ' + setting.name);
    $page.load.done();
    var vm = this;
    vm.config = $login.config;
})