'use strict';
angular.module('menu.module').directive('menuFacepile', /*@ngInject*/ function() {
    return {
        templateUrl: "core/layout/menu/facepile/menuFacepile.tpl.html",
        scope: {
            width: '=',
            url: '@',
            facepile: '@',
            hideCover: '@'
        },
        //transclude: true,
        controller: 'MenuFacepileCtrl',
        controllerAs: 'vm',
        link: function(scope) {
            scope.$watch("url", function() {
                scope.loading = true;
                var interval = setInterval(function() {
                    if (window.FB) {
                        window.FB.XFBML.parse();
                        scope.loading = false;
                        clearInterval(interval);
                    }
                }, 2000);
            });
        }
    }
});