'use strict';
angular.module('menu.module').directive('menuAvatar', /*@ngInject*/ function() {
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
        templateUrl: 'app/layout/menu/avatar/menuAvatar.tpl.html'
    }
});