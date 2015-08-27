'use strict';
angular.module('core.utils').directive('leadForm', /*@ngInject*/ function() {
    return {
        scope: {
            label: '@',
            dont: '=',
            templateUrl: '='
        },
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/utils/directives/leadForm/leadForm.tpl.html';
        },
        controller: 'LeadFormCtrl',
        controllerAs: 'vm',
        replace: true
    }
})