'use strict';
angular.module('core.utils').directive('angularChartsEvent', /*@ngInject*/ function($timeout) {
    return {
        restrict: 'EA',
        link: /*@ngInject*/ function($scope) {
            $timeout(function() {
                $scope.$emit('reset');
            }, 5000)
        }
    }
});