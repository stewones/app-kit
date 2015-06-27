'use strict';
angular.module('account.module').directive('optOut', /*@ngInject*/ function() {
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
        templateUrl: 'core/account/optOut/optOut.tpl.html',
        controller: 'OptOutCtrl',
        controllerAs: 'vm',
        replace: true
    }
})