'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LogoutCtrl
 * @description 
 * Destruir sessão
 * @requires core.login.$user
 **/
angular.module('core.login').controller('$LogoutCtrl', /*@ngInject*/ function($user) {
    $user.logout();
})