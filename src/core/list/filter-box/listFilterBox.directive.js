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
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/list/filter-box/listFilterBox.tpl.html';
        }
    };
});