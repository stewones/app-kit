'use strict';
angular.module('account.module').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider, MenuProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.account', {
        protected: true,
        url: '/account/',
        views: {
            'content': {
                templateUrl: 'app/account/account.tpl.html',
                controller: 'AccountCtrl as vm'
            }
        },
        resolve: {
            authed: /*@ngInject*/ function($auth, $location) {
                if (!$auth.isAuthenticated()) {
                    $location.path('/login/');
                } else {
                    return true;
                }
            },
            closeMenu: /*@ngInject*/ function($timeout, $auth, menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        menu.api().close();
                    }, 500)
                }
            }
        }
    });
    //$urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);
    //
    // Set Menu
    //
    MenuProvider.set({
        name: 'Conta',
        type: 'link',
        icon: 'fa fa-at',
        url: '/account/',
        state: 'app.account'
    });
    //
    // Set Toolbar Menu
    //
    // MenuProvider.setToolbarMenu({
    //     id: 'filtros',
    //     name: 'Filtros',
    //     type: 'action',
    //     icon: 'fa fa-sliders'
    // });
});