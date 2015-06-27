'use strict';
angular.module('facebook.login').directive('facebookLogin', /*@ngInject*/ function() {
    return {
        templateUrl: "lib/login/facebook/facebookLogin.tpl.html",
        scope: {
            user: '='
        },
        controller: 'FacebookLoginCtrl',
        controllerAs: 'fb'
    }
})