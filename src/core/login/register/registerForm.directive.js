'use strict';
angular.module('login.module').directive('registerForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '='
        },
        templateUrl: "core/login/register/registerForm.tpl.html",
        controller: 'RegisterFormCtrl',
        controlerAs: 'vm'
    }
})