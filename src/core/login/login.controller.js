'use strict';
/**
 * @ngdoc object
 * @name login.module.controller:$LoginCtrl
 * @description 
 * Responsável pelos comportamentos básicos de login na aplicação
 * @requires login.module.$loginProvider
 * @requires layout.module.layout
 * @requires setting
 * @requires api
 **/
'use strict';
angular.module('login.module').controller('$LoginCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $location, $login, layout, setting, api) {
    layout.setTitle(setting.name + setting.titleSeparator + 'Login');
    layout.setDescription('Entre para o ' + setting.name);
    layout.banner = false;
    layout.load.done();
    var vm = this;
    vm.lost = lost;
    vm.change = change;
    vm.auth = auth;
    vm.config = $login.config;
    vm.ChildController = $login.controller ? $login.controller : function() {};
    //lost password step2
    var userHash = $location.hash();
    if (userHash) vm.userHash = userHash;

    function auth(provider) {
        $auth.authenticate(provider);
    }

    function change(pw) {
        layout.load.init();
        var onSuccess = function(data) {
            layout.load.done();
            $state.transitionTo('app.login');
            $mdToast.show($mdToast.simple().content(data.success).position('bottom right').hideDelay(3000))
        }
        var onError = function(data) {
            layout.load.done();
            $mdToast.show($mdToast.simple().content(data.error).position('bottom right').hideDelay(3000))
        }
        $http.put(api.url + "/api/users/" + userHash + '/newPassword', {
            password: pw
        }).success(onSuccess).error(onError);
    }

    function lost(email) {
        layout.load.init();
        var onSuccess = function(data) {
            layout.load.done();
            $mdToast.show($mdToast.simple().content(data.success).position('bottom right').hideDelay(3000))
        }
        var onError = function(data) {
            layout.load.done();
            $mdToast.show($mdToast.simple().content(data.error).position('bottom right').hideDelay(3000))
        }
        $http.post(api.url + "/api/users/lost", {
            email: email
        }).success(onSuccess).error(onError);
    }
})