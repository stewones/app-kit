'use strict';
angular.module('core.utils').controller('ToolbarAvatarCtrl', /*@ngInject*/ function($location) {
    var vm = this;
    vm.logout = logout;

    function logout() {
        $location.path('/logout/');
    }
})