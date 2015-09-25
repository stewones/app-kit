'use strict';
angular.module('google.login').directive('googleLogin', /*@ngInject*/ function() {
    return {
        templateUrl: "core/login/google/googleLogin.tpl.html",
        controller: 'GoogleLoginCtrl',
        controllerAs: 'google'
    }
})