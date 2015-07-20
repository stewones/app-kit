'use strict';
angular.module('core.utils').controller('ToolbarAvatarCtrl', /*@ngInject*/ function($location, $timeout) {
    var vm = this;
    vm.logout = logout;

    function logout() {
        $timeout(function() {
            $location.path('/logout/');
        }, 1200);
    }
})