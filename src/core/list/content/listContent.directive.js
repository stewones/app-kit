'use strict';
angular.module('core.list').directive('listContent', /*@ngInject*/ function() {
    return {
        scope: {},
        controller: 'ListContentCtrl',
        controllerAs: 'vm',
        bindToController: {
            listFilters: '=',
            listBrStates: '=',
            listEntries: '=',
            listSource: '=',
            listTotal: '=',
            listTotalDisplay: '=',
            listPage: '=',
            listLimit: '=',
            listLoadMoreBtn: '=',
        },
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/list/content/listContent.tpl.html';
        }
    };
});