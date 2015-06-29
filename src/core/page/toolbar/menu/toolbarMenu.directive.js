'use strict';
angular.module('page.module').directive('toolbarMenu', /*@ngInject*/ function toolbarMenu(Menu) {
    return {
        templateUrl: "core/page/toolbar/menu/toolbarMenu.tpl.html",
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