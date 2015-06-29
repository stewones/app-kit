'use strict';
angular.module('utils.module').directive('focus', /*@ngInject*/ function() {
    return {
        scope: {
            focus: '=',
            focusWhen: '='
        },
        restrict: 'A',
        link: function(scope, elem) {
            scope.$watch('focusWhen', function(nv, ov) {
                if (nv != ov) {
                    if (nv) {
                        elem.focus();
                    }
                }
            });
            if (scope.focus)
                elem.focus();
        }
    }
})