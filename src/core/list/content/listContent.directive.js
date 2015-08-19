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
        templateUrl: 'core/list/content/listContent.tpl.html'        
    };
});