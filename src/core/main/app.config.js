'use strict';
angular.module('app.kit').config( /*@ngInject*/ function($appProvider, $urlMatcherFactoryProvider, $stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $authProvider, $httpProvider, $loginProvider, UserSettingProvider, setting, api) {
    //
    // States & Routes
    //    
    $stateProvider.state('app', {
        abstract: true,
        views: {
            'app': {
                templateUrl: /*@ngInject*/ function() {
                    return $appProvider.layoutUrl();
                },
            },
            'toolbar@app': {
                templateUrl: /*@ngInject*/ function() {
                    return $appProvider.toolbarUrl();
                }
            },
            'sidenav@app': {
                templateUrl: /*@ngInject*/ function() {
                    return $appProvider.sidenavUrl();
                }
            }
        }
    });
    $locationProvider.html5Mode(true);
    //
    // Redirect Trailing Slash
    //
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.rule(function($injector, $location) {
        if ($location.hash() !== 'iframe') {
            var path = $location.url();
            // check to see if the path already has a slash where it should be
            if (path[path.length - 1] === '/' || path.indexOf('/?') > -1) {
                return;
            }
            if (path.indexOf('?') > -1) {
                return path.replace('?', '/?');
            }
            return path + '/';
        }
    });
    //
    // Intercept Http
    //
    $httpProvider.interceptors.push('HttpInterceptor');
    //
    // Theme options
    //
    $mdThemingProvider.theme('default').primaryPalette('indigo', {
        // 'hue-1': '600'
    }).accentPalette('deep-orange', {
        // 'hue-1': '600'
    });
    //
    // Dark theme
    //
    $mdThemingProvider.theme('darkness').primaryPalette('cyan').dark();
    //
    // Auth options
    //
    $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
    $authProvider.loginOnSignup = true;
    $authProvider.loginRedirect = '/profile/';
    $authProvider.logoutRedirect = '/login/';
    $authProvider.signupRedirect = '/login/';
    $authProvider.loginUrl = api.url + '/auth/local/';
    $authProvider.signupUrl = api.url + '/api/users/';
    $authProvider.loginRoute = '/login/';
    $authProvider.signupRoute = '/login/';
    $authProvider.tokenRoot = false; // set the token parent element if the token is not the JSON root
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = setting.slug + '.session'; // Local Storage name prefix
    $authProvider.unlinkUrl = '/auth/unlink/';
    $authProvider.unlinkMethod = 'get';
    $authProvider.authHeader = 'Authorization';
    $authProvider.withCredentials = true; // Send POST request with credentials
    //
    // Module Configs
    //
    $loginProvider.config('auth', {
        loginFailStateRedirect: 'app.login',
        loginSuccessStateRedirect: 'app.profile',
        loginSuccessRedirect: '/profile/'
    });
    UserSettingProvider.set('logoutStateRedirect', 'app.home');
    UserSettingProvider.set('roleForCompany', 'profile');
});