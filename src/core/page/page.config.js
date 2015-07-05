'use strict';
/*global window*/
angular.module('core.page').config( /*@ngInject*/ function($stateProvider, $pageProvider, $urlRouterProvider, $locationProvider) {
    //
    // States & Routes
    //
    console.log($pageProvider.config('page-home'))
        console.log('2')
    $stateProvider.state('app.page', {
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
    $locationProvider.html5Mode(true);
})