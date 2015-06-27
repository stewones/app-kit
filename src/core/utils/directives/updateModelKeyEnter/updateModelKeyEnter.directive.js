'use strict';
angular.module('app.utils').directive('updateModelKeyEnter', /*@ngInject*/ function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelCtrl) {
            elem.bind("keyup", function(e) {
                if (e.keyCode === 13) {
                    ngModelCtrl.$commitViewValue();
                }
            });
        }
    }
})