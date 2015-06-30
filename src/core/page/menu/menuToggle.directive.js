'use strict';
angular.module('core.menu').directive('menuToggle', /*@ngInject*/ function() {
    return {
        scope: {
            section: '='
        },
        templateUrl: 'core/layout/menu/menuToggle.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isOpen = function() {
                return controller.menu.isOpen($scope.section);
            };
            $scope.toggle = function() {
                controller.menu.toggleOpen($scope.section);
            };
            var parentNode = $element[0].parentNode.parentNode.parentNode;
            if (parentNode.classList.contains('parent-list-item')) {
                var heading = parentNode.querySelector('h2');
                $element[0].firstChild.setAttribute('aria-describedby', heading.id);
            }
        }
    }
});