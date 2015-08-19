'use strict';
angular.module('core.list').directive('listFilterBox', /*@ngInject*/ function() {
    return {
        scope: {},
        controller: 'ListFilterBoxCtrl',
        controllerAs: 'vm',
        bindToController: {
            listFilters: '=',
            listBrStates: '='
        },
        templateUrl: 'core/list/filter-box/listFilterBox.tpl.html'
    };
});