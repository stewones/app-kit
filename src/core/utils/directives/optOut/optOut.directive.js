'use strict';
angular.module('core.utils').directive('optOut', /*@ngInject*/ function() {
    return {
        scope: {
            putLocation: '=',
            putParams: '=',
            putLabel: '=',
            alertTitle: '=',
            alertInfo: '=',
            alertOk: '=',
            alertCancel: '=',
            itemId: '=',
            itemImage: '=',
            itemTitle: '=',
            itemTitleTooltip: '=',
            itemLocation: '=',
            itemInfo: '='
        },
        templateUrl: 'core/utils/directives/optOut/optOut.tpl.html',
        controller: 'OptOutCtrl',
        controllerAs: 'vm',
        replace: true
    }
})