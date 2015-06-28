'use strict';
angular.module('profile.module').directive('profile', /*@ngInject*/ function() {
    return {
        templateUrl: "core/profile/profile.tpl.html",
        controller: 'ProfileCtrl',
        controllerAs: 'vm'
    }
})