'use strict';
angular.module('core.login').directive('registerForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '='
        },
        templateUrl: "core/login/register/registerForm.tpl.html",
        controller: 'RegisterFormCtrl',
        controlerAs: 'vm'
    }
})