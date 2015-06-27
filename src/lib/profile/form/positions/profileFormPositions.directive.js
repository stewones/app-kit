'use strict';
angular.module('profile.module').directive('profileFormPositions', /*@ngInject*/ function() {
    return {
        scope: {
            options: '=',
            selected: '=',
        },
        templateUrl: "app/profile/form/positions/profileFormPositions.tpl.html",
        controller: 'ProfileFormPositionsCtrl',
        controllerAs: 'vm'
    }
})