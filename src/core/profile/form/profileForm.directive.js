'use strict';
angular.module('profile.module').directive('profileForm', /*@ngInject*/ function() {
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