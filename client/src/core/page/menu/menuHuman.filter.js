'use strict';
angular.module('core.menu').filter('menuHuman', /*@ngInject*/ function menuHuman() {
    return function(doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
            return doc.name.replace(/([A-Z])/g, function($1) {
                return '-' + $1.toLowerCase();
            });
        }
        return doc.label || doc.name;
    }
})