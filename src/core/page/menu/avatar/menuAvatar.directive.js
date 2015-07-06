'use strict';
angular.module('core.menu').directive('menuAvatar', /*@ngInject*/ function() {
    return {
        scope: {          
            firstName: '=',
            lastName: '=',
            facebook: '=',
            gender: '='
        },
        restrict: 'EA',
        controller: 'MenuAvatarCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/page/menu/avatar/menuAvatar.tpl.html'
    }
});