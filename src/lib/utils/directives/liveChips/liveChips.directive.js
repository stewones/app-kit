'use strict';
angular.module('app.utils').directive('liveChips', /*@ngInject*/ function() {
    return {
        scope: {
            items: '=',
            placeholder: '@',
            model: '=',
            hideOptions: '=',
            truncateInput: '=',
            truncateOptions: '='
        },
        controller: 'LiveChipsCtrl',
        controllerAs: 'vm',
        templateUrl: 'lib/utils/directives/liveChips/liveChips.tpl.html',

    }
});