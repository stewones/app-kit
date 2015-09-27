'use strict';
angular.module('core.login').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider, $loginProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.login', {
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
                authed: isAuthed
            }
        })
        //
        // same as login, just to force that session was been lost
        //
        .state('app.login-lost-session', {
            url: '/login/lost/session/',
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
                    authed: isAuthed
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
                authed: isAuthed
            }
        });
    $locationProvider.html5Mode(true);
});

function isAuthed($auth, $state, $timeout, $user, $location) {
    if ($auth.isAuthenticated()) {
        $timeout(function() {
            //$state.go($user.setting.loginSuccessRedirect);
            $location.path($user.setting.loginSuccessRedirect);
        });
        return true;
    } else {
        return false;
    }
}