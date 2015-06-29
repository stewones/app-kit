'use strict';
/**
 * @ngdoc object
 * @name login.module.controller:$LoginCtrl
 * @description 
 * Responsável pelos comportamentos básicos de login na aplicação
 * @requires login.module.$loginProvider
 * @requires page.module.$page
 * @requires setting
 * @requires api
 **/
'use strict';
angular.module('login.module').controller('$LoginCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $location, $login, $page, setting, api) {
    $page.title(setting.name + setting.titleSeparator + 'Login');
    $page.description('Entre para o ' + setting.name);
    $page.banner = false;
    $page.load.done();
    var vm = this;
    vm.lost = lost;
    vm.change = change;
    vm.auth = auth;
    vm.config = $login.config;
    //lost password step2
    var userHash = $location.hash();
    if (userHash) vm.userHash = userHash;

    function auth(provider) {
        $auth.authenticate(provider);
    }

    function change(pw) {
        $page.load.init();
        var onSuccess = function(data) {
            $page.load.done();
            $state.transitionTo('app.login');
            $mdToast.show($mdToast.simple().content(data.success).position('bottom right').hideDelay(3000))
        }
        var onError = function(data) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(data.error).position('bottom right').hideDelay(3000))
        }
        $http.put(api.url + "/api/users/" + userHash + '/newPassword', {
            password: pw
        }).success(onSuccess).error(onError);
    }

    function lost(email) {
        $page.load.init();
        var onSuccess = function(data) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(data.success).position('bottom right').hideDelay(3000))
        }
        var onError = function(data) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(data.error).position('bottom right').hideDelay(3000))
        }
        $http.post(api.url + "/api/users/lost", {
            email: email
        }).success(onSuccess).error(onError);
    }
})