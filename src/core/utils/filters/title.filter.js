'use strict';
//
// Usage:
// {{some_date | title }}
//
angular.module('utils.module').filter('title', /*@ngInject*/ function titleFilter() {
    return function(input) {
        input = input || '';
        return input.replace(/\w\S*/g, function(txt) {
            var whitelist = ['I', 'II'];
            if (txt.length > 2) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            } else {
                if (whitelist.indexOf(txt.toUpperCase()) >= 0) {
                    return txt.toUpperCase();
                } else {
                    return txt.toLowerCase();
                }
            }
        });
    }
})