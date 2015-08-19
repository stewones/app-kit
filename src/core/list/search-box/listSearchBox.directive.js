'use strict';
angular.module('core.list').directive('listSearchBox', /*@ngInject*/ function() {
    return {
        scope: {},
        controller: 'ListSearchBoxCtrl',
        controllerAs: 'vm',
        bindToController: {
            listFilters: '='
        },
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/list/search-box/listSearchBox.tpl.html';
        }
    };
});