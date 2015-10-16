'use strict';
/*global window*/
angular.module('core.home').config( /*@ngInject*/ function($pageProvider, $stateProvider, $urlRouterProvider, $locationProvider, $userProvider) {
    //$pageProvider.abstractRoute = false;
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
    }).state('app.home-secured', {
        url: '/home-secured/',
        views: {
            'content': {
                templateUrl: 'core/home/home-secured.tpl.html',
                controller: '$HomeCtrl as vm'
            }
        },
        resolve: {
            closeMenu: /*@ngInject*/ $pageProvider.closeMenu(),
            authed: /*@ngInject*/ $userProvider.isNotAuthed('/login/')
        }
    });
    $locationProvider.html5Mode(true);
})