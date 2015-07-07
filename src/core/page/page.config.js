'use strict';
/*global window*/
angular.module('core.page').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider) {
    /**
     * States & Routes (@todo - é preciso dar replace nesta config pelas apps filhas)
     */
    // $stateProvider.state('app.pages', {
    //     protected: false,
    //     url: '/p/:slug/',
    //     views: {
    //         'content': {
    //             templateUrl: 'core/page/page.tpl.html',
    //             controller: '$PageCtrl as vm'
    //         }
    //     },
    //     resolve: {
    //         slug: /*@ngInject*/ function($stateParams) {
    //             return $stateParams.slug;
    //         },
    //         closeMenu: /*@ngInject*/ function($timeout, $auth, $menu) {
    //             if ($auth.isAuthenticated()) {
    //                 $timeout(function() {
    //                     $menu.api().close();
    //                 }, 500)
    //             }
    //         }
    //     }
    // });
    // $locationProvider.html5Mode(true);
})