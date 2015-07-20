'use strict';
angular.module('core.utils').controller('ToolbarAvatarCtrl', /*@ngInject*/ function($user) {
    var vm = this;
    vm.logout = logout;

    function logout() {
        $user.instance().destroy();
    }
})