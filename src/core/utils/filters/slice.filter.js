'use strict';
//
// Usage:
// {{some_array | slice:start:end }}
//
angular.module('core.utils').filter('slice', /*@ngInject*/ function sliceFilter() {
    return function(arr, start, end) {
        return arr.slice(start, end);
    };
})