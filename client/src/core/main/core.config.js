'use strict';
angular.module('core.app').config( /*@ngInject*/ function($appProvider, $pageProvider, $logProvider, $urlMatcherFactoryProvider, $stateProvider, $urlRouterProvider, $locationProvider, $mdThemingProvider, $authProvider, $httpProvider, $loginProvider, $userProvider, $sessionStorageProvider, $translateProvider, enviroment, setting, api) {
    //
    // States & Routes
    //    
    $stateProvider.state('app', {
        abstract: true,
        views: {
            'app': {
                templateUrl: /*@ngInject*/ function() {
                    return $appProvider.layoutUrl();
                }
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
        },
        resolve: {
            company: function($rootScope, $location, $http, $page, setting, api) {
                if (setting.resolveCompany) {
                    $page.load.init();
                    var baseUrl = $location.host().replace('www.', '');
                    $http.post(api.url + '/api/companies/land', {
                        ref: baseUrl
                    }).then(function(response) {
                        $page.load.done();
                        $rootScope.$emit('$CompanyResolved', response);
                    }, function(response) {
                        $page.load.done();
                        $rootScope.$emit('$CompanyResolved', false, response);
                    });
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
        //
        // if the app was not loaded inside iframe (url with #iframe)
        //
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
    // User options
    //
    $userProvider.setting('roleForCompany', 'user');
    $userProvider.setting('loginSuccessRedirect', '/');
    $userProvider.setting('loginSuccessRedirectState', 'app.home');
    //
    // Auth options
    //
    $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
    $authProvider.loginOnSignup = true;
    $authProvider.loginRedirect = '/';
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
    //$authProvider.storageType = 'sessionStorage';
    //
    // Storage options
    //
    $sessionStorageProvider.setKeyPrefix(setting.slug + '.');
    //
    // i18n options
    //
    $translateProvider.preferredLanguage(setting.locale);
    $translateProvider.useSanitizeValueStrategy('escape');
    //
    // Debug options
    //
    if (enviroment === 'production') $logProvider.debugEnabled(false);
    else $logProvider.debugEnabled(true);
});