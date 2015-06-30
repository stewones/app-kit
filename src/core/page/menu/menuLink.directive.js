'use strict';
angular.module('core.menu').directive('menuLink', /*@ngInject*/ function() {
    return {
        scope: {
            section: '='
        },
        controller: 'MenuLinkCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/layout/menu/menuLink.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isSelected = function() {
                return controller.menu.isSelected($scope.section);
            };
        }
    };
});