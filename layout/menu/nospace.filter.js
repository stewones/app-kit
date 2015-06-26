'use strict';
angular.module('menu.module').filter('nospace', /*@ngInject*/ function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '');
    }
});