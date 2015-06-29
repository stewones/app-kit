'use strict';
angular.module('utils.module').directive('leadForm', /*@ngInject*/ function() {
    return {
        scope: {
            label: '@'
        },
        templateUrl: 'core/utils/directives/leadForm/leadForm.tpl.html',
        controller: 'LeadFormCtrl',
        controllerAs: 'vm',
        replace: true
    }
})