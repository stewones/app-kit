'use strict';
angular.module('layout.module').directive('content', /*@ngInject*/ function() {
    return {
        scope: {
            app: '='
        },
        templateUrl: "core/layout/content/content.tpl.html"
    }
})