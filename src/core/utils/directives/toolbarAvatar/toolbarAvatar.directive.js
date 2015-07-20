'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:toolbarAvatar
 * @restrict EA
 * @description 
 * Avatar com menu para o md-toolbar
 * @element a
 * @param {string} firstName primeiro nome
 * @param {string} email email 
 * @param {string} facebook id do facebook
 * @param {array} menu lista de itens do menu
 **/
angular.module('core.utils').directive('toolbarAvatar', /*@ngInject*/ function() {
    return {
        scope: {
            firstName: '@',
            email: '@',
            facebook: '@',
            menu: '='
        },
        replace: true,
        //transclude: true,
        restrict: 'EA',
        templateUrl: 'core/utils/directives/toolbarAvatar/toolbarAvatar.tpl.html',
        controller: 'ToolbarAvatarCtrl',
        controllerAs: 'vm'
    }
});