'use strict';
angular.module('login.module').directive('registerForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '='
        },
        templateUrl: "app/login/register/registerForm.tpl.html",
        controller: 'RegisterFormCtrl',
        controlerAs: 'vm'
    }
})