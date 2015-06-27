'use strict';
angular.module('facebook.login').directive('facebookLogin', /*@ngInject*/ function() {
    return {
        templateUrl: "core/login/facebook/facebookLogin.tpl.html",
        scope: {
            user: '='
        },
        controller: 'FacebookLoginCtrl',
        controllerAs: 'fb'
    }
})