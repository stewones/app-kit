'use strict';
angular.module('layout.module').directive('content', /*@ngInject*/ function() {
    return {
        scope: {
            app: '='
        },
        templateUrl: "lib/layout/content/content.tpl.html"
    }
})