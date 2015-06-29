'use strict';
angular.module('utils.module').directive('liveChips', /*@ngInject*/ function() {
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
        templateUrl: 'core/utils/directives/liveChips/liveChips.tpl.html',

    }
});