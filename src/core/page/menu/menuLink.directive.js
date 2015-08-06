'use strict';
angular.module('core.menu').directive('menuLink', /*@ngInject*/ function() {
    return {
        scope: {
            section: '='
        },
        controller: 'MenuLinkCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/page/menu/menuLink.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isSelected = function() {
                return controller.menu ? controller.menu.isSelected($scope.section):'';
            };
        }
    };
});