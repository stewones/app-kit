'use strict';
angular.module('core.profile').directive('profile', /*@ngInject*/ function() {
    return {
        templateUrl: "core/profile/profile.tpl.html",
        controller: '$ProfileCtrl',
        controllerAs: 'vm'
    }
})