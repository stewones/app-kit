'use strict';
angular.module('login.module').directive('loginForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '=',
            user: '='
        },
        templateUrl: "core/login/form/loginForm.tpl.html",
        controller: 'LoginFormCtrl',
        controllerAs: 'vm',
        link: function() {}
    }
});