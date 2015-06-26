'use strict';
angular.module('menu.module').directive('menuLink', /*@ngInject*/ function() {
    return {
        scope: {
            section: '='
        },
        controller: 'MenuLinkCtrl',
        controllerAs: 'vm',
        templateUrl: 'app/layout/menu/menuLink.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isSelected = function() {
                return controller.menu.isSelected($scope.section);
            };
        }
    };
});