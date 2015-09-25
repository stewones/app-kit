'use strict';
angular.module('core.page').directive('toolbarMenu', /*@ngInject*/ function toolbarMenu($menu) {
    return {
        templateUrl: "core/page/toolbar/menu/toolbarMenu.tpl.html",
        scope: {
            company: '='
        },
        controller: 'ToolbarMenuCtrl',
        controllerAs: 'vm',
        link: function(scope) {
            scope.menu = $menu.toolbar;
        }
    }
})