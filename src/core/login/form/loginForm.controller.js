'use strict';
angular.module('login.module').controller('LoginFormCtrl', /*@ngInject*/ function($scope, $auth, $mdToast, user) {
    var vm = this;
    vm.login = login;

    function login(logon) {
        $page.load.init();
        var onSuccess = function(result) {
            $page.load.done();
            user.instance.init(result.data.user, true);
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.message ? result.data.message : 'server away').position('bottom right').hideDelay(3000))
        }
        $auth.login({
            email: logon.email,
            password: logon.password,
            applicant: true
        }).then(onSuccess, onError);
    }
})