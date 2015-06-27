'use strict';
angular.module('login.module').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.login', {
        // parent: 'app',
        protected: false,
        url: '/login/',
        views: {
            'content': {
                templateUrl: 'core/login/login.tpl.html',
                controller: 'LoginCtrl as vm'
            }
        }
    }).state('app.logout', {
        // parent: 'app',
        protected: false,
        url: '/logout/',
        views: {
            'content': {
                controller: 'LogoutCtrl as vm'
            }
        }
    })
        .state('app.signup', {
            // parent: 'app',
            protected: false,
            url: '/signup/',
            views: {
                'content': {
                    templateUrl: 'core/login/register/register.tpl.html',
                    controller: /*@ngInject*/ function(layout, setting) {
                        layout.setTitle(setting.name + setting.titleSeparator + 'Cadastro');
                    }
                }
            }
        }).state('app.login-lost', {
            // parent: 'app',
            url: '/login/lost/',
            views: {
                'content': {
                    templateUrl: 'core/login/register/lost.tpl.html',
                    controller: 'LostCtrl as vm'
                }
            }
        });
    //$urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);
})