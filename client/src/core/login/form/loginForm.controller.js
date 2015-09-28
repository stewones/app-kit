'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LoginFormCtrl
 * @description 
 * Controlador do componente
 * @requires $scope
 * @requires $auth
 * @requires $mdToast
 * @requires core.user.factory:$user
 **/
angular.module('core.login').controller('$LoginFormCtrl', /*@ngInject*/ function($rootScope, $scope, $auth, $page, $mdToast, $user) {
    var vm = this;
    vm.login = login;
    /**
     * @ngdoc function
     * @name core.login.controller:$LoginFormCtrl#login
     * @propertyOf core.login.controller:$LoginFormCtrl
     * @description 
     * Controlador do componente de login
     * @param {string} logon objeto contendo as credenciais email e password
     **/
    function login(logon) {
        $page.load.init();
        var onSuccess = function(response) {
            $page.load.done();
            $user.instantiate(response.data.user, true, false, function() {
                $rootScope.$emit('$LoginSuccess', response.data);
            });
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'error').position('bottom right').hideDelay(3000))
        }
        $auth.login({
            email: logon.email,
            password: logon.password
        }).then(onSuccess, onError);
    }
})