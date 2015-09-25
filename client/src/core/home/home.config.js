'use strict';
/*global window*/
angular.module('core.home').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider) {
    /**
     * States & Routes
     */
    $stateProvider.state('app.home', {
        url: '/',
        views: {
            'content': {
                templateUrl: 'core/home/home.tpl.html',
                controller: '$HomeCtrl as vm'
            }
        },
        resolve: {
            //
            // @todo factory
            //
            closeMenu: /*@ngInject*/ function($timeout, $auth, $menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        $menu.api().close();
                    }, 500)
                }
            }
        }
    });
    $locationProvider.html5Mode(true);
})