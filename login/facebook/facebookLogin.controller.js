'use strict';
angular.module('facebook.login').controller('FacebookLoginCtrl', /*@ngInject*/ function(fbLogin) {
    var vm = this;
    vm.login = login;

    function login() {
        fbLogin.go();
    }
})