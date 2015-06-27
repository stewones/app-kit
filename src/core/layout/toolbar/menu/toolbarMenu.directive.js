'use strict';
angular.module('layout.module').directive('toolbarMenu', /*@ngInject*/ function toolbarMenu(Menu) {
    return {
        templateUrl: "core/layout/toolbar/menu/toolbarMenu.tpl.html",
        scope: {
            company: '='
        },
        controller: 'ToolbarMenuCtrl',
        controllerAs: 'vm',
        link: function(scope) {
            scope.menu = Menu.toolbar;
        }
    }
})