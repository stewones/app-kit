'use strict';
angular.module('core.list').directive('listLoadMore', /*@ngInject*/ function() {
    return {
        scope: {},
        controller: 'ListLoadMoreCtrl',
        controllerAs: 'vm',
        bindToController: {
            listFilters: '='
        },
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/list/load-more/listLoadMore.tpl.html';
        }
    };
});