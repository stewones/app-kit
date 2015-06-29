'use strict';
//
// Usage:
// {{some_array | slice:start:end }}
//
angular.module('utils.module').filter('slice', /*@ngInject*/ function sliceFilter() {
    return function(arr, start, end) {
        return arr.slice(start, end);
    };
})