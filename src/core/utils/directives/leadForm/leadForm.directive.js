'use strict';
angular.module('core.utils').directive('leadForm', /*@ngInject*/ function() {
    return {
        scope: {
            label: '@',
            dont: '=',
            templateUrl: '='
        },
        templateUrl: /*@ngInject*/ function($elem, $scope) {
            return $scope.templateUrl ? $scope.templateUrl : 'core/utils/directives/leadForm/leadForm.tpl.html';
        },
        controller: 'LeadFormCtrl',
        controllerAs: 'vm',
        replace: true
    }
})