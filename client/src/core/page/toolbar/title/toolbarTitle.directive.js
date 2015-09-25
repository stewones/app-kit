'use strict';
angular.module('core.page').directive('toolbarTitle', /*@ngInject*/ function($app) {
    return {
        templateUrl: function() {
            return $app.toolbarTitleUrl;
        }
    }
});