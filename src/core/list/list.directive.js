'use strict';
angular.module('core.list').directive('list', /*@ngInject*/ function() {
    return {
        scope: {},
        controller: 'ListCtrl',
        controllerAs: 'vm',
        bindToController: {
            listSource: '=',
            listRoute: '@',
            listBrStates: '='
        },
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : "core/list/list.tpl.html";
        }
    };
});