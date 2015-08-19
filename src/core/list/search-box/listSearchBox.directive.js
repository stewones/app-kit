'use strict';
angular.module('core.list').directive('listSearchBox', /*@ngInject*/ function() {
    return {
        scope: {},
        controller: 'ListSearchBoxCtrl',
        controllerAs: 'vm',
        bindToController: {
            listFilters: '='
        },
        templateUrl: 'core/list/search-box/listSearchBox.tpl.html'
    };
});