'use strict';
/*global window*/
angular.module('core.page').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.page', {
        protected: false,
        url: '/',
        views: {
            'content': {
                templateUrl: 'core/page/page.tpl.html',
                controller: '$PageCtrl as vm'
            }
        },
        resolve: {
            closeMenu: /*@ngInject*/ function($timeout, $auth, $menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        $menu.api().close();
                    }, 500)
                }
            }
        }
    });
    //$urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);
})