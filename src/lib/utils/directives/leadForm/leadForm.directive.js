'use strict';
angular.module('app.utils').directive('leadForm', /*@ngInject*/ function() {
    return {
        scope: {
            label: '@'
        },
        templateUrl: 'lib/utils/directives/leadForm/leadForm.tpl.html',
        controller: 'LeadFormCtrl',
        controllerAs: 'vm',
        replace: true
    }
})