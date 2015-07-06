'use strict';
angular.module('core.login').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider, $loginProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.login', {
        protected: false,
        url: '/login/',
        views: {
            'content': {
                templateUrl: /*@ngInject*/ function() {
                    return $loginProvider.templateUrl()
                },
                controller: '$LoginCtrl as vm'
            }
        },
        resolve: {
            authed: /*@ngInject*/ function($auth, $window, $login) {
                if ($auth.isAuthenticated()) {
                    $window.location($login.config.auth.loginSuccessRedirect);
                }
            }
        }
    }).state('app.logout', {
        protected: false,
        url: '/logout/',
        views: {
            'content': {
                controller: '$LogoutCtrl as vm'
            }
        }
    }).state('app.signup', {
        protected: false,
        url: '/signup/',
        views: {
            'content': {
                templateUrl: 'core/login/register/register.tpl.html',
                controller: /*@ngInject*/ function($page, setting) {
                    $page.title(setting.name + setting.titleSeparator + 'Cadastro');
                }
            },
            resolve: {
                authed: /*@ngInject*/ function($auth, $window, $login) {
                    if ($auth.isAuthenticated()) {
                        $window.location($login.config.auth.loginSuccessRedirect);
                    }
                }
            }
        }
    }).state('app.login-lost', {
        protected: false,
        url: '/login/lost/',
        views: {
            'content': {
                templateUrl: 'core/login/register/lost.tpl.html',
                controller: '$LostCtrl as vm'
            }
        },
        resolve: {
            authed: /*@ngInject*/ function($auth, $window, $login) {
                if ($auth.isAuthenticated()) {
                    $window.location = $login.config.auth.loginSuccessRedirect
                }
            }
        }
    });
    $locationProvider.html5Mode(true);
})