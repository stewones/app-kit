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
                authed: /*@ngInject*/ function($auth, $location, $login) {
                    if ($auth.isAuthenticated()) {
                        $location.path($login.config.auth.loginSuccessRedirect);
                    }
                }
            }
        })
        //
        // bugfix #18 - usuario perdendo sessao
        // https://github.com/esgrupo/app-kit/issues/18
        //
        .state('app.login-session', {
            url: '/login-session/',
            views: {
                'content': {
                    templateUrl: /*@ngInject*/ function() {
                        return $loginProvider.templateUrl()
                    },
                    controller: '$LoginCtrl as vm'
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
                    templateUrl: /*@ngInject*/ function() {
                        return $loginProvider.signupTemplateUrl()
                    },
                    controller: /*@ngInject*/ function($page, setting) {
                        $page.title(setting.name + setting.titleSeparator + 'Cadastro');
                    }
                },
                resolve: {
                    authed: /*@ngInject*/ function($auth, $location, $login) {
                        if ($auth.isAuthenticated()) {
                            $location.path($login.config.auth.loginSuccessRedirect);
                        }
                    }
                }
            }
        }).state('app.login-lost', {
            protected: false,
            url: '/login/lost/',
            views: {
                'content': {
                    templateUrl: /*@ngInject*/ function() {
                        return $loginProvider.lostTemplateUrl()
                    },
                    controller: '$LostCtrl as vm'
                }
            },
            resolve: {
                authed: /*@ngInject*/ function($auth, $window, $login) {
                    if ($auth.isAuthenticated()) {
                        $window.location = $login.config.auth.loginSuccessRedirect //here we use $window to fix issue related with $location.hash (#) in url
                    }
                }
            }
        });
    $locationProvider.html5Mode(true);
})