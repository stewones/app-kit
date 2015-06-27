'use strict';
angular.module('login.module').controller('LogoutCtrl', /*@ngInject*/ function(user) {
    user.instance.destroy();
})