'use strict';
angular.module('core.list').directive('listLoadMore', /*@ngInject*/ function() {
    return {
        scope: {},
        controller: 'ListLoadMoreCtrl',
        controllerAs: 'vm',
        bindToController: {
            listFilters: '='
        },
        templateUrl: 'core/list/load-more/listLoadMore.tpl.html'
    };
});