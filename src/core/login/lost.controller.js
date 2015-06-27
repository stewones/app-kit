'use strict';
angular.module('login.module').controller('LostCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $location, Login, layout, setting, api) {
    isAuthed();
    layout.setTitle(setting.name + setting.titleSeparator + 'Mudar senha');
    layout.setDescription('Entre para o ' + setting.name);
    layout.load.done();
    var vm = this;
    vm.lost = lost;
    vm.change = change;

    vm.config = Login.config;
    //lost password step2
    var userHash = $location.hash();
    if (userHash) vm.userHash = userHash;


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
    //
    // SECURED AREA
    //
    function isAuthed() {
        if ($auth.isAuthenticated()) {
            $state.go(Login.config.auth.loginSuccessStateRedirect);
        }
    }
})