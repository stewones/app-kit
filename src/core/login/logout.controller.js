'use strict';
/**
 * @ngdoc object
 * @name login.module.controller:$LogoutCtrl
 * @description 
 * Destruir sessão
 * @requires login.module.$user
 **/
angular.module('login.module').controller('$LogoutCtrl', /*@ngInject*/ function(user) {
    user.instance.destroy();
})