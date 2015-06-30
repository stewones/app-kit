'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LoginFormCtrl
 * @description 
 * Controlador do componente
 * @requires $scope
 * @requires $auth
 * @requires $mdToast
 * @requires user.module.factory:$user
 **/
angular.module('core.login').controller('$LoginFormCtrl', /*@ngInject*/ function($scope, $auth, $page, $mdToast, user) {
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
        var onSuccess = function(result) {
            $page.load.done();
            user.instance.init(result.data.user, true);
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.message ? result.data.message : 'server away').position('bottom right').hideDelay(3000))
        }
        $auth.login({
            email: logon.email,
            password: logon.password
        }).then(onSuccess, onError);
    }
})