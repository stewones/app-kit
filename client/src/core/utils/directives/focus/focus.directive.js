'use strict';
angular.module('core.utils').directive('focus', /*@ngInject*/ function() {
    return {
        scope: {
            focus: '=',
            focusWhen: '='
        },
        restrict: 'A',
        link: function(scope, elem) {
            elem.focus();
            scope.$watch('focusWhen', function(nv, ov) {
                if (nv && nv != ov) {
                    elem.focus();
                }
            });
            // if (scope.focus)
            //     elem.focus();
        }
    }
})