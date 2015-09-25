'use strict';
angular.module('core.menu').filter('nospace', /*@ngInject*/ function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '');
    }
});