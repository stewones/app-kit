'use strict';
angular.module('login.module').controller('LostCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $location, Login, $page, setting, api) {
    isAuthed();
    $page.title(setting.name + setting.titleSeparator + 'Mudar senha');
    $page.description('Entre para o ' + setting.name);
    $page.load.done();
    var vm = this;
    vm.lost = lost;
    vm.change = change;

    vm.config = Login.config;
    //lost password step2
    var userHash = $location.hash();
    if (userHash) vm.userHash = userHash;


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
    //
    // SECURED AREA
    //
    function isAuthed() {
        if ($auth.isAuthenticated()) {
            $state.go(Login.config.auth.loginSuccessStateRedirect);
        }
    }
})