'use strict';
angular.module('core.profile').directive('profileForm', /*@ngInject*/ function() {
    return {
        scope: {
            company: '=',
        },
        restrict: "E",
        controller: 'ProfileFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/profile/form/profileForm.tpl.html',
    }
})