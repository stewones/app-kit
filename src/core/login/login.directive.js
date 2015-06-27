'use strict';
angular.module('login.module').directive('login', /*@ngInject*/ function() {
    return {
        scope: {},
        templateUrl: 'core/login/login.tpl.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm'
    }
});