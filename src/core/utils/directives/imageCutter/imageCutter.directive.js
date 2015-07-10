'use strict';
angular.module('core.utils').directive('imageCutter', /*@ngInject*/ function($mdDialog) {
    return {
        scope: {
            endpointUrl: '@',
            endpointParams: '=',
            endpointSuccess: '=',
            endpointFail: '=',
            cutOnModal: '@',
            cutOnModalTitle: '@',
            cutWidth: '@',
            cutHeight: '@',
            cutShape: '@',
            cutLabel: '@',
            cutResult: '=',
            cutStep: '='
        },
        replace: true,
        transclude: true,
        restrict: 'EA',
        templateUrl: 'core/utils/directives/imageCutter/imageCutter.tpl.html',
        link: function($scope) {
            $scope.modal = modal;
            $scope.hide = hide;

            function modal(ev) {
                $mdDialog.show({
                    templateUrl: 'core/utils/directives/imageCutter/modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    scope: $scope, // use parent scope in template
                    preserveScope: true
                });
            }

            function hide() {
                $mdDialog.hide();
            }
        }
    }
});