'use strict';
angular.module('profile.module').directive('profile', /*@ngInject*/ function() {
    return {
        templateUrl: "app/profile/profile.tpl.html",
        controller: 'ProfileCtrl',
        controllerAs: 'vm'
    }
})