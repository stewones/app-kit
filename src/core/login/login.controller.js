'use strict';
/**
 * @ngdoc object
 * @name login.module.controller:$LoginCtrl
 * @requires login.module.$loginProvider
 * @requires page.module.factory:$page
 * @requires setting
 * @requires api
 **/
'use strict';
angular.module('login.module').controller('$LoginCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $location, $login, $page, setting, api) {
    $page.title(setting.name + setting.titleSeparator + 'Login');
    $page.description('Entre para o ' + setting.name);
    $page.load.done();
    var vm = this;
    vm.config = $login.config;
})