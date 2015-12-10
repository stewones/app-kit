'use strict';
angular.module('core.home', ['core.user']);
'use strict';
/**
 * @ngdoc overview
 * @name core.app
 * @description
 **/
angular.module('core.app', [
    'app.setting',
    'app.env',
    'core.i18n',
    'core.utils',
    'core.home',
    'core.page',
    'core.login',
    'core.user'
]);
'use strict';
/**
    * @ngdoc overview
    * @name core.login
    * @requires app.env
    * @requires app.setting
    * @requires satellizer
**/
angular.module('core.login', [
    'app.env',
    'app.setting',
    'core.user',
    'core.page',
    'ui.router',
    'satellizer',
    'google.login',
    'facebook.login'
]);
'use strict';
angular.module('core.page', [
    'core.app',
    'core.menu',
    'ui.router',
    'angularMoment',
    'ngLodash',
    'ngAnimate',
    'ngMaterial',
    'ngSanitize',
    'anim-in-out',
    'ui.utils.masks',
    'directives.inputMatch'
]);
'use strict';
angular.module('core.user', [
  'ui.router',
  'satellizer',
  'app.setting',
  'app.env',
  'core.menu',
  'core.page'
]);

'use strict';
angular.module('core.utils', ['core.page', 'angularMoment', 'ImageCropper']);
'use strict';
angular.module('facebook.login', [
    'facebook',
    'app.env',
    'app.setting'
]);
'use strict';
angular.module('google.login', [
    'app.env',
    'app.setting',
    'directive.g+signin'
])
'use strict';
angular.module('core.menu', ['ui.router', 'truncate']);
'use strict';
/**
 * @ngdoc overview
 * @name app.kit
 * @description
 * Kit for quick start front/back applications based in MEAN stack
 **/
angular.module('app.kit', [
	//
	// Load 3rd party
	//
    'ngMaterial',
    'ngAnimate',
    'ngSanitize',
    'ngStorage',
    'angulartics',
    'angulartics.google.analytics',
    'pascalprecht.translate',
    'ui.router',
    //
    // Load core kit
    //
    'core.app'    
]);
'use strict';
/*global window*/
angular.module('core.home').config( /*@ngInject*/ function($pageProvider, $stateProvider, $urlRouterProvider, $locationProvider, $userProvider) {
    /**
     * States & Routes
     */
    $stateProvider.state('app.home', {
        url: '/',
        views: {
            'content': {
                templateUrl: 'core/home/home.tpl.html',
                controller: '$HomeCtrl as vm'
            }
        },
        resolve: {
            //
            // @todo factory
            //
            closeMenu: /*@ngInject*/ function($timeout, $auth, $menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        $menu.api().close();
                    }, 500)
                }
            }
        }
    }).state('app.home-secured', {
        url: '/home-secured/',
        views: {
            'content': {
                templateUrl: 'core/home/home-secured.tpl.html',
                controller: '$HomeCtrl as vm'
            }
        },
        resolve: {
            closeMenu: /*@ngInject*/ $pageProvider.closeMenu(),
            authed: /*@ngInject*/ $userProvider.isNotAuthed('/login/')
        }
    });
    $locationProvider.html5Mode(true);
})
'use strict';
angular.module('core.home').controller('$HomeCtrl', /*@ngInject*/ function($rootScope, $page, $translate, $user, $state, $app, setting) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.name + setting.titleSeparator + ' Home');
    bootstrap();
    function bootstrap() {
        if ($state.current.name === 'app.home-secured') {
            // $app.storage('session').set({
            //     locationRedirect: '/home-secured/'
            // });
           // $app.storage('session').destroy();
        }
    }
});
angular.module("app.env",[]).constant("enviroment","development").constant("base",{url:"http://localhost:3000",urlUnsecure:"http://localhost:3000"}).constant("api",{url:"http://localhost:9000"});
angular.module("app.setting",[]).constant("setting",{name:"app-kit",slug:"appkit",version:"1.0.0",title:"appkit",locale:"en_US",baseUrl:"https://app-kit.stpa.co",titleSeparator:" — ",description:"Skeleton for MEAN applications",keywords:"app kit js, mongodb, express, angular and node",icon:"",copyright:"",google:{clientId:"",language:"en-EN"},facebook:{scope:"email",appId:"1572873089619343",appSecret:"4f4ddc65318b2222773dc8ceda3e107d",language:"en-EN"},ogLocale:"en_EN",ogSiteName:"app-kit",ogTitle:"app-kit",ogDescription:"Skeleton for MEAN applications",ogUrl:"https://app-kit.stpa.co",ogImage:""});
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
'use strict';
/* global moment */
/**
 * @ngdoc object
 * @name app.kit.controller:$AppCtrl
 * @description
 * Controlador da aplicação
 * @requires setting
 * @requires environment
 * @requires $rootScope
 * @requires $scope
 * @requires $state
 * @requires $location
 * @requires $mdSidenav
 * @requires $timeout
 * @requires $auth
 * @requires core.page.factory:$page
 * @requires core.user.service:$User
 * @requires core.user.factory:$user
 * @requires core.login.$loginProvider
 * @requires core.page.factory:$menu
 **/
angular.module('core.app').controller('$AppCtrl', /*@ngInject*/ function(setting, $rootScope, $scope, $state, $location, $mdSidenav, $timeout, $auth, $page, $User, $user, enviroment, $menu, $login, $app, $sessionStorage) {
    var app = this;
    //
    // SEO (moved to consumer app in BodyCtrl)
    //
    // $page.title(setting.title);
    // $page.description(setting.description);
    // $page.keywords(setting.keywords);
    // $page.icon(setting.icon);
    //
    // OPEN GRAPH (moved to consumer app in BodyCtrl)
    //
    // $page.ogLocale(setting.ogLocale);
    // $page.ogSiteName(setting.ogSiteName);
    // $page.ogTitle(setting.ogTitle);
    // $page.ogDescription(setting.ogDescription);
    // $page.ogUrl(setting.ogUrl);
    // $page.ogImage(setting.ogImage);
    // $page.ogSection(setting.ogSection);
    // $page.ogTag(setting.ogTag);
    //
    // Moment
    //
    moment.locale(setting.locale);
    //
    // Events
    //  
    $rootScope.$on('$AppReboot', function() {
        bootstrap();
    });
    $rootScope.$on('$CompanyIdUpdated', function(e, nv, ov) {
        if (nv != ov) {
            //quando alterar company, atualizar factory  
            var company = $user.instance().filterCompany(nv);
            $user.instance().current('company', company);
            $user.instance().session('company', {
                _id: company._id,
                name: company.name
            });
            $menu.api().close();
            bootstrap();
        }
    });
    $rootScope.$on('$Unauthorized', function(ev, status) {
        //
        // Persists current location to execute redirection after login
        // - Only if server status is 401
        //
        if (status === 401) {
            $app.storage('session').set({
                locationRedirect: $location.url()
            });
        }
        $rootScope.$Unauthorized = true;
        $user.destroy(function() {
            return window.location.href = '/login/lost/session/';
        });
    });
    //
    // When user in...
    //
    $rootScope.$on('$LoginSuccess', function(ev, response) {
        var locationRedirect = $app.storage('session').get().locationRedirect;
        if (locationRedirect && locationRedirect != '/login/') {
            //
            // Reset locationRedirect
            //
            $app.storage('session').set({
                locationRedirect: ''
            });
            //
            // Do redirection
            //
            return window.location = locationRedirect;
        }
        //
        // Reset the $rootScope.$Unauthorized
        //
        $rootScope.$Unauthorized = false;
        $location.path($user.setting.loginSuccessRedirect);
    });
    //
    // BOOTSTRAP with a new user
    //  
    bootstrap(true);

    function bootstrap(withNewUser) {
        //
        // boot with new user
        //
        if (withNewUser) {
            //
            // boot from storage
            //
            if ($sessionStorage.user && $sessionStorage.user.id && $auth.getToken()) {
                $user.instantiate($sessionStorage.user, false, false, function() {
                    boot();
                });
            } else {
                //
                // user not present, ensure that we dont have token
                //
                $auth.removeToken();
                //
                // then instantiate a new blank user
                //
                $user.instantiate({}, false, false, function() {
                    boot();
                });
            }
        } else {
            boot();
        }
        //
        // export default states and behaviors to view
        //
        function boot() {
            app.user = function() { //@todo break changes
                return $user.instance();
            }
            app.page = function() { //@todo break changes
                return $page;
            }
            app.state = function() { //@todo break changes
                return $state;
            }
            app.logout = function() { //@todo break changes
                return logout();
            }
            app.menu = function() { //@todo break changes
                return $menu.api();
            }
            app.setting = function() { //@todo break changes
                return setting;
            }
            app.enviroment = function() { //@todo break changes
                return enviroment
            }
            app.year = function() { //@todo break changes
                return moment().format('YYYY');
            };
            //
            // Warning
            //
            var warning = $app.storage('session').get().warning;
            if (warning) {
                $page.toast(warning, 5000, 'top left');
                $app.storage('session').set({
                    warning: ''
                });
            }
        }
    }
    //
    // Behaviors
    //
    function logout() {
        $user.logout(true, function() {
            // if ($state.current.name != 'app.home') {
            //     $timeout(function() {
            //         $page.toast('Você será redirecionado em 5 segundos...');
            //         $timeout(function() {
            //             window.location = '/';
            //         }, 5000);
            //     }, 2000);
            // }
        });
    }
})
angular.module("core.i18n", []).config(["$translateProvider", function($translateProvider) {
$translateProvider.translations("en_US", {
    "USER_WELCOME_WARN": "Hello {{firstName}}, welcome back!",
    "USER_YOU_LEFT": "You just left."
});

$translateProvider.translations("pt_BR", {
    "USER_WELCOME_WARN": "Olá {{firstName}}, bem vind@ de volta!",
    "USER_YOU_LEFT": "Você saiu."
});
}]);

'use strict';
angular.module('core.app').provider('$app',
    /**
     * @ngdoc object
     * @name app.kit.$appProvider
     * @description
     * Provém configurações para aplicação
     **/
    /*@ngInject*/
    function $appProvider($stateProvider) {
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_config
         * @propertyOf app.kit.$appProvider
         * @description
         * armazena configurações
         **/
        this._config = {};
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_layoutUrl
         * @propertyOf app.kit.$appProvider
         * @description
         * url do template para layout
         **/
        this._layoutUrl = 'core/page/layout/layout.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_toolbarUrl
         * @propertyOf app.kit.$appProvider
         * @description
         * url do template para toolbar
         **/
        this._toolbarUrl = 'core/page/toolbar/toolbar.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_toolbarTitleUrl
         * @propertyOf app.kit.$appProvider
         * @description
         * url do template para o toolbar title
         **/
        this._toolbarTitleUrl = 'core/page/toolbar/title/toolbarTitle.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_sidenavUrl
         * @propertyOf app.kit.$appProvider
         * @description
         * url do template para sidenav
         **/
        this._sidenavUrl = 'core/page/menu/sidenav.tpl.html';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_logo
         * @propertyOf app.kit.$appProvider
         * @description
         * armazena logo
         **/
        this._logo = '';
        /**
         * @ngdoc object
         * @name app.kit.$appProvider#_logoWhite
         * @propertyOf app.kit.$appProvider
         * @description
         * armazena logo na versão branca
         **/
        this._logoWhite = '';
  
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#$get
         * @propertyOf app.kit.$appProvider
         * @description
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($app) {
         *      console.log($app.layoutUrl);
         *      //prints the default layoutUrl
         *      //ex.: "core/page/layout/layout.tpl.html"
         *      console.log($app.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto contendo valores das propriedades.
         **/
        this.$get = this.get = /*@ngInject*/ function($window, $sessionStorage, $localStorage, setting) {
            return {
                config: this._config,
                layoutUrl: this._layoutUrl,
                toolbarUrl: this._toolbarUrl,
                toolbarTitleUrl: this._toolbarTitleUrl,
                sidenavUrl: this._sidenavUrl,
                logoWhite: this._logoWhite,
                logo: this._logo,
                /**
                 * @ngdoc method
                 * @name app.kit.$appProvider#storage
                 * @methodOf app.kit.$appProvider
                 * @description
                 * Carregar/persistir dados
                 * @param {string} type tipo da persistência (local/session)
                 * @return {object} getter/setter para persistência de dados
                 **/
                storage: function(type) {
                    var $storage;
                    if (type === 'local') {
                        if (!$localStorage.app) reset();
                        $storage = $localStorage.app;
                    } else {
                        if (!$sessionStorage.app) reset();
                        $storage = $sessionStorage.app;
                    }

                    function reset() {
                        if (type === 'local') {
                            $localStorage.app = {};
                        } else {
                            $sessionStorage.app = {};
                        }
                    }
                    return {
                        set: function(item) {
                            angular.extend($storage, item)
                            return $storage;
                        },
                        get: function() {
                            return $storage;
                        },
                        destroy: function() {
                            reset();
                        }
                    }
                }
            }
        };

        /**
         * @ngdoc function
         * @name app.kit.$appProvider#config
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para configurações
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {
         *     $appProvider.config('myOwnConfiguration', {
         *          configA: 54,
         *          configB: '=D'
         *      })
         * })
         * </pre>
         * @param {string} key chave
         * @param {*} val valor
         **/
        this.config = function(key, val) {
            if (val) return this._config[key] = val;
            else return this._config[key];
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#logo
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para o path da logo
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {
         *     $appProvider.logo('assets/images/my-logo.png')
         * })
         * </pre>
         * @param {string} value caminho para logomarca
         **/
        this.logo = function(value) {
            if (value) return this._logo = value;
            else return this._logo;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#logoWhite
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para o path da logo na versão branca
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {
         *     $appProvider.logoWhite('assets/images/my-logo.png')
         * })
         * </pre>
         * @param {string} value caminho para logomarca
         **/
        this.logoWhite = function(value) {
            if (value) return this._logoWhite = value;
            else return this._logoWhite;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#layoutUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do layout
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {
         *      $appProvider.layoutUrl('app/layout/my-layout.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.layoutUrl = function(val) {
            if (val) return this._layoutUrl = val;
            else return this._layoutUrl;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#toolbarUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do toolbar
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {
         *      $appProvider.toolbarUrl('app/layout/my-toolbar.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.toolbarUrl = function(val) {
            if (val) return this._toolbarUrl = val;
            else return this._toolbarUrl;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#toolbarTitleUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do componente toolbar-title
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {
         *      $appProvider.toolbarUrl('app/layout/my-toolbar.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.toolbarTitleUrl = function(val) {
            if (val) return this._toolbarTitleUrl = val;
            else return this._toolbarTitleUrl;
        };
        /**
         * @ngdoc function
         * @name app.kit.$appProvider#sidenavUrl
         * @methodOf app.kit.$appProvider
         * @description
         * getter/setter para url do sidenav
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($appProvider) {
         *      $appProvider.sidenavUrl('app/layout/my-sidenav.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.sidenavUrl = function(val) {
            if (val) return this._sidenavUrl = val;
            else return this._sidenavUrl;
        };
    });
 'use strict';
 angular.module('core.app').run( /*@ngInject*/ function() {});
'use strict';
angular.module('core.login').config( /*@ngInject*/ function($userProvider, $stateProvider, $urlRouterProvider, $locationProvider, $loginProvider) {
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
                authed: $userProvider.isAuthed('/')
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
                }
            },
            resolve: {
                authed: $userProvider.isAuthed('/')
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
                authed: $userProvider.isAuthed('/')
            }
        });
    $locationProvider.html5Mode(true);
});
'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LoginCtrl
 * @requires core.login.$loginProvider
 * @requires core.page.factory:$page
 * @requires setting
 * @requires api
 **/
'use strict';
angular.module('core.login').controller('$LoginCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $location, $login, $page, setting, api) {
    $page.title(setting.name + setting.titleSeparator + 'Login');
    $page.description('Entre para o ' + setting.name);
    $page.load.done();
    var vm = this;
    vm.config = $login.config;
})
'use strict';
/**
 * @ngdoc directive
 * @name core.login.directive:login
 * @restrict EA
 * @description 
 * Diretiva "wrapper" pro template de login
 * @element div
 **/
angular.module('core.login').directive('login', /*@ngInject*/ function() {
    return {
        scope: {},
        templateUrl: 'core/login/login.tpl.html',
        controller: '$LoginCtrl',
        controllerAs: 'vm',
        restrict: 'EA'
    }
});
'use strict';
angular.module('core.login').provider('$login',
    /**
     * @ngdoc object
     * @name core.login.$loginProvider
     **/
    /*@ngInject*/
    function $loginProvider() {
        /**
         * @ngdoc object
         * @name core.login.$loginProvider#_config
         * @propertyOf core.login.$loginProvider
         * @description
         * armazena configurações
         **/
        this._config = {};
        /**
         * @ngdoc object
         * @name core.login.$loginProvider#_templateUrl
         * @propertyOf core.login.$loginProvider
         * @description
         * url do template para a rota
         **/
        this._templateUrl = 'core/login/login.tpl.html';
        /**
         * @ngdoc object
         * @name core.login.$loginProvider#_signupTemplateUrl
         * @propertyOf core.login.$loginProvider
         * @description
         * url do template para novos cadastros
         **/
        this._signupTemplateUrl = 'core/login/register/register.tpl.html';
        /**
         * @ngdoc object
         * @name core.login.$loginProvider#_lostTemplateUrl
         * @propertyOf core.login.$loginProvider
         * @description
         * url do template para recuperação de senha
         **/
        this._lostTemplateUrl = 'core/login/register/lost.tpl.html';
        this._signupParams = {};
        /**
         * @ngdoc function
         * @name core.login.$loginProvider#$get
         * @propertyOf core.login.$loginProvider
         * @description
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($login) {
         *      console.log($login.templateUrl);
         *      //prints the current templateUrl of `core.login`
         *      //ex.: "core/login/login.tpl.html"
         *      console.log($login.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto contendo valores das propriedades. ex: config e templateUrl
         **/
        this.$get = this.get = function() {
            return {
                config: this._config,
                templateUrl: this._templateUrl,
                signupTemplateUrl: this._signupTemplateUrl,
                signupParams: this._signupParams
            }
        }
        /**
         * @ngdoc function
         * @name core.login.$loginProvider#config
         * @methodOf core.login.$loginProvider
         * @description
         * setter para configurações
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($loginProvider) {
         *     $loginProvider.config('myOwnConfiguration', {
         *          configA: 54,
         *          configB: '=D'
         *      })
         *     $loginProvider.config('signupWelcome','Olá @firstName, você entrou para a @appName');
         * })
         * </pre>
         * @param {string} key chave
         * @param {*} val valor
         **/
        this.config = function(key, val) {
            if (val) return this._config[key] = val;
            else return this._config[key];
        }
        /**
         * @ngdoc function
         * @name core.login.$loginProvider#templateUrl
         * @methodOf core.login.$loginProvider
         * @description
         * setter para url do template
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($loginProvider) {
         *      $loginProvider.templateUrl('app/login/my-login.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.templateUrl = function(val) {
            if (val) return this._templateUrl = val;
            else return this._templateUrl;
        }
        /**
         * @ngdoc function
         * @name core.login.$loginProvider#lostTemplateUrl
         * @methodOf core.login.$loginProvider
         * @description
         * setter para url do template para recuperação de senha
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($loginProvider) {
         *      $loginProvider.lostTemplateUrl('app/login/my-login-lost.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.lostTemplateUrl = function(val) {
            if (val) return this._lostTemplateUrl = val;
            else return this._lostTemplateUrl;
        }
        /**
         * @ngdoc function
         * @name core.login.$loginProvider#signupTemplateUrl
         * @methodOf core.login.$loginProvider
         * @description
         * setter para url do template de novos cadastros
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($loginProvider) {
         *      $loginProvider.signupTemplateUrl('app/login/my-signup.html')
         * })
         * </pre>
         * @param {string} val url do template
         **/
        this.signupTemplateUrl = function(val) {
            if (val) return this._signupTemplateUrl = val;
            else return this._signupTemplateUrl;
        }
    });
'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LogoutCtrl
 * @description 
 * Destruir sessão
 * @requires core.login.$user
 **/
angular.module('core.login').controller('$LogoutCtrl', /*@ngInject*/ function($user) {
    $user.logout();
})
'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LostCtrl
 * @requires core.page.factory:$page
 * @requires setting
 * @requires api
 **/
angular.module('core.login').controller('$LostCtrl', /*@ngInject*/ function($state, $auth, $http, $mdToast, $location, $page, setting, api) {
    $page.title(setting.name + setting.titleSeparator + 'Mudar senha');
    $page.description('Entre para o ' + setting.name);
    $page.load.done();
    var vm = this;
    vm.lost = lost;
    vm.change = change;
    //lost password step2
    var userHash = $location.hash();
    if (userHash) vm.userHash = userHash;
    /**
     * @ngdoc function
     * @name core.login.controller:$LostCtrl#change
     * @methodOf core.login.controller:$LostCtrl
     * @description 
     * Alterar senha
     * @param {string} pw senha
     **/
    function change(pw) {
        $page.load.init();
        var onSuccess = function(data) {
            $page.load.done();
            $state.transitionTo('app.login');
            $mdToast.show($mdToast.simple().content(data.success).position('bottom right').hideDelay(3000))
        }
        var onError = function(data) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(data.error).position('bottom right').hideDelay(3000))
        }
        $http.put(api.url + "/api/users/" + userHash + '/newPassword', {
            password: pw
        }).success(onSuccess).error(onError);
    }
    /**
     * @ngdoc function
     * @name core.login.controller:$LostCtrl#lost
     * @methodOf core.login.controller:$LostCtrl
     * @description 
     * Link para alteração de senha
     * @param {string} email email
     **/
    function lost(email) {
        $page.load.init();
        var onSuccess = function(data) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(data.success).position('bottom right').hideDelay(3000))
        }
        var onError = function(data) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(data.error).position('bottom right').hideDelay(3000))
        }
        $http.post(api.url + "/api/users/lost", {
            email: email
        }).success(onSuccess).error(onError);
    }
})
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
'use strict';
angular.module('core.page').controller('$PageCtrl', /*@ngInject*/ function($page, setting) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.name + setting.titleSeparator + ' Home');
    bootstrap();

    function bootstrap() {}
});
'use strict';
angular.module('core.page').provider('$page',
    /**
     * @ngdoc object
     * @name core.page.$pageProvider
     * @description
     * Provém configurações/comportamentos/estados para página
     **/
    /*@ngInject*/
    function $pageProvider() {
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_config
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena configurações
         **/
        this._config = {
            // configuração para ativar/desativar a rota inicial
            'homeEnabled': true
        };
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_title
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena o título
         **/
        this._title = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_description
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena a descrição
         **/
        this._description = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_keywords
         * @propertyOf core.page.$pageProvider
         * @description
         * store keywords
         **/
        this._keywords = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_icon
         * @propertyOf core.page.$pageProvider
         * @description
         * store favicon
         **/
        this._icon = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_ogSiteName
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena open graph site name
         **/
        this._ogSiteName = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_ogTitle
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena open graph title
         **/
        this._ogTitle = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_ogDescription
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena open graph description
         **/
        this._ogDescription = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_ogUrl
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena open graph url
         **/
        this._ogUrl = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_ogImage
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena open graph image
         **/
        this._ogImage = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_ogSection
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena open graph section
         **/
        this._ogSection = '';
        /**
         * @ngdoc object
         * @name core.page.$pageProvider#_ogTag
         * @propertyOf core.page.$pageProvider
         * @description
         * armazena open graph tags
         **/
        this._ogTag = '';
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#$get
         * @propertyOf core.page.$pageProvider
         * @description
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($page) {
         *      console.log($page.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto contendo valores das propriedades.
         **/
        this.$get = this.get = /*@ngInject*/ function($mdToast) {
            return {
                config: this._config,
                load: load(),
                progress: progress(),
                toast: toast($mdToast),
                title: title,
                description: description,
                keywords: keywords,
                icon: icon,
                ogLocale: ogLocale,
                ogSiteName: ogSiteName,
                ogTitle: ogTitle,
                ogDescription: ogDescription,
                ogUrl: ogUrl,
                ogImage: ogImage,
                ogSection: ogSection,
                ogTag: ogTag,
                applySEO: applySEO
            }
        }

        function applySEO(setting) {
            //
            // SEO
            //
            this.title(setting.title);
            this.description(setting.description);
            this.keywords(setting.keywords);
            this.icon(setting.icon);
            //
            // OPEN GRAPH
            //
            this.ogLocale(setting.ogLocale);
            this.ogSiteName(setting.ogSiteName);
            this.ogTitle(setting.ogTitle);
            this.ogDescription(setting.ogDescription);
            this.ogUrl(setting.ogUrl.replace('https://', 'http://')); //because https fails ?
            this.ogImage(setting.ogImage);
            this.ogSection(setting.ogSection);
            this.ogTag(setting.ogTag);
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#config
         * @methodOf core.page.$pageProvider
         * @description
         * getter/setter para configurações
         * @example
         * <pre>
         * angular.module('myApp.module').config(function($pageProvider) {
         *     $pageProvider.config('myOwnConfiguration', {
         *          configA: 54,
         *          configB: '=D'
         *      })
         * })
         * </pre>
         * @param {string} key chave
         * @param {*} val valor
         **/
        this.config = function(key, val) {
            if (key && (val || val === false)) {
                return this._config[key] = val
            } else if (key) {
                return this._config[key]
            } else {
                return this._config
            }
        }
        this.closeMenu = function() {
            return function($timeout, $auth, $menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        $menu.api().close();
                    }, 500);
                }
            }
        };
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#title
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para meta tag título
         * @param {string} str título da página
         * @return {string} título da página
         **/
        function title(value) {
            if (value) return this._title = value;
            else return this._title;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#description
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para meta tag descrição
         * @param {string} value descrição da página
         **/
        function description(value) {
            if (value) return this._description = value;
            else return this._description;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#keywords
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter for keywords
         * @param {string} value
         **/
        function keywords(value) {
            if (value) return this._keywords = value;
            else return this._keywords;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#icon
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter for page favicon
         * @param {string} value
         **/
        function icon(value) {
            if (value) return this._icon = value;
            else return this._icon;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogLocale
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph locale
         * @param {string} value locale
         **/
        function ogLocale(value) {
            if (value) return this._ogLocale = value;
            else return this._ogLocale;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogSiteName
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph site name
         * @param {string} value site name
         **/
        function ogSiteName(value) {
            if (value) return this._ogSiteName = value;
            else return this._ogSiteName;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogTitle
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph title
         * @param {string} value title
         **/
        function ogTitle(value) {
            if (value) return this._ogTitle = value;
            else return this._ogTitle;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogDescription
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph description
         * @param {string} value description
         **/
        function ogDescription(value) {
            if (value) return this._ogDescription = value;
            else return this._ogDescription;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogUrl
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph url
         * @param {string} value url
         **/
        function ogUrl(value) {
            if (value) return this._ogUrl = value;
            else return this._ogUrl;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogImage
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph image
         * @param {string} value image
         **/
        function ogImage(value) {
            if (value) return this._ogImage = value;
            else return this._ogImage;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogSection
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph section
         * @param {string} value section
         **/
        function ogSection(value) {
            if (value) return this._ogSection = value;
            else return this._ogSection;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#ogTag
         * @methodOf core.page.$pageProvider
         * @description
         * getter/getter para open-graph tag
         * @param {string} value tag
         **/
        function ogTag(value) {
            if (value) return this._ogTag = value;
            else return this._ogTag;
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#load
         * @methodOf core.page.$pageProvider
         * @description
         * inicia e termina o carregamento da página
         * @return {object} com metodos de inicialização (init) e finalização (done)
         **/
        function load() {
            return {
                init: function() {
                    this.status = true;
                    //console.log('loader iniciado...' + this.status);
                },
                done: function() {
                    this.status = false;
                    //console.log('loader finalizado...' + this.status);
                }
            }
        }
        /**
         * @ngdoc function
         * @name core.page.$pageProvider#toast
         * @methodOf core.page.$pageProvider
         * @description
         * mostra uma mensagem de aviso
         * @param {string} msg mensagem
         * @param {integer} time tempo em milisegundos
         * @param {string} position posição do alerta. default: 'bottom right'
         **/
        function toast($mdToast) {
            return function(msg, time, position) {
                time = time ? time : 5000;
                $mdToast.show($mdToast.simple().content(msg).position(position ? position : 'bottom right').hideDelay(time));
            }
        }
        //another type of load
        function progress() {
            return {
                init: function() {
                    this.status = true;
                    //console.log('progress iniciado...' + this.status);
                },
                done: function() {
                    this.status = false;
                    //console.log('progress finalizado...' + this.status);
                }
            }
        }
    })
'use strict';
angular.module('core.user').provider('$user',
    /**
     * @ngdoc object
     * @name core.user.$userProvider
     * @description
     * 2 em 1 - provém configurações e a factory (ver $get) com estados/comportamentos de usuário.
     **/
    /*@ngInject*/
    function $userProvider() {
        /**
         * @ngdoc object
         * @name core.user.$userProvider#_instance
         * @propertyOf core.user.$userProvider
         * @description
         * Instância de usuário armazenada pelo {@link core.user.service:$User serviço}
         **/
        this._instance = null;
        /**
         * @ngdoc object
         * @name core.user.$userProvider#_setting
         * @propertyOf core.user.$userProvider
         * @description
         * Armazena configurações
         **/
        this._setting = {};
        /**
         * @ngdoc function
         * @name core.user.$userProvider#$get
         * @propertyOf core.user.$userProvider
         * @description
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($user) {
         *      console.log($user.setting.roleForCompany);
         *      //printa a regra para empresa
         * })
         * </pre>
         * @return {object} objeto correspondente a uma Factory
         **/
        this.$get = this.get = /*@ngInject*/ function($User, $app, $auth, $page, $rootScope, $sessionStorage, $translate, lodash) {
            var _ = lodash;
            return {
                instance: function(user) {
                    if (user) return this._instance = user;
                    else return this._instance && this._instance.id ? this._instance : {
                        'profile': {}
                    };
                },
                setting: this._setting,
                /**
                 * @ngdoc function
                 * @name core.user.factory:$user:instantiate
                 * @methodOf core.user.factory:$user
                 * @description
                 * User bootstrap
                 * @param {object} params the params of instance
                 * @param {bool} alert display a welcome message when user logs in
                 * @param {string} message the message
                 */
                instantiate: function(params, alert, message, cb) {
                    if (typeof params != 'object') params = {};
                    this.instance(new $User(params));
                    $sessionStorage.user = this.instance();
                    //
                    // @todo doc broadcast $UserInstantiateStart
                    //                   
                    $rootScope.$emit('$UserInstantiateStart', this.instance());
                    //
                    // We have user ID ?
                    //            
                    if (params._id || params.id) {
                        if (!message && params.profile && params.profile.firstName) {
                            //
                            // Welcome warning
                            //      
                            $translate('USER_WELCOME_WARN', {
                                'firstName': params.profile.firstName
                            }).then(function(message) {
                                if (alert) {
                                    $page.toast(message, 5000);
                                    $app.storage('session').set({
                                        warning: message
                                    });
                                }
                            });
                        } else if (message && alert) {
                            $page.toast(message, 5000);
                        }
                        //
                        // Company behavior
                        // @app-kit-pro version
                        //
                        var role = false,
                            roleForCompany = this.setting.roleForCompany,
                            userInstance = this.instance();
                        if (userInstance.id) {
                            if (roleForCompany && roleForCompany != 'user') {
                                role = params[roleForCompany].role;
                            } else if (roleForCompany && roleForCompany === 'user') {
                                role = params.role;
                            }
                            if (role.length) {
                                this.instance().current('company', this.getCompany());
                                this.instance().current('companies', this.getCompanies());
                            }
                        }
                    }
                    //
                    // @todo doc broadcast $UserInstantiateEnd
                    //                   
                    $rootScope.$emit('$UserInstantiateEnd', this.instance());
                    if (typeof cb === 'function') {
                        cb(this.instance());
                    }
                    return this.instance();
                },
                /**
                 * @ngdoc function
                 * @name core.user.$userProvider#destroy
                 * @methodOf core.user.$userProvider
                 * @description
                 * Apagar instância do usuário
                 * @example
                 * <pre>
                 * var user = new $User();
                 * $user.set(user);
                 * //now user instance can be injectable
                 * angular.module('myApp').controller('myCtrl',function($user){
                 * $user.instance().destroy() //apaga instância do usuário
                 * })
                 * </pre>
                 **/
                destroy: function(cb) {
                    //
                    // delete user instance
                    //
                    this._instance = null;
                    //
                    // delete token auth
                    //
                    $auth.removeToken();
                    //
                    // delete user session
                    //
                    $sessionStorage.$reset();
                    //
                    // delete session redirection
                    //
                    $app.storage('session').set({
                        locationRedirect: ''
                    });
                    if (typeof cb === 'function') return cb();
                },
                /**
                 * @ngdoc function
                 * @name core.user.$userProvider#logout
                 * @methodOf core.user.$userProvider
                 * @description
                 * Apagar instância do usuário e sair
                 **/
                logout: function(alert, cb) {
                    this.destroy(function() {
                        //
                        // @todo doc broadcast $UserLeft
                        //     
                        $translate('USER_YOU_LEFT').then(function(message) {
                            //
                            // sign out user
                            //
                            $auth.logout().then(function() {
                                $rootScope.$emit('$UserLeft');
                                if (alert) $page.toast(message, 3000, 'top right');
                                if (typeof cb === 'function') return cb();
                            });
                        });
                    });
                },
                getCompanies: function() {
                    var role = false,
                        roleForCompany = this.setting.roleForCompany;
                    if (roleForCompany && roleForCompany != 'user') {
                        role = this.instance()[roleForCompany].role;
                    } else if (roleForCompany && roleForCompany === 'user') {
                        role = this.instance().role;
                    }
                    return role;
                },
                getCompany: function(id) {
                    return this.getCompanies()[0].company;
                    //@todo make this works with id param
                    //     if (!id)
                    //     return this.getCompanies()[0].company;
                    // else _.each(this.getCompanies(), function(item){
                    //     if (item.)
                    // })
                }
            }
        }
        this.setting = function(key, val) {
            if (key && val) return this._setting[key] = val;
            else if (key) return this._setting[key];
            else return this._setting;
        }
        this.isAuthed = function(redirect) {
            return /*@ngInject*/ function isAuthed($auth, $state, $timeout, $user, $location) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        window.location = redirect || $user.setting.loginSuccessRedirect || '/';
                    });
                    return true;
                } else {
                    return false;
                }
            }
        }
        this.isNotAuthed = function(redirect) {
            return /*@ngInject*/ function isAuthed($auth, $state, $timeout, $user, $location) {
                if (!$auth.isAuthenticated()) {
                    $timeout(function() {
                        window.location = redirect || $user.setting.loginSuccessRedirect || '/';
                    });
                    return true;
                } else {
                    return false;
                }
            }
        }
    });
'use strict';
/**
 * @ngdoc service
 * @name core.user.service:$User
 **/
angular.module('core.user').service('$User', /*@ngInject*/ function($auth, lodash) {
    var _ = lodash,
        self = this;
    var $User = function(params) {
        params = params ? params : {};
        if (!params.currentData) params.currentData = {};
        angular.extend(this, params);
    }
    $User.prototype.isAuthed = isAuthed;
    /**
     * @ngdoc function
     * @name core.user.service:$User:current
     * @methodOf core.user.service:$User
     * @description
     * Adiciona informações customizadas no formato chave:valor à instância corrente do usuário
     * @example
     * <pre>
     * var user = new $User();
     * user.current('company',{_id: 123456, name: 'CocaCola'})
     * console.log(user.current('company')) //prints {_id: 123456, name: 'CocaCola'}
     * </pre>
     * @param {string} key chave
     * @param {*} val valor
     */
    $User.prototype.current = current;

    function isAuthed() {
        return $auth.isAuthenticated();
    }

    function current(key, val) {
        if (key && val) {
            this.currentData[key] = val;
        } else if (key) {
            return this.currentData && this.currentData[key] ? this.currentData[key] : false;
        }
        return this.currentData;
    }
    return $User;
});
'use strict';
/* jshint undef: false, unused: false, shadow:true, quotmark: false, -W110,-W117, eqeqeq: false */
angular.module('core.utils').factory('$utils', /*@ngInject*/ function($q) {
    var vm = this;
    return {
        isImg: isImg,      
        brStates: brStates,
        age: age
    }

    function isImg(src) {
        var deferred = $q.defer();
        var image = new Image();
        image.onerror = function() {
            deferred.resolve(false);
        };
        image.onload = function() {
            deferred.resolve(true);
        };
        image.src = src;
        return deferred.promise;
    }

    function age(date) {
        return moment(date).fromNow(true);
    }

    function brStates() {
        return [{
            value: "AC",
            name: "Acre"
        }, {
            value: "AL",
            name: "Alagoas"
        }, {
            value: "AM",
            name: "Amazonas"
        }, {
            value: "AP",
            name: "Amapá"
        }, {
            value: "BA",
            name: "Bahia"
        }, {
            value: "CE",
            name: "Ceará"
        }, {
            value: "DF",
            name: "Distrito Federal"
        }, {
            value: "ES",
            name: "Espírito Santo"
        }, {
            value: "GO",
            name: "Goiás"
        }, {
            value: "MA",
            name: "Maranhão"
        }, {
            value: "MT",
            name: "Mato Grosso"
        }, {
            value: "MS",
            name: "Mato Grosso do Sul"
        }, {
            value: "MG",
            name: "Minas Gerais"
        }, {
            value: "PA",
            name: "Pará"
        }, {
            value: "PB",
            name: "Paraíba"
        }, {
            value: "PR",
            name: "Paraná"
        }, {
            value: "PE",
            name: "Pernambuco"
        }, {
            value: "PI",
            name: "Piauí"
        }, {
            value: "RJ",
            name: "Rio de Janeiro"
        }, {
            value: "RN",
            name: "Rio Grande do Norte"
        }, {
            value: "RO",
            name: "Rondônia"
        }, {
            value: "RS",
            name: "Rio Grande do Sul"
        }, {
            value: "RR",
            name: "Roraima"
        }, {
            value: "SC",
            name: "Santa Catarina"
        }, {
            value: "SE",
            name: "Sergipe"
        }, {
            value: "SP",
            name: "São Paulo"
        }, {
            value: "TO",
            name: "Tocantins"
        }];
    }
})
'use strict';
angular.module('facebook.login').config(function(FacebookProvider, setting) {
    //@todo make me an option - by now its only loadable by consumer app
    // FacebookProvider.init({
    //     version: 'v2.3',
    //     appId: setting.facebook.appId,
    //     locale: 'pt_BR'
    // });
});
'use strict';
angular.module('facebook.login').controller('FacebookLoginCtrl', /*@ngInject*/ function(fbLogin) {
    var vm = this;
    vm.login = login;

    function login() {
        fbLogin.go();
    }
})
'use strict';
angular.module('facebook.login').directive('facebookLogin', /*@ngInject*/ function() {
    return {
        templateUrl: function(elem, attr){
        	return attr.templateUrl ? attr.templateUrl : "core/login/facebook/facebookLogin.tpl.html";
        },
        scope: {
            user: '=',
            templateUrl: '='
        },
        controller: 'FacebookLoginCtrl',
        controllerAs: 'fb'
    }
})
'use strict';
angular.module('facebook.login').factory('fbLogin', /*@ngInject*/ function($rootScope, $auth, $mdToast, $http, Facebook, $user, $page, $login, api, setting) {
    return {
        go: go
    }

    function go(cbSuccess, cbFail) {
        $page.load.init();
        Facebook.getLoginStatus(function(response) {
            if (response.status === 'connected') {
                return loginHandler(cbSuccess, cbFail);
            } else {
                Facebook.login(function(response) {
                    if (response.error || !response.status || !response.authResponse) {
                        $page.load.done();
                        return;
                    }
                    return loginHandler(cbSuccess, cbFail);
                }, {
                    scope: setting.facebook.scope || 'email'
                });
            }
        })
    }

    function me() {
        return Facebook.api('/me', function() {
            //$scope.user = response;
        });
    }

    function loginHandler(cbSuccess, cbFail) {
        var onSuccess = function(fbUser) {
            var onSuccess = function(response) {
                $page.load.done();
                $user.instantiate(response.data.user, true, response.data.new ? msg : false, function() {
                    $auth.setToken(response.data.token);
                    $rootScope.$emit('$LoginSuccess', response.data);
                    if (cbSuccess) cbSuccess();
                });
            }
            var onFail = function(response) {
                $page.load.done();
                $mdToast.show($mdToast.simple().content(response.data && result.data.error ? response.data.error : 'error').position('bottom right').hideDelay(3000))
                if (cbFail) cbFail()
            }
            var gender = '';
            gender = fbUser.gender && fbUser.gender === 'female' ? 'F' : gender;
            $http.post(api.url + '/auth/facebook', angular.extend({
                provider: 'facebook',
                id: fbUser.id,
                firstName: fbUser.first_name,
                lastName: fbUser.last_name,
                email: fbUser.email,
                gender: gender,
                applicant: true
            }, $login.signupParams)).then(onSuccess, onFail);
        }
        var onFail = function() {}
        me().then(onSuccess, onFail);
    }
})
'use strict';
/* global gapi */
angular.module('google.login').controller('GoogleLoginCtrl', /*@ngInject*/ function($auth, $scope, $http, $mdToast, $state, $page, $user, setting, api) {
    var vm = this;
    vm.clientId = setting.google.clientId;
    vm.language = setting.google.language;
    $scope.$on('event:google-plus-signin-success', function( /*event, authResult*/ ) {
        // Send login to server or save into cookie
        gapi.client.load('plus', 'v1', apiClientLoaded);
    });
    $scope.$on('event:google-plus-signin-failure', function( /*event, authResult*/ ) {
        // @todo Auth failure or signout detected
    });

    function apiClientLoaded() {
        gapi.client.plus.people.get({
            userId: 'me'
        }).execute(handleResponse);
    }

    function handleResponse(glUser) {
        login(glUser);
    }

    function login(glUser) {
        $page.load.init();
        var onSuccess = function(response) {
            $page.load.done();
            var msg = false;
            var gender = (response.data.user.profile && response.data.user.profile.gender && response.data.user.profile.gender === 'F') ? 'a' : 'o';
            if (response.data.new) msg = 'Olá ' + response.data.user.profile.firstName + ', você entrou. Seja bem vind' + gender + ' ao ' + setting.name;
            $auth.setToken(response.data.token);
            var userInstance = $user.instance();
            if (typeof userInstance.init === 'function') $user.instance().init(response.data.user, true, msg);
        }
        var onFail = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'error').position('bottom right').hideDelay(3000))
        }
        $http.post(api.url + '/auth/google', {
            provider: 'google',
            id: glUser.id,
            firstName: glUser.name.givenName,
            lastName: glUser.name.familyName,
            email: glUser.emails[0].value,
            gender: glUser.gender
        }).then(onSuccess, onFail);
    }
})
'use strict';
angular.module('google.login').directive('googleLogin', /*@ngInject*/ function() {
    return {
        templateUrl: "core/login/google/googleLogin.tpl.html",
        controller: 'GoogleLoginCtrl',
        controllerAs: 'google'
    }
})
'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LoginFormCtrl
 * @description 
 * Controlador do componente
 * @requires $scope
 * @requires $auth
 * @requires $mdToast
 * @requires core.user.factory:$user
 **/
angular.module('core.login').controller('$LoginFormCtrl', /*@ngInject*/ function($rootScope, $scope, $auth, $page, $mdToast, $user) {
    var vm = this;
    vm.login = login;
    /**
     * @ngdoc function
     * @name core.login.controller:$LoginFormCtrl#login
     * @propertyOf core.login.controller:$LoginFormCtrl
     * @description 
     * Controlador do componente de login
     * @param {string} logon objeto contendo as credenciais email e password
     **/
    function login(logon) {
        $page.load.init();
        var onSuccess = function(response) {
            $page.load.done();
            $user.instantiate(response.data.user, true, false, function() {
                $rootScope.$emit('$LoginSuccess', response.data);
            });
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'error').position('bottom right').hideDelay(3000))
        }
        $auth.login({
            email: logon.email,
            password: logon.password
        }).then(onSuccess, onError);
    }
})
'use strict';
/**
 * @ngdoc directive
 * @name core.login.directive:loginForm
 * @restrict EA
 * @description 
 * Componente para o formulário de login
 * @element div
 * @param {object} config objeto de configurações do módulo login
 * @param {object} user objeto instância do usuário
 * @param {string} template-url caminho para o template do formulário
 **/
angular.module('core.login').directive('loginForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '=',
            user: '=',
            templateUrl: '='
        },
        restrict: 'EA',
        templateUrl: function(elem, attr){
            return attr.templateUrl ? attr.templateUrl : "core/login/form/loginForm.tpl.html";
        },
        controller: '$LoginFormCtrl',
        controllerAs: 'vm',
        link: function() {}
    }
});
'use strict';
angular.module('core.login').controller('RegisterFormCtrl', /*@ngInject*/ function($rootScope, $scope, $auth, $mdToast, $user, $page, $login, setting) {
    $scope.register = register;
    $scope.sign = {};

    function register(sign) {
        $page.load.init();
        var onSuccess = function(result) {
            var msg = 'Olá ' + result.data.user.profile.firstName + ', você entrou para ' + setting.name;
            if ($login.config.signupWelcome) {
                msg = $login.config.signupWelcome.replace('@firstName', result.data.user.profile.firstName).replace('@appName', setting.name);
            }
            $user.instantiate(result.data.user, true, msg, function() {
                $auth.setToken(result.data.token);
                $rootScope.$emit('$LoginSuccess', result.data);
                $page.load.done();
            });
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'error').position('bottom right').hideDelay(10000))
        }
        $auth.signup(angular.extend({
            firstName: sign.firstName,
            lastName: sign.lastName,
            email: sign.email,
            password: sign.password,
            provider: 'local'
        }, $login.signupParams)).then(onSuccess, onError);
    }
})
'use strict';
/**
 * @ngdoc directive
 * @name core.login.directive:registerForm
 * @restrict E
 * @description 
 * Componente para o formulário de cadastro
 * @element div
 * @param {object} config objeto de configurações do módulo login
 * @param {string} template-url caminho para o template do formulário
 **/
angular.module('core.login').directive('registerForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '=',
            templateUrl: '='
        },
        templateUrl: function(elem, attr){
            return attr.templateUrl ? attr.templateUrl : "core/login/register/registerForm.tpl.html";
        },
        controller: 'RegisterFormCtrl',
        controlerAs: 'vm'
    }
})
'use strict';
angular.module('core.page').directive('loader', /*@ngInject*/ function() {
    return {
        templateUrl: "core/page/loader/loader.tpl.html",
    }
})
'use strict';
angular.module('core.menu').config( /*@ngInject*/ function() {})
'use strict';
angular.module('core.menu').provider('$menu',
    /**
     * @ngdoc object
     * @name core.menu.$menuProvider
     * @description
     * 2 em 1 - provém configurações e a factory (ver $get) com estados/comportamentos de menu.
     **/
    /*@ngInject*/
    function $menuProvider() {
        var instance = this;
        /**
         * @ngdoc object
         * @name core.menu.$menuProvider#mainMenu
         * @propertyOf core.menu.$menuProvider
         * @description 
         * Armazena o menu principal
         **/
        this.mainMenu = [];
        /**
         * @ngdoc object
         * @name core.menu.$menuProvider#toolbarMenu
         * @propertyOf core.menu.$menuProvider
         * @description 
         * Armazena o menu para a toolbar
         **/
        this.toolbarMenu = [];
        /**
         * @ngdoc function
         * @name core.menu.$menuProvider#$get
         * @propertyOf core.menu.$menuProvider
         * @description 
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($menu) {     
         *      console.log($menu.main); //printa array contendo itens do menu principal     
         *      $menu.api().close() //fecha o menu
         * })
         * </pre>
         * @return {object} Retorna um objeto correspondente a uma Factory
         **/
        this.$get = this.get = /*@ngInject*/ function($rootScope, $mdSidenav) {
                return {
                    main: this.mainMenu,
                    toolbar: this.toolbarMenu,
                    api: api(instance, $rootScope, $mdSidenav)
                }
            }
            /**
             * @ngdoc function
             * @name core.menu.$menuProvider#set
             * @methodOf core.menu.$menuProvider
             * @description
             * Adicionar um novo menu
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($menuProvider) {     
             *     $menuProvider.set({
             *         name: 'Conta',
             *         type: 'link',
             *         icon: 'fa fa-at',
             *         url: '/account/',
             *         state: 'app.account'
             *     });
             * })
             * </pre>
             * @param {object} menu objeto contendo as propriedades do menu   
             **/
        this.set = function(menu) {
                this.mainMenu.push(menu);
            }
            /**
             * @ngdoc function
             * @name core.menu.$menuProvider#setToolbar
             * @methodOf core.menu.$menuProvider
             * @description
             * Adicionar um novo menu no toolbar
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($menuProvider) {     
             *     $menuProvider.setToolbar({
             *         name: 'Conta',
             *         type: 'link',
             *         icon: 'fa fa-at',
             *         url: '/account/',
             *         state: 'app.account'
             *     });
             * })
             * </pre>
             * @param {object} menu objeto contendo as propriedades do menu   
             **/
        this.setToolbar = function(menu) {
                this.toolbarMenu.push(menu);
            }
            /**
             * @ngdoc function
             * @name core.menu.$menuProvider#api
             * @methodOf core.menu.$menuProvider
             * @example
             * <pre>
             * angular.module('myApp.module').controller('MyCtrl', function($menu) {       
             *      $menu.api().open() //abre o menu
             *      $menu.api().close() //fecha o menu
             * })
             * </pre>
             * @return {object} comportamentos do menu
             **/
        function api(instance, $rootScope, $mdSidenav) {
            return function api() {
                return {
                    openedSection: false,
                    currentPage: null,
                    open: function() {
                        $rootScope.$emit('AppMenuOpened');
                        $mdSidenav('left').open();
                    },
                    close: function() {
                        $rootScope.$emit('AppMenuClosed');
                        $mdSidenav('left').close();
                    },
                    //sections: sampleMenu(),
                    sections: instance.mainMenu,
                    selectSection: function(section) {
                        this.openedSection = section;
                    },
                    toggleSelectSection: function(section) {
                        this.openedSection = (this.openedSection === section ? false : section);
                    },
                    isChildSectionSelected: function(section) {
                        return this.openedSection === section;
                    },
                    isSectionSelected: function(section) {
                        var selected = false;
                        var openedSection = this.openedSection;
                        if (openedSection === section) {
                            selected = true;
                        } else if (section.children) {
                            section.children.forEach(function(childSection) {
                                if (childSection === openedSection) {
                                    selected = true;
                                }
                            });
                        }
                        return selected;
                    },
                    selectPage: function(section, page) {
                        //page && page.url && $location.path(page.url);
                        this.currentSection = section;
                        this.currentPage = page;
                    },
                    isPageSelected: function(page) {
                        return this.currentPage === page;
                    },
                    isOpen: function(section) {
                        return this.isSectionSelected(section);
                    },
                    toggleOpen: function(section) {
                        return this.toggleSelectSection(section);
                    },
                    isSelected: function(page) {
                        return this.isPageSelected(page);
                    }
                }
            }
        }
        //
        // MENU SECTIONS SAMPLE
        //
        /*function sampleMenu() {
                return [
                    {
                    name: 'API Reference',
                    type: 'heading',
                    //iconSvg: 'ic_dashboard',
                    icon: 'fa fa-dashboard',
                    children: [{
                        name: 'Layout',
                        type: 'toggle',
                        pages: [{
                            name: 'Container Elements',
                            id: 'layoutContainers',
                            url: '/layout/container'
                        }, {
                            name: 'Grid System',
                            id: 'layoutGrid',
                            url: '/layout/grid'
                        }, {
                            name: 'Child Alignment',
                            id: 'layoutAlign',
                            url: '/layout/alignment'
                        }, {
                            name: 'Options',
                            id: 'layoutOptions',
                            url: '/layout/options'
                        }]
                    }, {
                        name: 'Services',
                        pages: [],
                        type: 'toggle'
                    }, {
                        name: 'Directives',
                        pages: [],
                        type: 'toggle'
                    }]
                }*/
        /*  {
                    name: 'Finalizar pedido',
                    url: '/checkout',
                    type: 'link'
                }, 
*/
        /*{
                        name: 'Produtos',
                        type: 'toggle',
                        icon: 'fa fa-diamond',
                        pages: [{
                            name: 'Pulseira A',
                            id: 'pulseira-a',
                            url: '/produtos/pulseira-a'
                        }, {
                            name: 'Pulseira B',
                            id: 'pulseira-b',
                            url: '/produtos/pulseira-b'
                        }, {
                            name: 'Pulseira C',
                            id: 'pulseira-c',
                            url: '/produtos/pulseira-c'
                        }]

                    }
                    ,
                    {
                        name: 'Políticas',
                        type: 'toggle',
                        icon: 'fa fa-file-text-o',
                        pages: [{
                            name: 'Termo de compromisso',
                            id: 'termo',
                            url: '/termo'
                        }, {
                            name: 'Política de privacidade',
                            id: 'privacidade',
                            url: '/privacidade'
                        }, ]
                    }, {
                        name: 'Sobre',
                        type: 'toggle',
                        icon: 'fa fa-briefcase',
                        pages: [{
                            name: 'Quem somos',
                            id: 'quemSomos',
                            url: '/quem-somos'
                        }]
                    }
                ];
            }*/
    })
'use strict';
angular.module('core.menu').filter('menuHuman', /*@ngInject*/ function menuHuman() {
    return function(doc) {
        if (!doc) return;
        if (doc.type === 'directive') {
            return doc.name.replace(/([A-Z])/g, function($1) {
                return '-' + $1.toLowerCase();
            });
        }
        return doc.label || doc.name;
    }
})
'use strict';
angular.module('core.menu').controller('MenuLinkCtrl', /*@ngInject*/ function($state) {
    var vm = this;
    vm.state = $state;
})
'use strict';
angular.module('core.menu').directive('menuLink', /*@ngInject*/ function() {
    return {
        scope: {
            section: '='
        },
        controller: 'MenuLinkCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/page/menu/menuLink.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isSelected = function() {
                return controller.menu ? controller.menu.isSelected($scope.section):'';
            };
        }
    };
});
'use strict';
angular.module('core.menu').directive('menuToggle', /*@ngInject*/ function() {
    return {
        scope: {
            section: '='
        },
        templateUrl: 'core/page/menu/menuToggle.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isOpen = function() {
                return controller.menu.isOpen($scope.section);
            };
            $scope.toggle = function() {
                controller.menu.toggleOpen($scope.section);
            };
            var parentNode = $element[0].parentNode.parentNode.parentNode;
            if (parentNode.classList.contains('parent-list-item')) {
                var heading = parentNode.querySelector('h2');
                $element[0].firstChild.setAttribute('aria-describedby', heading.id);
            }
        }
    }
});
'use strict';
angular.module('core.menu').filter('nospace', /*@ngInject*/ function() {
    return function(value) {
        return (!value) ? '' : value.replace(/ /g, '');
    }
});
 'use strict';
 /* global moment */
 /**
  * @ngdoc filter
  * @name core.utils.filter:age
  * @description 
  * Filtro para converter data (EN) para idade
  * @param {date} value data de nascimento
  * @example
  * <pre>
  * {{some_date | age}}
  * </pre>
  **/
 angular.module('core.utils').filter('age', /*@ngInject*/ function() {
     return function(value) {
         if (!value) return '';
         return moment(value).fromNow(true);
     };
 })
'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:cep
 * @description 
 * Filtro para adicionar máscara de CEP
 * @param {string} value código postal
 * @example
 * <pre>
 * {{some_text | cep}}
 * </pre>
 **/
angular.module('core.utils').filter('cep', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/^(\d{2})(\d{3})(\d)/, '$1.$2-$3');
        return str;
    }
})
'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:cnpj
 * @description 
 * Filtro para adicionar máscara de CNPJ
 * @param {string} value CNPJ
 * @example
 * <pre>
 * {{some_text | cnpj}}
 * </pre>
 **/
angular.module('core.utils').filter('cnpj', /*@ngInject*/ function() {
    return function(input) {
        // regex créditos @ Matheus Biagini de Lima Dias
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/^(\d{2})(\d)/, '$1.$2');
        str = str.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        str = str.replace(/\.(\d{3})(\d)/, '.$1/$2');
        str = str.replace(/(\d{4})(\d)/, '$1-$2');
        return str;
    }
});
'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:cpf
 * @description 
 * Filtro para adicionar máscara de CPF
 * @param {string} value CPF
 * @example
 * <pre>
 * {{some_text | cpf}}
 * </pre>
 **/
angular.module('core.utils').filter('cpf', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return str;
    }
});
'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:cut
 * @description 
 * Filtro para cortar strings e adicionar "..."
 * @param {string} value palavra ou texto
 * @param {bool} wordwise cortar por palavras
 * @param {integer} max tamanho máximo do corte
 * @param {string} tail final da string (cauda)
 * @example
 * <pre>
 * {{some_text | cut:true:100:' ...'}}
 * </pre>
 **/
angular.module('core.utils').filter('cut', /*@ngInject*/ function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };
})
'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:phone
 * @description 
 * Adicionar máscara de telefone
 * @param {string} value telefone
 * @example
 * <pre>
 * {{some_text | phone}}
 * </pre>
 **/
angular.module('core.utils').filter('phone', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        if (str.length === 11) {
            str = str.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            str = str.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return str;
    }
});
 'use strict';
 /**
  * @ngdoc filter
  * @name core.utils.filter:randomInteger
  * @description 
  * Converter para um número random
  * @param {integer} value valor corrente
  * @param {integer} min valor mínimo
  * @param {integer} max valor máximo
  * @example
  * <pre>
  * {{some_number | randomInteger:1:10}}
  * </pre>
  **/
 angular.module('core.utils').filter('randomInteger', /*@ngInject*/ function() {
     return function(value, min, max) {
         return Math.floor(Math.random() * (max - min)) + min;
     }
 })
'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:real
 * @description 
 * Adicionar mascára de moeda no formato real (BR)
 * @param {string} value valor
 * @param {bool} prefix prefixo R$
 * @example
 * <pre>
 * {{some_text | real:true}}
 * </pre>
 **/
angular.module('core.utils').filter('real', /*@ngInject*/ function() {
    return function(input, prefix) {
        return prefix ? 'R$ ' : '' + formatReal(input);
    }

    function formatReal(int) {
        var tmp = int + '';
        var res = tmp.replace('.', '');
        tmp = res.replace(',', '');
        var neg = false;
        if (tmp.indexOf('-') === 0) {
            neg = true;
            tmp = tmp.replace('-', '');
        }
        if (tmp.length === 1) {
            tmp = '0' + tmp;
        }
        tmp = tmp.replace(/([0-9]{2})$/g, ',$1');
        if (tmp.length > 6) {
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
        }
        if (tmp.length > 9) {
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, '.$1.$2,$3');
        }
        if (tmp.length > 12) {
            tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, '.$1.$2.$3,$4');
        }
        if (tmp.indexOf('.') === 0) {
            tmp = tmp.replace('.', '');
        }
        if (tmp.indexOf(',') === 0) {
            tmp = tmp.replace(',', '0,');
        }
        return neg ? '-' + tmp : tmp;
    }
});
'use strict';
//
// Usage:
// {{some_array | slice:start:end }}
//
angular.module('core.utils').filter('slice', /*@ngInject*/ function sliceFilter() {
    return function(arr, start, end) {
        return arr.slice(start, end);
    };
})
'use strict';
//
// Usage:
// {{some_date | title }}
//
angular.module('core.utils').filter('title', /*@ngInject*/ function titleFilter() {
    return function(input) {
        input = input || '';
        return input.replace(/\w\S*/g, function(txt) {
            var whitelist = ['I', 'II'];
            if (txt.length > 2) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            } else {
                if (whitelist.indexOf(txt.toUpperCase()) >= 0) {
                    return txt.toUpperCase();
                } else {
                    return txt.toLowerCase();
                }
            }
        });
    }
})
'use strict';
//
// Usage:
// {{months | toYears }}
//
angular.module('core.utils').filter('toYears', /*@ngInject*/ function() {
    return function(value) {
        if (!value) return '';
        var what = value,
            stringYear = '',
            stringMonth = '';
        if (value >= 12) {
            what = value / 12;
            if (isFloat(what)) {
                var real = what, //1.25
                    years = parseInt(real), //1
                    months = Math.floor((real - years) * 10);
                if (years)
                    stringYear = years + ' ano' + ((years > 1) ? 's' : '');
                if (months)
                    stringMonth = ' e ' + months + ' mes' + ((months > 1) ? 'es' : '');
            } else {
                stringYear = what + ' ano' + ((what > 1) ? 's' : '');
            }
        } else {
            stringMonth = value + ' mes' + ((value > 1) ? 'es' : '');
        }
        return stringYear + stringMonth;
    }

    function isFloat(n) {
        return n === Number(n) && n % 1 !== 0
    }
})
 'use strict';
 //
 // Usage:
 // {{some_str | unsafe }}
 //
 angular.module('core.utils').filter('unsafe', /*@ngInject*/ function($sce) {
     return function(value) {
         return $sce.trustAsHtml(value);
     };
 })
'use strict';
angular.module('core.utils').factory('Fb', /*@ngInject*/ function(Facebook) {
    return {
        getLikes: getLikes,
        getFriends: getFriends,
        checkPerms: checkPerms,
        userLikedPage: userLikedPage,
        session: session
    }

    function getLikes(id, cb) {
        return Facebook.api("/" + id + "/likes", cb);
    }

    function getFriends(id, cb) {
        return Facebook.api("/" + id + "/friends", cb);
    }

    function checkPerms(id, cb) {
        return Facebook.api("/" + id + "/permissions", cb);
    }

    function userLikedPage(id, company, cb) {
        return Facebook.api("/" + id + "/likes/" + company, function(response) {
            //handle "An access token is required to request this resource." when pages refresh
            if (response.error && response.error.code === 104) {
                // numa listagem isso nao fica mto legal =(
                // Facebook.login(function(response) {
                //     return userLikedPage(id, company, cb);
                // }, {
                //     scope: setting.facebook.scope || 'email'
                // });
            } else {
                //handle success request
                return cb(response);
            }
        });
    }

    function session() {
        /*            Facebook.api("/" + id + "/likes/" + company, function(response) {
                //handle "An access token is required to request this resource." when pages refresh
                if (response.error && response.error.code === 104) {
                    Facebook.login(function(response) {
                        return userLikedPage(id, company, cb);
                    }, {
                        scope: setting.facebook.scope || 'email'
                    });
                } else {
                    //handle success request
                    return cb(response);
                }
            });*/
        /* Facebook.getLoginStatus(function(response) {
                  console.log(response)
                if (response.status === 'connected') {
                    // the user is logged in and has authenticated your
                    // app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed
                    // request, and the time the access token 
                    // and signed request each expire
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;

                } else if (response.status === 'not_authorized') {
                    // the user is logged in to Facebook, 
                    // but has not authenticated your app
                } else {
                    // the user isn't logged in to Facebook.
                }
            });*/
    }
})
'use strict';
angular.module('core.utils').factory('HttpInterceptor', /*@ngInject*/ function($q, $rootScope) {
    return {
        // optional method
        'request': function(config) {
            // do something on success
            return config;
        },
        // optional method
        'requestError': function(rejection) {
            // do something on error
            //if (canRecover(rejection)) {
            //return responseOrNewPromise
            //}
            return $q.reject(rejection);
        },
        // optional method
        'response': function(response) {
            // do something on success
            return response;
        },
        // optional method
        'responseError': function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                $rootScope.$emit('$Unauthorized', rejection.status);
            }
            // do something on error
            //if (canRecover(rejection)) {
            //return responseOrNewPromise
            //}
            return $q.reject(rejection);
        }
    }
})
'use strict';
/* jshint ignore:start */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var S,app,createFilterFor,name,_i,_j,_len,_len1,_ref,_ref1,__slice=[].slice;S=require("string");app=angular.module("string",[]);app.factory("string",function(){return S});createFilterFor=function(name,returnsStringObject){var filterName;filterName=S("string-"+name).camelize().toString();return app.filter(filterName,["string",function(S){return function(){var args,input,out,_ref;input=arguments[0],args=2<=arguments.length?__slice.call(arguments,1):[];out=(_ref=S(input))[name].apply(_ref,args);if(returnsStringObject){out=out.toString()}return out}}])};_ref=["between","camelize","capitalize","chompLeft","chompRight","collapseWhitespace","dasherize","decodeHTMLEntities","escapeHTML","ensureLeft","ensureRight","humanize","left","pad","padLeft","padRight","repeat","replaceAll","right","slugify","stripPunctuation","stripTags","times","toCSV","trim","trimLeft","trimRight","truncate","underscore","unescapeHTML"];for(_i=0,_len=_ref.length;_i<_len;_i++){name=_ref[_i];createFilterFor(name,true)}_ref1=["contains","count","endsWith","include","isAlpha","isAlphaNumeric","isEmpty","isLower","isNumeric","isUpper","lines","parseCSV","startsWith","toBoolean","toBool","toFloat","toInt","toInteger"];for(_j=0,_len1=_ref1.length;_j<_len1;_j++){name=_ref1[_j];createFilterFor(name,false)}},{string:2}],2:[function(require,module,exports){!function(){"use strict";var VERSION="1.7.0";var ENTITIES={};function initialize(object,s){if(s!==null&&s!==undefined){if(typeof s==="string")object.s=s;else object.s=s.toString()}else{object.s=s}object.orig=s;if(s!==null&&s!==undefined){if(object.__defineGetter__){object.__defineGetter__("length",function(){return object.s.length})}else{object.length=s.length}}else{object.length=-1}}function S(s){initialize(this,s)}var __nsp=String.prototype;var __sp=S.prototype={between:function(left,right){var s=this.s;var startPos=s.indexOf(left);var endPos=s.indexOf(right);var start=startPos+left.length;return new this.constructor(endPos>startPos?s.slice(start,endPos):"")},camelize:function(){var s=this.trim().s.replace(/(\-|_|\s)+(.)?/g,function(mathc,sep,c){return c?c.toUpperCase():""});return new this.constructor(s)},capitalize:function(){return new this.constructor(this.s.substr(0,1).toUpperCase()+this.s.substring(1).toLowerCase())},charAt:function(index){return this.s.charAt(index)},chompLeft:function(prefix){var s=this.s;if(s.indexOf(prefix)===0){s=s.slice(prefix.length);return new this.constructor(s)}else{return this}},chompRight:function(suffix){if(this.endsWith(suffix)){var s=this.s;s=s.slice(0,s.length-suffix.length);return new this.constructor(s)}else{return this}},collapseWhitespace:function(){var s=this.s.replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"");return new this.constructor(s)},contains:function(ss){return this.s.indexOf(ss)>=0},count:function(ss){var count=0,pos=this.s.indexOf(ss);while(pos>=0){count+=1;pos=this.s.indexOf(ss,pos+1)}return count},dasherize:function(){var s=this.trim().s.replace(/[_\s]+/g,"-").replace(/([A-Z])/g,"-$1").replace(/-+/g,"-").toLowerCase();return new this.constructor(s)},decodeHtmlEntities:function(){var s=this.s;s=s.replace(/&#(\d+);?/g,function(_,code){return String.fromCharCode(code)}).replace(/&#[xX]([A-Fa-f0-9]+);?/g,function(_,hex){return String.fromCharCode(parseInt(hex,16))}).replace(/&([^;\W]+;?)/g,function(m,e){var ee=e.replace(/;$/,"");var target=ENTITIES[e]||e.match(/;$/)&&ENTITIES[ee];if(typeof target==="number"){return String.fromCharCode(target)}else if(typeof target==="string"){return target}else{return m}});return new this.constructor(s)},endsWith:function(suffix){var l=this.s.length-suffix.length;return l>=0&&this.s.indexOf(suffix,l)===l},escapeHTML:function(){return new this.constructor(this.s.replace(/[&<>"']/g,function(m){return"&"+reversedEscapeChars[m]+";"}))},ensureLeft:function(prefix){var s=this.s;if(s.indexOf(prefix)===0){return this}else{return new this.constructor(prefix+s)}},ensureRight:function(suffix){var s=this.s;if(this.endsWith(suffix)){return this}else{return new this.constructor(s+suffix)}},humanize:function(){if(this.s===null||this.s===undefined)return new this.constructor("");var s=this.underscore().replace(/_id$/,"").replace(/_/g," ").trim().capitalize();return new this.constructor(s)},isAlpha:function(){return!/[^a-z\xC0-\xFF]/.test(this.s.toLowerCase())},isAlphaNumeric:function(){return!/[^0-9a-z\xC0-\xFF]/.test(this.s.toLowerCase())},isEmpty:function(){return this.s===null||this.s===undefined?true:/^[\s\xa0]*$/.test(this.s)},isLower:function(){return this.isAlpha()&&this.s.toLowerCase()===this.s},isNumeric:function(){return!/[^0-9]/.test(this.s)},isUpper:function(){return this.isAlpha()&&this.s.toUpperCase()===this.s},left:function(N){if(N>=0){var s=this.s.substr(0,N);return new this.constructor(s)}else{return this.right(-N)}},lines:function(){return this.replaceAll("\r\n","\n").s.split("\n")},pad:function(len,ch){if(ch==null)ch=" ";if(this.s.length>=len)return new this.constructor(this.s);len=len-this.s.length;var left=Array(Math.ceil(len/2)+1).join(ch);var right=Array(Math.floor(len/2)+1).join(ch);return new this.constructor(left+this.s+right)},padLeft:function(len,ch){if(ch==null)ch=" ";if(this.s.length>=len)return new this.constructor(this.s);return new this.constructor(Array(len-this.s.length+1).join(ch)+this.s)},padRight:function(len,ch){if(ch==null)ch=" ";if(this.s.length>=len)return new this.constructor(this.s);return new this.constructor(this.s+Array(len-this.s.length+1).join(ch))},parseCSV:function(delimiter,qualifier,escape,lineDelimiter){delimiter=delimiter||",";escape=escape||"\\";if(typeof qualifier=="undefined")qualifier='"';var i=0,fieldBuffer=[],fields=[],len=this.s.length,inField=false,self=this;var ca=function(i){return self.s.charAt(i)};if(typeof lineDelimiter!=="undefined")var rows=[];if(!qualifier)inField=true;while(i<len){var current=ca(i);switch(current){case escape:if(inField&&(escape!==qualifier||ca(i+1)===qualifier)){i+=1;fieldBuffer.push(ca(i));break}if(escape!==qualifier)break;case qualifier:inField=!inField;break;case delimiter:if(inField&&qualifier)fieldBuffer.push(current);else{fields.push(fieldBuffer.join(""));fieldBuffer.length=0}break;case lineDelimiter:if(inField){fieldBuffer.push(current)}else{if(rows){fields.push(fieldBuffer.join(""));rows.push(fields);fields=[];fieldBuffer.length=0}}break;default:if(inField)fieldBuffer.push(current);break}i+=1}fields.push(fieldBuffer.join(""));if(rows){rows.push(fields);return rows}return fields},replaceAll:function(ss,r){var s=this.s.split(ss).join(r);return new this.constructor(s)},right:function(N){if(N>=0){var s=this.s.substr(this.s.length-N,N);return new this.constructor(s)}else{return this.left(-N)}},setValue:function(s){initialize(this,s);return this},slugify:function(){var sl=new S(this.s.replace(/[^\w\s-]/g,"").toLowerCase()).dasherize().s;if(sl.charAt(0)==="-")sl=sl.substr(1);return new this.constructor(sl)},startsWith:function(prefix){return this.s.lastIndexOf(prefix,0)===0},stripPunctuation:function(){return new this.constructor(this.s.replace(/[^\w\s]|_/g,"").replace(/\s+/g," "))},stripTags:function(){var s=this.s,args=arguments.length>0?arguments:[""];multiArgs(args,function(tag){s=s.replace(RegExp("</?"+tag+"[^<>]*>","gi"),"")});return new this.constructor(s)},template:function(values,opening,closing){var s=this.s;var opening=opening||Export.TMPL_OPEN;var closing=closing||Export.TMPL_CLOSE;var open=opening.replace(/[-[\]()*\s]/g,"\\$&").replace(/\$/g,"\\$");var close=closing.replace(/[-[\]()*\s]/g,"\\$&").replace(/\$/g,"\\$");var r=new RegExp(open+"(.+?)"+close,"g");var matches=s.match(r)||[];matches.forEach(function(match){var key=match.substring(opening.length,match.length-closing.length);if(typeof values[key]!="undefined")s=s.replace(match,values[key])});return new this.constructor(s)},times:function(n){return new this.constructor(new Array(n+1).join(this.s))},toBoolean:function(){if(typeof this.orig==="string"){var s=this.s.toLowerCase();return s==="true"||s==="yes"||s==="on"}else return this.orig===true||this.orig===1},toFloat:function(precision){var num=parseFloat(this.s);if(precision)return parseFloat(num.toFixed(precision));else return num},toInt:function(){return/^\s*-?0x/i.test(this.s)?parseInt(this.s,16):parseInt(this.s,10)},trim:function(){var s;if(typeof __nsp.trim==="undefined")s=this.s.replace(/(^\s*|\s*$)/g,"");else s=this.s.trim();return new this.constructor(s)},trimLeft:function(){var s;if(__nsp.trimLeft)s=this.s.trimLeft();else s=this.s.replace(/(^\s*)/g,"");return new this.constructor(s)},trimRight:function(){var s;if(__nsp.trimRight)s=this.s.trimRight();else s=this.s.replace(/\s+$/,"");return new this.constructor(s)},truncate:function(length,pruneStr){var str=this.s;length=~~length;pruneStr=pruneStr||"...";if(str.length<=length)return new this.constructor(str);var tmpl=function(c){return c.toUpperCase()!==c.toLowerCase()?"A":" "},template=str.slice(0,length+1).replace(/.(?=\W*\w*$)/g,tmpl);if(template.slice(template.length-2).match(/\w\w/))template=template.replace(/\s*\S+$/,"");else template=new S(template.slice(0,template.length-1)).trimRight().s;return(template+pruneStr).length>str.length?new S(str):new S(str.slice(0,template.length)+pruneStr)},toCSV:function(){var delim=",",qualifier='"',escape="\\",encloseNumbers=true,keys=false;var dataArray=[];function hasVal(it){return it!==null&&it!==""}if(typeof arguments[0]==="object"){delim=arguments[0].delimiter||delim;delim=arguments[0].separator||delim;qualifier=arguments[0].qualifier||qualifier;encloseNumbers=!!arguments[0].encloseNumbers;escape=arguments[0].escape||escape;keys=!!arguments[0].keys}else if(typeof arguments[0]==="string"){delim=arguments[0]}if(typeof arguments[1]==="string")qualifier=arguments[1];if(arguments[1]===null)qualifier=null;if(this.orig instanceof Array)dataArray=this.orig;else{for(var key in this.orig)if(this.orig.hasOwnProperty(key))if(keys)dataArray.push(key);else dataArray.push(this.orig[key])}var rep=escape+qualifier;var buildString=[];for(var i=0;i<dataArray.length;++i){var shouldQualify=hasVal(qualifier);if(typeof dataArray[i]=="number")shouldQualify&=encloseNumbers;if(shouldQualify)buildString.push(qualifier);if(dataArray[i]!==null&&dataArray[i]!==undefined){var d=new S(dataArray[i]).replaceAll(qualifier,rep).s;buildString.push(d)}else buildString.push("");if(shouldQualify)buildString.push(qualifier);if(delim)buildString.push(delim)}buildString.length=buildString.length-1;return new this.constructor(buildString.join(""))},toString:function(){return this.s},underscore:function(){var s=this.trim().s.replace(/([a-z\d])([A-Z]+)/g,"$1_$2").replace(/[-\s]+/g,"_").toLowerCase();if(new S(this.s.charAt(0)).isUpper()){s="_"+s}return new this.constructor(s)},unescapeHTML:function(){return new this.constructor(this.s.replace(/\&([^;]+);/g,function(entity,entityCode){var match;if(entityCode in escapeChars){return escapeChars[entityCode]}else if(match=entityCode.match(/^#x([\da-fA-F]+)$/)){return String.fromCharCode(parseInt(match[1],16))}else if(match=entityCode.match(/^#(\d+)$/)){return String.fromCharCode(~~match[1])}else{return entity}}))},valueOf:function(){return this.s.valueOf()}};var methodsAdded=[];function extendPrototype(){for(var name in __sp){(function(name){var func=__sp[name];if(!__nsp.hasOwnProperty(name)){methodsAdded.push(name);__nsp[name]=function(){String.prototype.s=this;return func.apply(this,arguments)}}})(name)}}function restorePrototype(){for(var i=0;i<methodsAdded.length;++i)delete String.prototype[methodsAdded[i]];methodsAdded.length=0}var nativeProperties=getNativeStringProperties();for(var name in nativeProperties){(function(name){var stringProp=__nsp[name];if(typeof stringProp=="function"){if(!__sp[name]){if(nativeProperties[name]==="string"){__sp[name]=function(){return new this.constructor(stringProp.apply(this,arguments))}}else{__sp[name]=stringProp}}}})(name)}__sp.repeat=__sp.times;__sp.include=__sp.contains;__sp.toInteger=__sp.toInt;__sp.toBool=__sp.toBoolean;__sp.decodeHTMLEntities=__sp.decodeHtmlEntities;__sp.constructor=S;function getNativeStringProperties(){var names=getNativeStringPropertyNames();var retObj={};for(var i=0;i<names.length;++i){var name=names[i];var func=__nsp[name];try{var type=typeof func.apply("teststring",[]);retObj[name]=type}catch(e){}}return retObj}function getNativeStringPropertyNames(){var results=[];if(Object.getOwnPropertyNames){results=Object.getOwnPropertyNames(__nsp);results.splice(results.indexOf("valueOf"),1);results.splice(results.indexOf("toString"),1);return results}else{var stringNames={};var objectNames=[];for(var name in String.prototype)stringNames[name]=name;for(var name in Object.prototype)delete stringNames[name];for(var name in stringNames){results.push(name)}return results}}function Export(str){return new S(str)}Export.extendPrototype=extendPrototype;Export.restorePrototype=restorePrototype;Export.VERSION=VERSION;Export.TMPL_OPEN="{{";Export.TMPL_CLOSE="}}";Export.ENTITIES=ENTITIES;if(typeof module!=="undefined"&&typeof module.exports!=="undefined"){module.exports=Export}else{if(typeof define==="function"&&define.amd){define([],function(){return Export})}else{window.S=Export}}function multiArgs(args,fn){var result=[],i;for(i=0;i<args.length;i++){result.push(args[i]);if(fn)fn.call(args,args[i],i)}return result}var escapeChars={lt:"<",gt:">",quot:'"',apos:"'",amp:"&"};var reversedEscapeChars={};for(var key in escapeChars){reversedEscapeChars[escapeChars[key]]=key}ENTITIES={amp:"&",gt:">",lt:"<",quot:'"',apos:"'",AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,aelig:230,agrave:224,aring:229,atilde:227,auml:228,ccedil:231,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,iacute:237,icirc:238,igrave:236,iuml:239,ntilde:241,oacute:243,ocirc:244,ograve:242,oslash:248,otilde:245,ouml:246,szlig:223,thorn:254,uacute:250,ucirc:251,ugrave:249,uuml:252,yacute:253,yuml:255,copy:169,reg:174,nbsp:160,iexcl:161,cent:162,pound:163,curren:164,yen:165,brvbar:166,sect:167,uml:168,ordf:170,laquo:171,not:172,shy:173,macr:175,deg:176,plusmn:177,sup1:185,sup2:178,sup3:179,acute:180,micro:181,para:182,middot:183,cedil:184,ordm:186,raquo:187,frac14:188,frac12:189,frac34:190,iquest:191,times:215,divide:247,"OElig;":338,"oelig;":339,"Scaron;":352,"scaron;":353,"Yuml;":376,"fnof;":402,"circ;":710,"tilde;":732,"Alpha;":913,"Beta;":914,"Gamma;":915,"Delta;":916,"Epsilon;":917,"Zeta;":918,"Eta;":919,"Theta;":920,"Iota;":921,"Kappa;":922,"Lambda;":923,"Mu;":924,"Nu;":925,"Xi;":926,"Omicron;":927,"Pi;":928,"Rho;":929,"Sigma;":931,"Tau;":932,"Upsilon;":933,"Phi;":934,"Chi;":935,"Psi;":936,"Omega;":937,"alpha;":945,"beta;":946,"gamma;":947,"delta;":948,"epsilon;":949,"zeta;":950,"eta;":951,"theta;":952,"iota;":953,"kappa;":954,"lambda;":955,"mu;":956,"nu;":957,"xi;":958,"omicron;":959,"pi;":960,"rho;":961,"sigmaf;":962,"sigma;":963,"tau;":964,"upsilon;":965,"phi;":966,"chi;":967,"psi;":968,"omega;":969,"thetasym;":977,"upsih;":978,"piv;":982,"ensp;":8194,"emsp;":8195,"thinsp;":8201,"zwnj;":8204,"zwj;":8205,"lrm;":8206,"rlm;":8207,"ndash;":8211,"mdash;":8212,"lsquo;":8216,"rsquo;":8217,"sbquo;":8218,"ldquo;":8220,"rdquo;":8221,"bdquo;":8222,"dagger;":8224,"Dagger;":8225,"bull;":8226,"hellip;":8230,"permil;":8240,"prime;":8242,"Prime;":8243,"lsaquo;":8249,"rsaquo;":8250,"oline;":8254,"frasl;":8260,"euro;":8364,"image;":8465,"weierp;":8472,"real;":8476,"trade;":8482,"alefsym;":8501,"larr;":8592,"uarr;":8593,"rarr;":8594,"darr;":8595,"harr;":8596,"crarr;":8629,"lArr;":8656,"uArr;":8657,"rArr;":8658,"dArr;":8659,"hArr;":8660,"forall;":8704,"part;":8706,"exist;":8707,"empty;":8709,"nabla;":8711,"isin;":8712,"notin;":8713,"ni;":8715,"prod;":8719,"sum;":8721,"minus;":8722,"lowast;":8727,"radic;":8730,"prop;":8733,"infin;":8734,"ang;":8736,"and;":8743,"or;":8744,"cap;":8745,"cup;":8746,"int;":8747,"there4;":8756,"sim;":8764,"cong;":8773,"asymp;":8776,"ne;":8800,"equiv;":8801,"le;":8804,"ge;":8805,"sub;":8834,"sup;":8835,"nsub;":8836,"sube;":8838,"supe;":8839,"oplus;":8853,"otimes;":8855,"perp;":8869,"sdot;":8901,"lceil;":8968,"rceil;":8969,"lfloor;":8970,"rfloor;":8971,"lang;":9001,"rang;":9002,"loz;":9674,"spades;":9824,"clubs;":9827,"hearts;":9829,"diams;":9830}}.call(this)},{}]},{},[1]);
/* jshint ignore:end */
'use strict';
angular.module('core.menu').controller('MenuAvatarCtrl', /*@ngInject*/ function($rootScope, $scope) {
    var vm = this;
    vm.picture = '';
    if ($scope.gender === 'female') $scope.gender = 'f';
    if ($scope.gender === 'male') $scope.gender = 'm';
    vm.picture = '/assets/images/avatar-m.jpg';
    if ($scope.gender) vm.picture = '/assets/images/avatar-' + $scope.gender.toLowerCase() + '.jpg';
    if ($scope.facebook) vm.picture = 'https://graph.facebook.com/' + $scope.facebook + '/picture?width=150';
});
'use strict';
angular.module('core.menu').directive('menuAvatar', /*@ngInject*/ function() {
    return {
        scope: {          
            firstName: '=',
            lastName: '=',
            facebook: '=',
            gender: '='
        },
        restrict: 'EA',
        controller: 'MenuAvatarCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/page/menu/avatar/menuAvatar.tpl.html'
    }
});
'use strict';
angular.module('core.page').controller('ToolbarMenuCtrl', /*@ngInject*/ function($rootScope, $mdBottomSheet) {
    var vm = this;
    $rootScope.$on('AppMenuOpened', function() {
        $mdBottomSheet.hide();
    });
    $rootScope.$on('CompanyIdUpdated', function() {
        $mdBottomSheet.hide();
    });
    vm.showFilters = function() {
        $mdBottomSheet.show({
            templateUrl: 'app/finder/filter/finderFilterMobile.tpl.html',
            controller: 'FinderFilterCtrl',
            controllerAs: 'vm',
            //targetEvent: $event,
            //parent: '.finder-wrapper',
            locals: {},
            //scope: ''
            //preserveScope: true,
            disableParentScroll: false
        }).then(function() {});
    }
    //
    // Events
    //
    //
    // Bootstrap
    //
    //
    bootstrap();

    function bootstrap() {}
})
'use strict';
angular.module('core.page').directive('toolbarMenu', /*@ngInject*/ function toolbarMenu($menu) {
    return {
        templateUrl: "core/page/toolbar/menu/toolbarMenu.tpl.html",
        scope: {
            company: '='
        },
        controller: 'ToolbarMenuCtrl',
        controllerAs: 'vm',
        link: function(scope) {
            scope.menu = $menu.toolbar;
        }
    }
})
'use strict';
angular.module('core.page').directive('toolbarTitle', /*@ngInject*/ function($app) {
    return {
        templateUrl: function() {
            return $app.toolbarTitleUrl;
        }
    }
});
'use strict';
/**
 * @ngdoc object
 * @name core.utils.controller:AddrFormCtrl
 * @description 
 * @requires $scope
 * @requires core.utils.factory:$utils
 * @requires $http
 * @requires $page
 * @requires api
 **/
angular.module('core.utils').controller('AddrFormCtrl', /*@ngInject*/ function($scope, $utils, $http, $page, api) {
    var vm = this;
    vm.endpointCepUrl = api.url + '/api/cep/';
    vm.states = $utils.brStates();
    vm.save = save;
    vm.busy = false;
    if (!$scope.handleForm)
        $scope.handleForm = {};
    if (!$scope.endpointParams)
        $scope.endpointParams = {};
    $scope.$watch('ngModel', function(nv, ov) {
        if (nv != ov) {
            $scope.handleForm.$dirty = true;
        }
    }, true);

    function save() {
        if ($scope.endpointUrl) {
            vm.busy = true;
            $http
                .put($scope.endpointUrl, angular.extend($scope.ngModel, $scope.endpointParams))
                .success(function(response) {
                    vm.busy = false;
                    delete response.type;
                    $scope.handleForm.$dirty = false;
                    $page.toast('Seu endereço foi atualizado');
                    if ($scope.callbackSuccess && typeof $scope.callbackSuccess === 'function')
                        $scope.callbackSuccess(response);
                })
                .error(function() {
                    vm.busy = false;
                });
        }
    }
})
'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:addrForm
 * @restrict EA
 * @description
 * Componente para formularios de endereço
 * @element 
 * div
 * @param {object} ngModel model do endereço
 * @param {object} handleForm model para reter os estados do form
 * @param {string} endpointUrl endereço do server para postagem dos dados
 * @param {object} endpointParams parametros a serem enviados ao server
 * @param {function} callbackSuccess callback de sucesso
 **/
angular.module('core.utils').directive('addrForm', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            handleForm: '=',
            endpointUrl: '@',
            endpointParams: '=',
            callbackSuccess: '='
        },
        controller: 'AddrFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/addrForm/addrForm.tpl.html',
        replace: true,
        restrict: 'EA'
    }
})
'use strict';
angular.module('core.utils').controller('CeperCtrl', /*@ngInject*/ function($scope, $http, $page) {
    var vm = this;
    vm.busy = false;
    vm.get = get;

    if (!$scope.address || typeof $scope.address != 'object')
        $scope.address = {};

    function get() {
        var cep = $scope.ngModel;
        if (cep && cep.toString().length === 8) {
            var url = $scope.endpointUrl
            vm.busy = true;
            var onSuccess = function(response) {
                vm.busy = false;
                var addr = response.data;
                if (addr.city || addr.state) {
                    $scope.address.street = addr.street;
                    $scope.address.district = addr.district;
                    $scope.address.city = addr.city;
                    $scope.address.state = addr.state;
                } else {
                    error();
                }
            }
            var onError = function(response) {
                vm.busy = false;
                error();
            }
            $http.get(url + cep, {}).then(onSuccess, onError);
        }

        function error() {
            return $page.toast('Não foi possível encontrar o endereço com este cep, por favor insira manualmente', 10000, 'top right');
        }
    }
});
'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:ceper
 * @restrict EA
 * @description
 * Input para auto busca de cep
 * @element div
 * @param {object} ngModel model qye representa o campo numerico do cep
 * @param {object} address model que representa os campos de endereço (street, district, city, state)
 * @param {string} endpointUrl endereço do server que deverá responder o json no formato esperado
 **/
angular.module('core.utils').directive('ceper', /*@ngInject*/ function($rootScope, $timeout) {
    return {
        scope: {
            ngModel: '=',
            address: '=',
            templateUrl: '=',
            endpointUrl: '@'
        },
        replace: true,
        restrict: 'EA',
        controller: 'CeperCtrl',
        controllerAs: 'vm',
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/utils/directives/ceper/ceper.tpl.html';
        },
        link: function(scope, elem, attr) {
            $rootScope.$on('CeperFocus', function() {
                $timeout(function() {
                    elem.find('input').focus();
                })
            })
        }
    }
});
'use strict';
angular.module('core.utils').directive('angularChartsEvent', /*@ngInject*/ function($timeout) {
    return {
        restrict: 'EA',
        link: /*@ngInject*/ function($scope) {
            $timeout(function() {
                $scope.$emit('reset');
            }, 5000)
        }
    }
});
'use strict';
angular.module('core.utils').controller('CompanyChooserCtrl', /*@ngInject*/ function($rootScope, $scope, $user, $auth, lodash) {
    var vm = this,
        _ = lodash;
    vm.companyid = $scope.companyid;
    //external scope databind
    $scope.$watch('companyid', function(nv, ov) {
        if (nv != ov) {
            vm.companyid = nv;
        }
        addAllOption();
    });
    //internal scope databind
    $scope.$watch('vm.companyid', function(nv, ov) {
        if (nv != ov) {
            $scope.companyid = nv;
            $rootScope.$emit('$CompanyIdUpdated', nv, ov);
        }
    });
    //
    // Add options for all companies
    // https://github.com/esgrupo/livejob/issues/23
    //
    function addAllOption() {
        if ($scope.showAllOption && $user.instance().role && $user.instance().role.length > 1) {
            var allcompanies = [],
                already = _.findIndex($scope.companies, function(row) {
                    return row.company.name === 'Todas Empresas';
                });
            if (already === -1) {
                $user.instance().current('companies').forEach(function(row) {
                    allcompanies.push(row.company._id)
                })
                $scope.companies.push({
                    company: {
                        name: 'Todas Empresas',
                        _id: allcompanies
                    }
                });
            }
        }
    }
});
'use strict';
angular.module('core.utils').directive('companyChooser', /*@ngInject*/ function() {
    return {
        scope: {
            companyid: '=',
            companies: '=',
            hideMe: '=',
            placeholder: '=',
            showAllOption: '=' //mostrar opção "todas empresas"
        },
        replace: true,
        restrict: 'EA',
        controller: 'CompanyChooserCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/companyChooser/companyChooser.tpl.html'
    }
});
'use strict';
/**
 * @ngdoc object
 * @name core.utils.controller:ContactFormCtrl
 * @description 
 * @requires $scope
 * @requires $http
 * @requires $page
 * @requires api
 **/
angular.module('core.utils').controller('ContactFormCtrl', /*@ngInject*/ function($scope, $http, $page, api) {
    var vm = this;
    vm.save = save;
    vm.busy = false;
    if (!$scope.handleForm)
        $scope.handleForm = {};

    $scope.$watch('ngModel', function(nv, ov) {
        if (nv != ov) {
            $scope.handleForm.$dirty = true;
        }
    }, true)

    function save() {
        if ($scope.endpointUrl) {
            vm.busy = true;
            $http
                .put($scope.endpointUrl, $scope.ngModel)
                .success(function(response) {
                    vm.busy = false;
                    $scope.handleForm.$dirty = false;
                    $page.toast('Seu contato foi atualizado');
                    if ($scope.callbackSuccess && typeof $scope.callbackSuccess === 'function')
                        $scope.callbackSuccess(response);
                })
                .error(function() {
                    vm.busy = false;
                });
        }
    }
})
'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:contactForm
 * @restrict EA
 * @description
 * Componente para formularios de contato
 * @element 
 * div
 * @param {object} ngModel model do contato
 * @param {object} handleForm model para reter estados do form
 * @param {string} endpointUrl endereço do servidor api
 * @param {function} callbackSuccess callback de sucesso
 **/
angular.module('core.utils').directive('contactForm', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            handleForm: '=',
            endpointUrl: '@',
            callbackSuccess: '='
        },
        controller: 'ContactFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/contactForm/contactForm.tpl.html',
        replace: true,
        restrict: 'EA'
    }
})
'use strict';
//https://github.com/sparkalow/angular-count-to
angular.module('core.utils').directive('countTo', /*@ngInject*/ function($timeout, $filter) {
    return {
        replace: false,
        scope: true,
        link: function(scope, element, attrs) {
            var e = element[0];
            var num, refreshInterval, duration, steps, step, countTo, value, increment, currency;
            var calculate = function() {
                refreshInterval = 30;
                step = 0;
                scope.timoutId = null;
                countTo = parseInt(attrs.countTo) || 0;
                scope.value = parseInt(attrs.value, 10) || 0;
                duration = (parseFloat(attrs.duration) * 1000) || 0;
                steps = Math.ceil(duration / refreshInterval);
                increment = ((countTo - scope.value) / steps);
                num = scope.value;   
                currency = attrs.currency;         
            }
            var tick = function() {
                scope.timoutId = $timeout(function() {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(scope.timoutId);
                        num = countTo;
                        if (!currency) e.textContent = countTo;
                        else e.textContent = $filter('currency')(countTo);
                    } else {
                        e.textContent = Math.round(num);
                        tick();
                    }
                }, refreshInterval);
            }
            var start = function() {
                if (scope.timoutId) {
                    $timeout.cancel(scope.timoutId);
                }
                calculate();
                tick();
            }
            attrs.$observe('countTo', function(val) {
                if (val) {
                    start();
                }
            });
            attrs.$observe('value', function(val) {
                start();
            });
            return true;
        }
    }
});
'use strict';
angular.module('core.utils').directive('dashboardStats', /*@ngInject*/ function() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            data: '=',
            url: '=',
            post: '='
        },
        templateUrl: 'core/utils/directives/dashboardStats/dashboardStats.tpl.html',
        link: function() {},
        controller: /*@ngInject*/ function($scope, $http) {
            bootstrap();
            $scope.update = update;
            $scope.$watch('post', function(nv, ov) {
                if (nv != ov) {
                    bootstrap();
                }
            }, true);

            function bootstrap() {
                $scope.loading = true;
                var onSuccess = function(response) {
                    $scope.loading = false;
                    for (var k in response.data) {
                        if (response.data.hasOwnProperty(k)) {
                            $scope.data.forEach(function(row, i) {
                                if (row.slug === k) {
                                    $scope.data[i].value = response.data[k];
                                }
                            })
                        }
                    }
                }
                var onFail = function(response) {
                    $scope.loading = false;
                    $scope.error = response && response.data ? response.data : 'erro no servidor';
                }
                $http.post($scope.url, $scope.post).then(onSuccess, onFail);
            }

            function update() {
                bootstrap();
            }
        }
    }
})
'use strict';
angular.module('core.utils').directive('focus', /*@ngInject*/ function() {
    return {
        scope: {
            focus: '=',
            focusWhen: '='
        },
        restrict: 'A',
        link: function(scope, elem) {
            elem.focus();
            scope.$watch('focusWhen', function(nv, ov) {
                if (nv && nv != ov) {
                    elem.focus();
                }
            });
            // if (scope.focus)
            //     elem.focus();
        }
    }
})
'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:imageCutter
 * @restrict EA
 * @description
 * Cortador de imagens praparado para trabalhar com backend
 * @element a
 * @param {string} endpointUrl endereço do server
 * @param {object} endpointParams parâmetros adicionais enviado ao server
 * @param {function} endpointSuccess callback para sucesso
 * @param {function} endpointFail callback para falha
 * @param {bool} cutOnModal utilizar em modo md-dialog
 * @param {string} cutOnModalTitle título do md-dialog
 * @param {integer} cutWidth tamanho do corte
 * @param {integer} cutHeight altura do corte
 * @param {string} cutShape formato do corte (circle|square)
 * @param {string} cutLabel nome do botão cortar
 * @param {var} cutResult resultado do corte (base64)
 * @param {var} cutStep passo atual do corte (1|2|3)
 **/
angular.module('core.utils').directive('imageCutter', /*@ngInject*/ function($mdDialog, $http, $rootScope) {
    return {
        scope: {
            endpointUrl: '@',
            endpointParams: '=',
            endpointSuccess: '=',
            endpointFail: '=',
            cutOnModal: '@',
            cutOnModalTitle: '@',
            cutWidth: '@',
            cutHeight: '@',
            cutShape: '@',
            cutLabel: '@',
            cutResult: '=',
            cutStep: '=',
            cutText: '@'
        },
        replace: true,
        transclude: true,
        restrict: 'EA',
        templateUrl: 'core/utils/directives/imageCutter/imageCutter.tpl.html',
        controller: 'ImageCutterAreaCtrl',
        link: function($scope, $elem) {
            $scope.modal = modal;
            $scope.hide = hide;
            $scope.$watch('cutStep', function(nv, ov) {
                if (nv != ov) {
                    /**
                     * Passo 3 - corte
                     */
                    if (nv === 3) {
                        /**
                         * Enviar para o server
                         */
                        if ($scope.cutOnModal) $scope.send()
                    }
                }
            })

            function modal(ev) {
                //
                // reset
                //
                reboot();
                //
                // open dialog
                //
                $mdDialog.show({
                    templateUrl: 'core/utils/directives/imageCutter/modal.tpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    scope: $scope, // use parent scope in template
                    preserveScope: true,
                    controller: /*@ngInject*/ function($scope, setting) {
                        $scope.setting = function() {
                            return setting;
                        }
                    }
                });
            }

            function hide() {
                $mdDialog.hide();
            }

            function toggleOpacity() {
                $scope.$emit('ImageCutterToggleOpacity')
            }

            function toggleBusy() {
                $scope.$emit('ImageCutterToggleBusy')
            }

            function reboot() {
                $scope.$emit('ImageCutterReboot')
            }
        }
    }
});
'use strict';
angular.module('core.utils').directive('infiniteScroll', /*@ngInject*/ function infiniteScroll() {
    return {
        restrict: "EA",
        link: function infiniteScrollLink($scope, $element) {
            var e = $element[0];
            $element.bind('scroll', function() {
                if (e.scrollTop + e.offsetHeight >= e.scrollHeight - 10) {
                    $scope.$emit('ScreenBottomReached');
                }
            })
        }
    }
})
'use strict';
angular.module('core.utils').controller('LeadFormCtrl', /*@ngInject*/ function($scope, $http, $page, $timeout, lodash, api) {
    var vm = this,
        _ = lodash;
    $scope.lead = {};
    $scope.register = function() {
        vm.busy = true;
        var onSuccess = function() {
            vm.busy = false;
            var name = $scope.lead.name ? $scope.lead.name : '';
            $page.toast(name + ' seu contato foi enviado, agradecemos o interesse.', 10000);
            $timeout(function() {
                $scope.lead = {};
            }, 500)
        }
        var onFail = function(response) {
            vm.busy = false;
            $page.toast(response.error ? response.error : response);
        }
        $http.post(api.url + '/api/leads', $scope.lead).success(onSuccess).error(onFail);
    }

    $scope.isDisabled = function(fieldName) {
        return _.indexOf($scope.dont, fieldName) < 0 ? false : true;
    }
});
'use strict';
angular.module('core.utils').directive('leadForm', /*@ngInject*/ function() {
    return {
        scope: {
            label: '@',
            dont: '=',
            templateUrl: '='
        },
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/utils/directives/leadForm/leadForm.tpl.html';
        },
        controller: 'LeadFormCtrl',
        controllerAs: 'vm',
        replace: true
    }
})
'use strict';
angular.module('core.utils').controller('LiveChipsCtrl', /*@ngInject*/ function($scope, $rootScope) {
    var vm = this;
    vm.applyRole = applyRole;
    vm.selectedItem = '';
    vm.searchText = '';
    vm.querySearch = querySearch;
    vm.items = $scope.items.length ? $scope.items : [];
    vm.placeholder = $scope.placeholder ? $scope.placeholder : '';
    //vm.selectedItems = [];
    vm.selectedItems = $scope.model ? $scope.model : [];
    //
    // Events
    //
    $rootScope.$on('FinderFilterFormChipsClean', function() {
            vm.selectedItems = [];
        })
        //
        // Watchers
        //
    $scope.$watch('vm.selectedItems', function(nv, ov) {
        if (nv != ov) {
            $scope.model = vm.selectedItems;
        }
    }, true)
    $scope.$watch('model', function(nv, ov) {
        if (nv != ov) {
            vm.selectedItems = $scope.model;
        }
    }, true)
    $scope.$watch('items', function(nv, ov) {
            if (nv != ov) {
                vm.items = $scope.items;
            }
        }, true)
        // $scope.$watchCollection('vm.items', function(nv, ov) {
        //     if (nv != ov) {
        //         console.log(nv)
        //         $scope.$emit('FinderFilterFormChipsItemsUpdated', nv);
        //     }
        // }, true)
        //
        // Bootstrap
        //
        //
    bootstrap();

    function bootstrap() {}
    /**
     * Search for items.
     */
    function querySearch(query) {
        var results = query ? vm.items.filter(createFilterFor(query)) : [];
        return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(vegetable) {
            return vegetable.toLowerCase().indexOf(lowercaseQuery) === 0;
        };
    }

    function applyRole(item, accordion) {
        if (vm.selectedItems.indexOf(item) == -1) {
            vm.selectedItems.push(item);
        }
        accordion.toggle(0);
    }
});
'use strict';
angular.module('core.utils').directive('liveChips', /*@ngInject*/ function() {
    return {
        scope: {
            items: '=',
            placeholder: '@',
            model: '=',
            hideOptions: '=',
            truncateInput: '=',
            truncateOptions: '='
        },
        controller: 'LiveChipsCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/liveChips/liveChips.tpl.html',

    }
});
'use strict';
/**
 * @ngdoc object
 * @name core.utils.controller:MoipCcFormCtrl
 * @description 
 * @requires $scope
 **/
angular.module('core.utils').controller('MoipCcFormCtrl', /*@ngInject*/ function($scope) {
    var vm = this;
    //
    // Lista de instituições para cartão de crédito
    //
    vm.cc = ['AmericanExpress', 'Diners', 'Mastercard', 'Hipercard', 'Hiper', 'Elo', 'Visa'];
    //
    // Lista de parcelas
    //
    $scope.parcels = $scope.parcels ? $scope.parcels : [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12];
    if (!$scope.handleForm) $scope.handleForm = {};
    $scope.$watch('ngModel', function(nv, ov) {
        if (nv != ov) {
            $scope.handleForm.$dirty = true;
        }
    }, true);
});
'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:moipCcForm
 * @restrict EA
 * @description
 * Componente para formularios de pagamento via Moip
 * @element 
 * div
 * @param {object} ngModel model do contato
 * @param {object} handleForm model para reter estados do form
 * @param {array} parcels array com a qtd de parcelas. ex: [1,2,3]
 **/
angular.module('core.utils').directive('moipCcForm', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            handleForm: '=',
            parcels: '='
        },
        controller: 'MoipCcFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/moipCcForm/moipCcForm.tpl.html',
        replace: true,
        restrict: 'EA'
    }
})
'use strict';
/* jshint undef: false, unused: false */
angular.module('core.utils').directive('onScrollApplyOpacity', /*@ngInject*/ function() {
    //
    // Essa diretiva é um hack pra resolver um bug de scroll nos botões de ação que contem wrapper com margin-top negativa
    //
    return {
        link: function(scope, elem) {
            elem.bind('scroll', function() {
                var element = angular.element(document.getElementsByClassName('content-action-wrapper')[0]);
                element.addClass('opacity-9');
                var timeout = setInterval(function() {
                    element.removeClass('opacity-9');
                    clearInterval(timeout);
                }, 1000);
            })
        }
    }
})
'use strict';
angular.module('core.utils').controller('OptOutCtrl', /*@ngInject*/ function($scope, $location, $mdDialog) {
    $scope.callAction = function(ev) {
        var confirm = $mdDialog.confirm().parent(angular.element(document.body)).title($scope.alertTitle).content($scope.alertInfo).ariaLabel($scope.alertTitle).ok($scope.alertOk).cancel($scope.alertCancel).targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.$emit('OptOutItemUnlinked', $scope.itemId);
        }, function() {});
    }
});
'use strict';
angular.module('core.utils').directive('optOut', /*@ngInject*/ function() {
    return {
        scope: {
            putLocation: '=',
            putParams: '=',
            putLabel: '=',
            alertTitle: '=',
            alertInfo: '=',
            alertOk: '=',
            alertCancel: '=',
            itemId: '=',
            itemImage: '=',
            itemTitle: '=',
            itemTitleTooltip: '=',
            itemLocation: '=',
            itemInfo: '='
        },
        templateUrl: 'core/utils/directives/optOut/optOut.tpl.html',
        controller: 'OptOutCtrl',
        controllerAs: 'vm',
        replace: true
    }
})
'use strict';
angular.module('core.utils').controller('ToolbarAvatarCtrl', /*@ngInject*/ function($location, $timeout) {
    var vm = this;
    vm.logout = logout;

    function logout() {
        $timeout(function() {
            $location.path('/logout/');
        }, 1200);
    }
})
'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:toolbarAvatar
 * @restrict EA
 * @description 
 * Avatar com menu para o md-toolbar
 * @element a
 * @param {string} firstName primeiro nome
 * @param {string} email email 
 * @param {string} facebook id do facebook
 * @param {array} menu lista de itens do menu
 **/
angular.module('core.utils').directive('toolbarAvatar', /*@ngInject*/ function() {
    return {
        scope: {
            firstName: '@',
            email: '@',
            facebook: '@',
            menu: '='
        },
        replace: true,
        //transclude: true,
        restrict: 'EA',
        templateUrl: 'core/utils/directives/toolbarAvatar/toolbarAvatar.tpl.html',
        controller: 'ToolbarAvatarCtrl',
        controllerAs: 'vm'
    }
});
'use strict';
angular.module('core.utils').directive('updateModelKeyEnter', /*@ngInject*/ function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModelCtrl) {
            elem.bind("keyup", function(e) {
                if (e.keyCode === 13) {
                    ngModelCtrl.$commitViewValue();
                }
            });
        }
    }
})
!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?b(require("../moment")):"function"==typeof define&&define.amd?define(["moment"],b):b(a.moment)}(this,function(a){"use strict";
//! moment.js locale configuration
//! locale : belarusian (be)
//! author : Dmitry Demidov : https://github.com/demidov91
//! author: Praleska: http://praleska.pro/
//! Author : Menelion Elensúle : https://github.com/Oire
function b(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function c(a,c,d){var e={mm:c?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:c?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===d?c?"хвіліна":"хвіліну":"h"===d?c?"гадзіна":"гадзіну":a+" "+b(e[d],+a)}function d(a,b){var c={nominative:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),accusative:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function e(a,b){var c={nominative:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),accusative:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")},d=/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}
//! moment.js locale configuration
//! locale : breton (br)
//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou
function f(a,b,c){var d={mm:"munutenn",MM:"miz",dd:"devezh"};return a+" "+i(d[c],a)}function g(a){switch(h(a)){case 1:case 3:case 4:case 5:case 9:return a+" bloaz";default:return a+" vloaz"}}function h(a){return a>9?h(a%10):a}function i(a,b){return 2===b?j(a):a}function j(a){var b={m:"v",b:"v",d:"z"};return void 0===b[a.charAt(0)]?a:b[a.charAt(0)]+a.substring(1)}
//! moment.js locale configuration
//! locale : bosnian (bs)
//! author : Nedim Cholich : https://github.com/frontyard
//! based on (hr) translation by Bojan Marković
function k(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function l(a){return a>1&&5>a&&1!==~~(a/10)}function m(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekund":"pár sekundami";case"m":return b?"minuta":d?"minutu":"minutou";case"mm":return b||d?e+(l(a)?"minuty":"minut"):e+"minutami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(l(a)?"hodiny":"hodin"):e+"hodinami";break;case"d":return b||d?"den":"dnem";case"dd":return b||d?e+(l(a)?"dny":"dní"):e+"dny";break;case"M":return b||d?"měsíc":"měsícem";case"MM":return b||d?e+(l(a)?"měsíce":"měsíců"):e+"měsíci";break;case"y":return b||d?"rok":"rokem";case"yy":return b||d?e+(l(a)?"roky":"let"):e+"lety"}}
//! moment.js locale configuration
//! locale : austrian german (de-at)
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
//! author : Martin Groller : https://github.com/MadMG
function n(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : german (de)
//! author : lluchs : https://github.com/lluchs
//! author: Menelion Elensúle: https://github.com/Oire
function o(a,b,c,d){var e={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?e[c][0]:e[c][1]}
//! moment.js locale configuration
//! locale : estonian (et)
//! author : Henry Kehlmann : https://github.com/madhenry
//! improvements : Illimar Tambek : https://github.com/ragulka
function p(a,b,c,d){var e={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[a+" minuti",a+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[a+" tunni",a+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[a+" kuu",a+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[a+" aasta",a+" aastat"]};return b?e[c][2]?e[c][2]:e[c][1]:d?e[c][0]:e[c][1]}function q(a,b,c,d){var e="";switch(c){case"s":return d?"muutaman sekunnin":"muutama sekunti";case"m":return d?"minuutin":"minuutti";case"mm":e=d?"minuutin":"minuuttia";break;case"h":return d?"tunnin":"tunti";case"hh":e=d?"tunnin":"tuntia";break;case"d":return d?"päivän":"päivä";case"dd":e=d?"päivän":"päivää";break;case"M":return d?"kuukauden":"kuukausi";case"MM":e=d?"kuukauden":"kuukautta";break;case"y":return d?"vuoden":"vuosi";case"yy":e=d?"vuoden":"vuotta"}return e=r(a,d)+" "+e}function r(a,b){return 10>a?b?ya[a]:xa[a]:a}
//! moment.js locale configuration
//! locale : hrvatski (hr)
//! author : Bojan Marković : https://github.com/bmarkovic
function s(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}function t(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(d||b?" perc":" perce");case"mm":return e+(d||b?" perc":" perce");case"h":return"egy"+(d||b?" óra":" órája");case"hh":return e+(d||b?" óra":" órája");case"d":return"egy"+(d||b?" nap":" napja");case"dd":return e+(d||b?" nap":" napja");case"M":return"egy"+(d||b?" hónap":" hónapja");case"MM":return e+(d||b?" hónap":" hónapja");case"y":return"egy"+(d||b?" év":" éve");case"yy":return e+(d||b?" év":" éve")}return""}function u(a){return(a?"":"[múlt] ")+"["+Da[this.day()]+"] LT[-kor]"}
//! moment.js locale configuration
//! locale : Armenian (hy-am)
//! author : Armendarabyan : https://github.com/armendarabyan
function v(a,b){var c={nominative:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),accusative:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function w(a,b){var c="հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");return c[a.month()]}function x(a,b){var c="կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");return c[a.day()]}
//! moment.js locale configuration
//! locale : icelandic (is)
//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik
function y(a){return a%100===11?!0:a%10===1?!1:!0}function z(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return b?"mínúta":"mínútu";case"mm":return y(a)?e+(b||d?"mínútur":"mínútum"):b?e+"mínúta":e+"mínútu";case"hh":return y(a)?e+(b||d?"klukkustundir":"klukkustundum"):e+"klukkustund";case"d":return b?"dagur":d?"dag":"degi";case"dd":return y(a)?b?e+"dagar":e+(d?"daga":"dögum"):b?e+"dagur":e+(d?"dag":"degi");case"M":return b?"mánuður":d?"mánuð":"mánuði";case"MM":return y(a)?b?e+"mánuðir":e+(d?"mánuði":"mánuðum"):b?e+"mánuður":e+(d?"mánuð":"mánuði");case"y":return b||d?"ár":"ári";case"yy":return y(a)?e+(b||d?"ár":"árum"):e+(b||d?"ár":"ári")}}
//! moment.js locale configuration
//! locale : Georgian (ka)
//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili
function A(a,b){var c={nominative:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),accusative:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},d=/D[oD] *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function B(a,b){var c={nominative:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),accusative:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")},d=/(წინა|შემდეგ)/.test(b)?"accusative":"nominative";return c[d][a.day()]}
//! moment.js locale configuration
//! locale : Luxembourgish (lb)
//! author : mweimerskirch : https://github.com/mweimerskirch, David Raison : https://github.com/kwisatz
function C(a,b,c,d){var e={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return b?e[c][0]:e[c][1]}function D(a){var b=a.substr(0,a.indexOf(" "));return F(b)?"a "+a:"an "+a}function E(a){var b=a.substr(0,a.indexOf(" "));return F(b)?"viru "+a:"virun "+a}function F(a){if(a=parseInt(a,10),isNaN(a))return!1;if(0>a)return!0;if(10>a)return a>=4&&7>=a?!0:!1;if(100>a){var b=a%10,c=a/10;return F(0===b?c:b)}if(1e4>a){for(;a>=10;)a/=10;return F(a)}return a/=1e3,F(a)}function G(a,b,c,d){return b?"kelios sekundės":d?"kelių sekundžių":"kelias sekundes"}function H(a,b,c,d){return b?J(c)[0]:d?J(c)[1]:J(c)[2]}function I(a){return a%10===0||a>10&&20>a}function J(a){return Ea[a].split("_")}function K(a,b,c,d){var e=a+" ";return 1===a?e+H(a,b,c[0],d):b?e+(I(a)?J(c)[1]:J(c)[0]):d?e+J(c)[1]:e+(I(a)?J(c)[1]:J(c)[2])}function L(a,b){var c=-1===b.indexOf("dddd HH:mm"),d=Fa[a.day()];return c?d:d.substring(0,d.length-2)+"į"}function M(a,b,c){return c?b%10===1&&11!==b?a[2]:a[3]:b%10===1&&11!==b?a[0]:a[1]}function N(a,b,c){return a+" "+M(Ga[c],a,b)}function O(a,b,c){return M(Ga[c],a,b)}function P(a,b){return b?"dažas sekundes":"dažām sekundēm"}function Q(a){return 5>a%10&&a%10>1&&~~(a/10)%10!==1}function R(a,b,c){var d=a+" ";switch(c){case"m":return b?"minuta":"minutę";case"mm":return d+(Q(a)?"minuty":"minut");case"h":return b?"godzina":"godzinę";case"hh":return d+(Q(a)?"godziny":"godzin");case"MM":return d+(Q(a)?"miesiące":"miesięcy");case"yy":return d+(Q(a)?"lata":"lat")}}
//! moment.js locale configuration
//! locale : romanian (ro)
//! author : Vlad Gurdiga : https://github.com/gurdiga
//! author : Valentin Agachi : https://github.com/avaly
function S(a,b,c){var d={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},e=" ";return(a%100>=20||a>=100&&a%100===0)&&(e=" de "),a+e+d[c]}
//! moment.js locale configuration
//! locale : russian (ru)
//! author : Viktorminator : https://github.com/Viktorminator
//! Author : Menelion Elensúle : https://github.com/Oire
function T(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function U(a,b,c){var d={mm:b?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===c?b?"минута":"минуту":a+" "+T(d[c],+a)}function V(a,b){var c={nominative:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),accusative:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function W(a,b){var c={nominative:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),accusative:"янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function X(a,b){var c={nominative:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),accusative:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")},d=/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}function Y(a){return a>1&&5>a}function Z(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"pár sekúnd":"pár sekundami";case"m":return b?"minúta":d?"minútu":"minútou";case"mm":return b||d?e+(Y(a)?"minúty":"minút"):e+"minútami";break;case"h":return b?"hodina":d?"hodinu":"hodinou";case"hh":return b||d?e+(Y(a)?"hodiny":"hodín"):e+"hodinami";break;case"d":return b||d?"deň":"dňom";case"dd":return b||d?e+(Y(a)?"dni":"dní"):e+"dňami";break;case"M":return b||d?"mesiac":"mesiacom";case"MM":return b||d?e+(Y(a)?"mesiace":"mesiacov"):e+"mesiacmi";break;case"y":return b||d?"rok":"rokom";case"yy":return b||d?e+(Y(a)?"roky":"rokov"):e+"rokmi"}}
//! moment.js locale configuration
//! locale : slovenian (sl)
//! author : Robert Sedovšek : https://github.com/sedovsek
function $(a,b,c,d){var e=a+" ";switch(c){case"s":return b||d?"nekaj sekund":"nekaj sekundami";case"m":return b?"ena minuta":"eno minuto";case"mm":return e+=1===a?b?"minuta":"minuto":2===a?b||d?"minuti":"minutama":5>a?b||d?"minute":"minutami":b||d?"minut":"minutami";case"h":return b?"ena ura":"eno uro";case"hh":return e+=1===a?b?"ura":"uro":2===a?b||d?"uri":"urama":5>a?b||d?"ure":"urami":b||d?"ur":"urami";case"d":return b||d?"en dan":"enim dnem";case"dd":return e+=1===a?b||d?"dan":"dnem":2===a?b||d?"dni":"dnevoma":b||d?"dni":"dnevi";case"M":return b||d?"en mesec":"enim mesecem";case"MM":return e+=1===a?b||d?"mesec":"mesecem":2===a?b||d?"meseca":"mesecema":5>a?b||d?"mesece":"meseci":b||d?"mesecev":"meseci";case"y":return b||d?"eno leto":"enim letom";case"yy":return e+=1===a?b||d?"leto":"letom":2===a?b||d?"leti":"letoma":5>a?b||d?"leta":"leti":b||d?"let":"leti"}}
//! moment.js locale configuration
//! locale : ukrainian (uk)
//! author : zemlanin : https://github.com/zemlanin
//! Author : Menelion Elensúle : https://github.com/Oire
function _(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function aa(a,b,c){var d={mm:"хвилина_хвилини_хвилин",hh:"година_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===c?b?"хвилина":"хвилину":"h"===c?b?"година":"годину":a+" "+_(d[c],+a)}function ba(a,b){var c={nominative:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),accusative:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")},d=/D[oD]? *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function ca(a,b){var c={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},d=/(\[[ВвУу]\]) ?dddd/.test(b)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)?"genitive":"nominative";return c[d][a.day()]}function da(a){return function(){return a+"о"+(11===this.hours()?"б":"")+"] LT"}}
//! moment.js locale configuration
//! locale : afrikaans (af)
//! author : Werner Mollentze : https://github.com/wernerm
{var ea=(a.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(a){return/^nm$/i.test(a)},meridiem:function(a,b,c){return 12>a?c?"vm":"VM":c?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),a.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),fa={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},ga=(a.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return fa[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return ea[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),a.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}}),{1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"}),ha={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},ia=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&10>=a%100?3:a%100>=11?4:5},ja={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},ka=function(a){return function(b,c,d,e){var f=ia(b),g=ja[a][ia(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},la=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"],ma=(a.defineLocale("ar",{months:la,monthsShort:la,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"D/‏M/‏YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a,b,c){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:ka("s"),m:ka("m"),mm:ka("m"),h:ka("h"),hh:ka("h"),d:ka("d"),dd:ka("d"),M:ka("M"),MM:ka("M"),y:ka("y"),yy:ka("y")},preparse:function(a){return a.replace(/\u200f/g,"").replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return ha[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return ga[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}}),{1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"}),na=(a.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(a){return/^(gündüz|axşam)$/.test(a)},meridiem:function(a,b,c){return 4>a?"gecə":12>a?"səhər":17>a?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(a){if(0===a)return a+"-ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(ma[b]||ma[c]||ma[d])},week:{dow:1,doy:7}}),a.defineLocale("be",{months:d,monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:e,weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:c,mm:c,h:c,hh:c,d:"дзень",dd:c,M:"месяц",MM:c,y:"год",yy:c},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(a){return/^(дня|вечара)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночы":12>a?"раніцы":17>a?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a%10!==2&&a%10!==3||a%100===12||a%100===13?a+"-ы":a+"-і";case"D":return a+"-га";default:return a}},week:{dow:1,doy:7}}),a.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}}),{1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"}),oa={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"},pa=(a.defineLocale("bn",{months:"জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),weekdaysMin:"রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কএক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(a){return a.replace(/[১২৩৪৫৬৭৮৯০]/g,function(a){return oa[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return na[a]})},meridiemParse:/রাত|শকাল|দুপুর|বিকেল|রাত/,isPM:function(a){return/^(দুপুর|বিকেল|রাত)$/.test(a)},meridiem:function(a,b,c){return 4>a?"রাত":10>a?"শকাল":17>a?"দুপুর":20>a?"বিকেল":"রাত"},week:{dow:0,doy:6}}),{1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"}),qa={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"},ra=(a.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(a){return a.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(a){return qa[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return pa[a]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,isPM:function(a){return/^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(a)},meridiem:function(a,b,c){return 4>a?"མཚན་མོ":10>a?"ཞོགས་ཀས":17>a?"ཉིན་གུང":20>a?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}}),a.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY LT",LLLL:"dddd, D [a viz] MMMM YYYY LT"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:f,h:"un eur",hh:"%d eur",d:"un devezh",dd:f,M:"ur miz",MM:f,y:"ur bloaz",yy:g},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(a){var b=1===a?"añ":"vet";return a+b},week:{dow:1,doy:4}}),a.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:k,mm:k,h:k,hh:k,d:"dan",dd:k,M:"mjesec",MM:k,y:"godinu",yy:k},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),a.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(a,b){var c=1===a?"r":2===a?"n":3===a?"r":4===a?"t":"è";return("w"===b||"W"===b)&&(c="a"),a+c},week:{dow:1,doy:4}}),"leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_")),sa="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_"),ta=(a.defineLocale("cs",{months:ra,monthsShort:sa,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(ra,sa),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:m,m:m,mm:m,h:m,hh:m,d:m,dd:m,M:m,MM:m,y:m,yy:m},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("cv",{months:"кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав".split("_"),monthsShort:"кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кӗҫ_эрн_шӑм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кҫ_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]",LLL:"YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], LT",LLLL:"dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], LT"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ӗнер] LT [сехетре]",nextWeek:"[Ҫитес] dddd LT [сехетре]",lastWeek:"[Иртнӗ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(a){var b=/сехет$/i.exec(a)?"рен":/ҫул$/i.exec(a)?"тан":"ран";return a+b},past:"%s каялла",s:"пӗр-ик ҫеккунт",m:"пӗр минут",mm:"%d минут",h:"пӗр сехет",hh:"%d сехет",d:"пӗр кун",dd:"%d кун",M:"пӗр уйӑх",MM:"%d уйӑх",y:"пӗр ҫул",yy:"%d ҫул"},ordinalParse:/\d{1,2}-мӗш/,ordinal:"%d-мӗш",week:{dow:1,doy:7}}),a.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(a){var b=a,c="",d=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return b>20?c=40===b||50===b||60===b||80===b||100===b?"fed":"ain":b>0&&(c=d[b]),a+c},week:{dow:1,doy:4}}),a.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd [d.] D. MMMM YYYY LT"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:n,mm:"%d Minuten",h:n,hh:"%d Stunden",d:n,dd:n,M:n,MM:n,y:n,yy:n},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:o,mm:"%d Minuten",h:o,hh:"%d Stunden",d:o,dd:o,M:o,MM:o,y:o,yy:o},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(a,b){return/D/.test(b.substring(0,b.indexOf("MMMM")))?this._monthsGenitiveEl[a.month()]:this._monthsNominativeEl[a.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(a,b,c){return a>11?c?"μμ":"ΜΜ":c?"πμ":"ΠΜ"},isPM:function(a){return"μ"===(a+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(a,b){var c=this._calendarEl[a],d=b&&b.hours();return"function"==typeof c&&(c=c.apply(b)),c.replace("{}",d%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}}),a.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),a.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"D MMMM, YYYY",LLL:"D MMMM, YYYY LT",LLLL:"dddd, D MMMM, YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),a.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}}),a.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY LT",LLLL:"dddd, [la] D[-an de] MMMM, YYYY LT"},meridiemParse:/[ap]\.t\.m/i,isPM:function(a){return"p"===a.charAt(0).toLowerCase()},meridiem:function(a,b,c){return a>11?c?"p.t.m.":"P.T.M.":c?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}}),"Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_")),ua="Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),va=(a.defineLocale("es",{months:"Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?ua[a.month()]:ta[a.month()]},weekdays:"Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),a.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:p,m:p,mm:p,h:p,hh:p,d:p,dd:"%d päeva",M:p,MM:p,y:p,yy:p},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] LT",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] LT",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] LT",llll:"ddd, YYYY[ko] MMM D[a] LT"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"}),wa={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"},xa=(a.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),
weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(a){return/بعد از ظهر/.test(a)},meridiem:function(a,b,c){return 12>a?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(a){return a.replace(/[۰-۹]/g,function(a){return wa[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return va[a]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}}),"nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" ")),ya=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",xa[7],xa[8],xa[9]],za=(a.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] LT",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] LT",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] LT",llll:"ddd, Do MMM YYYY, [klo] LT"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:q,m:q,mm:q,h:q,hh:q,d:q,dd:q,M:q,MM:q,y:q,yy:q},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D. MMMM, YYYY LT"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")}}),a.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")},week:{dow:1,doy:4}}),"jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_")),Aa="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),Ba=(a.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Aa[a.month()]:za[a.month()]},weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),a.defineLocale("gl",{months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(a){return"uns segundos"===a?"nuns segundos":"en "+a},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:7}}),a.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY LT",LLLL:"dddd, D [ב]MMMM YYYY LT",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(a){return 2===a?"שעתיים":a+" שעות"},d:"יום",dd:function(a){return 2===a?"יומיים":a+" ימים"},M:"חודש",MM:function(a){return 2===a?"חודשיים":a+" חודשים"},y:"שנה",yy:function(a){return 2===a?"שנתיים":a%10===0&&10!==a?a+" שנה":a+" שנים"}}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Ca={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Da=(a.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Ca[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Ba[a]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात"===b?4>a?a:a+12:"सुबह"===b?a:"दोपहर"===b?a>=10?a:a+12:"शाम"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात":10>a?"सुबह":17>a?"दोपहर":20>a?"शाम":"रात"},week:{dow:0,doy:6}}),a.defineLocale("hr",{months:"siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),monthsShort:"sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:s,mm:s,h:s,hh:s,d:"dan",dd:s,M:"mjesec",MM:s,y:"godinu",yy:s},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),"vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ")),Ea=(a.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D., LT",LLLL:"YYYY. MMMM D., dddd LT"},meridiemParse:/de|du/i,isPM:function(a){return"u"===a.charAt(1).toLowerCase()},meridiem:function(a,b,c){return 12>a?c===!0?"de":"DE":c===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return u.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return u.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:t,m:t,mm:t,h:t,hh:t,d:t,dd:t,M:t,MM:t,y:t,yy:t},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),a.defineLocale("hy-am",{months:v,monthsShort:w,weekdays:x,weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., LT",LLLL:"dddd, D MMMM YYYY թ., LT"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(a){return/^(ցերեկվա|երեկոյան)$/.test(a)},meridiem:function(a){return 4>a?"գիշերվա":12>a?"առավոտվա":17>a?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(a,b){switch(b){case"DDD":case"w":case"W":case"DDDo":return 1===a?a+"-ին":a+"-րդ";default:return a}},week:{dow:1,doy:7}}),a.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"siang"===b?a>=11?a:a+12:"sore"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"siang":19>a?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),a.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd, D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:z,m:z,mm:z,h:"klukkustund",hh:z,d:z,dd:z,M:z,MM:z,y:z,yy:z},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"D_L_Ma_Me_G_V_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(a){return(/^[0-9].+$/.test(a)?"tra":"in")+" "+a},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),a.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"LTs秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日LT",LLLL:"YYYY年M月D日LT dddd"},meridiemParse:/午前|午後/i,isPM:function(a){return"午後"===a},meridiem:function(a,b,c){return 12>a?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}}),a.defineLocale("jv",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des".split("_"),weekdays:"Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu".split("_"),weekdaysShort:"Min_Sen_Sel_Reb_Kem_Jem_Sep".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sp".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/enjing|siyang|sonten|ndalu/,meridiemHour:function(a,b){return 12===a&&(a=0),"enjing"===b?a:"siyang"===b?a>=11?a:a+12:"sonten"===b||"ndalu"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"enjing":15>a?"siyang":19>a?"sonten":"ndalu"},calendar:{sameDay:"[Dinten puniko pukul] LT",nextDay:"[Mbenjang pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kala wingi pukul] LT",lastWeek:"dddd [kepengker pukul] LT",sameElse:"L"},relativeTime:{future:"wonten ing %s",past:"%s ingkang kepengker",s:"sawetawis detik",m:"setunggal menit",mm:"%d menit",h:"setunggal jam",hh:"%d jam",d:"sedinten",dd:"%d dinten",M:"sewulan",MM:"%d wulan",y:"setaun",yy:"%d taun"},week:{dow:1,doy:7}}),a.defineLocale("ka",{months:A,monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:B,weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(a){return/(წამი|წუთი|საათი|წელი)/.test(a)?a.replace(/ი$/,"ში"):a+"ში"},past:function(a){return/(წამი|წუთი|საათი|დღე|თვე)/.test(a)?a.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(a)?a.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(a){return 0===a?a:1===a?a+"-ლი":20>a||100>=a&&a%20===0||a%100===0?"მე-"+a:a+"-ე"},week:{dow:1,doy:7}}),a.defineLocale("km",{months:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[ថ្ងៃនៈ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}}),a.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 LT",LLLL:"YYYY년 MMMM D일 dddd LT"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(a){return"오후"===a},meridiem:function(a,b,c){return 12>a?"오전":"오후"}}),a.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:D,past:E,s:"e puer Sekonnen",m:C,mm:"%d Minutten",h:C,hh:"%d Stonnen",d:C,dd:"%d Deeg",M:C,MM:"%d Méint",y:C,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"}),Fa="sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_"),Ga=(a.defineLocale("lt",{months:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:L,weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], LT [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, LT [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], LT [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, LT [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:G,m:H,mm:K,h:H,hh:K,d:H,dd:K,M:H,MM:K,y:H,yy:K},ordinalParse:/\d{1,2}-oji/,ordinal:function(a){return a+"-oji"},week:{dow:1,doy:4}}),{m:"minūtes_minūtēm_minūte_minūtes".split("_"),mm:"minūtes_minūtēm_minūte_minūtes".split("_"),h:"stundas_stundām_stunda_stundas".split("_"),hh:"stundas_stundām_stunda_stundas".split("_"),d:"dienas_dienām_diena_dienas".split("_"),dd:"dienas_dienām_diena_dienas".split("_"),M:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),MM:"mēneša_mēnešiem_mēnesis_mēneši".split("_"),y:"gada_gadiem_gads_gadi".split("_"),yy:"gada_gadiem_gads_gadi".split("_")}),Ha=(a.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY.",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, LT",LLLL:"YYYY. [gada] D. MMMM, dddd, LT"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"pēc %s",past:"pirms %s",s:P,m:O,mm:N,h:O,hh:N,d:O,dd:N,M:O,MM:N,y:O,yy:N},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["jedan minut","jednog minuta"],mm:["minut","minuta","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mjesec","mjeseca","mjeseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=Ha.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Ha.correctGrammaticalCase(a,d)}}),Ia=(a.defineLocale("me",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sri.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sjutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedjelje] [u] LT","[prošlog] [ponedjeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srijede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"nekoliko sekundi",m:Ha.translate,mm:Ha.translate,h:Ha.translate,hh:Ha.translate,d:"dan",dd:Ha.translate,M:"mjesec",MM:Ha.translate,y:"godinu",yy:Ha.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),a.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Во изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Во изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}}),a.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,isPM:function(a){return/^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(a)},meridiem:function(a,b,c){return 4>a?"രാത്രി":12>a?"രാവിലെ":17>a?"ഉച്ച കഴിഞ്ഞ്":20>a?"വൈകുന്നേരം":"രാത്രി"}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Ja={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Ka=(a.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%s नंतर",past:"%s पूर्वी",s:"सेकंद",m:"एक मिनिट",mm:"%d मिनिटे",h:"एक तास",hh:"%d तास",d:"एक दिवस",dd:"%d दिवस",M:"एक महिना",MM:"%d महिने",y:"एक वर्ष",yy:"%d वर्षे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Ja[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Ia[a]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात्री"===b?4>a?a:a+12:"सकाळी"===b?a:"दुपारी"===b?a>=10?a:a+12:"सायंकाळी"===b?a+12:void 0},meridiem:function(a,b,c){return 4>a?"रात्री":10>a?"सकाळी":17>a?"दुपारी":20>a?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}}),a.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a,b,c){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}}),{1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"}),La={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"},Ma=(a.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",
nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(a){return a.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(a){return La[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Ka[a]})},week:{dow:1,doy:4}}),a.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tirs_ons_tors_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"H.mm",LTS:"LT.ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"}),Na={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"},Oa=(a.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आइ._सो._मङ्_बु._बि._शु._श.".split("_"),longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return Na[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return Ma[a]})},meridiemParse:/राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,meridiemHour:function(a,b){return 12===a&&(a=0),"राती"===b?3>a?a:a+12:"बिहान"===b?a:"दिउँसो"===b?a>=10?a:a+12:"बेलुका"===b||"साँझ"===b?a+12:void 0},meridiem:function(a,b,c){return 3>a?"राती":10>a?"बिहान":15>a?"दिउँसो":18>a?"बेलुका":20>a?"साँझ":"राती"},calendar:{sameDay:"[आज] LT",nextDay:"[भोली] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडी",s:"केही समय",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:1,doy:7}}),"jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_")),Pa="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_"),Qa=(a.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,b){return/-MMM-/.test(b)?Pa[a.month()]:Oa[a.month()]},weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}}),a.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),"styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_")),Ra="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_"),Sa=(a.defineLocale("pl",{months:function(a,b){return""===b?"("+Ra[a.month()]+"|"+Qa[a.month()]+")":/D MMMM/.test(b)?Ra[a.month()]:Qa[a.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"N_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:R,mm:R,h:R,hh:R,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:R,y:"rok",yy:R},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("pt-br",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] LT",LLLL:"dddd, D [de] MMMM [de] YYYY [às] LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"}),a.defineLocale("pt",{months:"Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),monthsShort:"Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),weekdays:"Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado".split("_"),weekdaysShort:"Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),weekdaysMin:"Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}}),a.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:S,h:"o oră",hh:S,d:"o zi",dd:S,M:"o lună",MM:S,y:"un an",yy:S},week:{dow:1,doy:7}}),a.defineLocale("ru",{months:V,monthsShort:W,weekdays:X,weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[й|я]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i],longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(){return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT"},lastWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:U,mm:U,h:"час",hh:U,d:"день",dd:U,M:"месяц",MM:U,y:"год",yy:U},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(a){return/^(дня|вечера)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночи":12>a?"утра":17>a?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":return a+"-й";case"D":return a+"-го";case"w":case"W":return a+"-я";default:return a}},week:{dow:1,doy:7}}),a.defineLocale("si",{months:"ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්".split("_"),monthsShort:"ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ".split("_"),weekdays:"ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා".split("_"),weekdaysShort:"ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන".split("_"),weekdaysMin:"ඉ_ස_අ_බ_බ්‍ර_සි_සෙ".split("_"),longDateFormat:{LT:"a h:mm",LTS:"a h:mm:ss",L:"YYYY/MM/DD",LL:"YYYY MMMM D",LLL:"YYYY MMMM D, LT",LLLL:"YYYY MMMM D [වැනි] dddd, LTS"},calendar:{sameDay:"[අද] LT[ට]",nextDay:"[හෙට] LT[ට]",nextWeek:"dddd LT[ට]",lastDay:"[ඊයේ] LT[ට]",lastWeek:"[පසුගිය] dddd LT[ට]",sameElse:"L"},relativeTime:{future:"%sකින්",past:"%sකට පෙර",s:"තත්පර කිහිපය",m:"මිනිත්තුව",mm:"මිනිත්තු %d",h:"පැය",hh:"පැය %d",d:"දිනය",dd:"දින %d",M:"මාසය",MM:"මාස %d",y:"වසර",yy:"වසර %d"},ordinalParse:/\d{1,2} වැනි/,ordinal:function(a){return a+" වැනි"},meridiem:function(a,b,c){return a>11?c?"ප.ව.":"පස් වරු":c?"පෙ.ව.":"පෙර වරු"}}),"január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_")),Ta="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_"),Ua=(a.defineLocale("sk",{months:Sa,monthsShort:Ta,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(Sa,Ta),weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:Z,m:Z,mm:Z,h:Z,hh:Z,d:Z,dd:Z,M:Z,MM:Z,y:Z,yy:Z},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),a.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:return"[prejšnjo] [nedeljo] [ob] LT";case 3:return"[prejšnjo] [sredo] [ob] LT";case 6:return"[prejšnjo] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"pred %s",s:$,m:$,mm:$,h:$,hh:$,d:$,dd:$,M:$,MM:$,y:$,yy:$},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),a.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),meridiemParse:/PD|MD/,isPM:function(a){return"M"===a.charAt(0)},meridiem:function(a,b,c){return 12>a?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}}),{words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=Ua.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Ua.correctGrammaticalCase(a,d)}}),Va=(a.defineLocale("sr-cyrl",{months:["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар"],monthsShort:["јан.","феб.","мар.","апр.","мај","јун","јул","авг.","сеп.","окт.","нов.","дец."],weekdays:["недеља","понедељак","уторак","среда","четвртак","петак","субота"],weekdaysShort:["нед.","пон.","уто.","сре.","чет.","пет.","суб."],weekdaysMin:["не","по","ут","ср","че","пе","су"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var a=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:Ua.translate,mm:Ua.translate,h:Ua.translate,hh:Ua.translate,d:"дан",dd:Ua.translate,M:"месец",MM:Ua.translate,y:"годину",yy:Ua.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),{words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,b,c){var d=Va.words[c];return 1===c.length?b?d[0]:d[1]:a+" "+Va.correctGrammaticalCase(a,d)}}),Wa=(a.defineLocale("sr",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sre.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:Va.translate,mm:Va.translate,h:Va.translate,hh:Va.translate,d:"dan",dd:Va.translate,M:"mesec",MM:Va.translate,y:"godinu",yy:Va.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}}),a.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"[På] dddd LT",lastWeek:"[I] dddd[s] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"e":1===b?"a":2===b?"a":"e";return a+c},week:{dow:1,doy:4}}),a.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(a){return a+"வது"},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(a,b,c){return 2>a?" யாமம்":6>a?" வைகறை":10>a?" காலை":14>a?" நண்பகல்":18>a?" எற்பாடு":22>a?" மாலை":" யாமம்"},meridiemHour:function(a,b){return 12===a&&(a=0),"யாமம்"===b?2>a?a:a+12:"வைகறை"===b||"காலை"===b?a:"நண்பகல்"===b&&a>=10?a:a+12},week:{dow:0,doy:6}}),a.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),longDateFormat:{LT:"H นาฬิกา m นาที",LTS:"LT s วินาที",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา LT",LLLL:"วันddddที่ D MMMM YYYY เวลา LT"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(a){return"หลังเที่ยง"===a},meridiem:function(a,b,c){return 12>a?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}}),a.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM DD, YYYY LT"},calendar:{sameDay:"[Ngayon sa] LT",nextDay:"[Bukas sa] LT",nextWeek:"dddd [sa] LT",lastDay:"[Kahapon sa] LT",lastWeek:"dddd [huling linggo] LT",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}}),{1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"});a.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(a){if(0===a)return a+"'ıncı";var b=a%10,c=a%100-b,d=a>=100?100:null;return a+(Wa[b]||Wa[c]||Wa[d])},week:{dow:1,doy:7}}),a.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}}),a.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}}),a.defineLocale("uk",{months:ba,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:ca,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., LT",LLLL:"dddd, D MMMM YYYY р., LT"},calendar:{sameDay:da("[Сьогодні "),nextDay:da("[Завтра "),lastDay:da("[Вчора "),nextWeek:da("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return da("[Минулої] dddd [").call(this);case 1:case 2:case 4:return da("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:aa,mm:aa,h:"годину",hh:aa,d:"день",dd:aa,M:"місяць",MM:aa,y:"рік",yy:aa},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(a){return/^(дня|вечора)$/.test(a)},meridiem:function(a,b,c){return 4>a?"ночі":12>a?"ранку":17>a?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a+"-й";case"D":return a+"-го";default:return a}},week:{dow:1,doy:7}}),a.defineLocale("uz",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"D MMMM YYYY, dddd LT"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}}),a.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY LT",LLLL:"dddd, D MMMM [năm] YYYY LT",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}}),a.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm分",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"下午"===b||"晚上"===b?a+12:a>=11?a:a+12},meridiem:function(a,b,c){var d=100*a+b;return 600>d?"凌晨":900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var b,c;return b=a().startOf("week"),c=this.unix()-b.unix()>=604800?"[下]":"[本]",0===this.minutes()?c+"dddAh点整":c+"dddAh点mm"},lastWeek:function(){var b,c;return b=a().startOf("week"),c=this.unix()<b.unix()?"[上]":"[本]",0===this.minutes()?c+"dddAh点整":c+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"周";default:return a}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1 分钟",mm:"%d 分钟",h:"1 小时",hh:"%d 小时",d:"1 天",dd:"%d 天",M:"1 个月",MM:"%d 个月",y:"1 年",yy:"%d 年"},week:{dow:1,doy:4}}),a.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm分",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b,c){var d=100*a+b;return 900>d?"早上":1130>d?"上午":1230>d?"中午":1800>d?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"一分鐘",mm:"%d分鐘",h:"一小時",hh:"%d小時",d:"一天",dd:"%d天",M:"一個月",MM:"%d個月",y:"一年",yy:"%d年"}})}});
(function() {
    'use strict';
    var window = window ? window : {},
        module = module ? module : {};
    //
    // @usage
    // var commission = new Commission(options);
    // - Extrair totais (liquido e taxa) a partir de um valor
    // commission.resume(number)
    // - Gerar total de comissão a partir de uma lista de produtos (ingressos)
    // commission.resume(array)
    //
    var Commission = function(options) {
        var _ = window.lodash ? window.lodash : require('lodash');
        //
        // Planos
        // https://github.com/esgrupo/credenciando/issues/110
        //
        // Range = periodo de preços (x a y)
        // Percent = porcentagem a ser aplicada em cima do valor passado
        // Value = valor a ser aplicado em cima do valor passado
        // 
        this.plans = [{
            range: {
                min: 0,
                max: 50
            },
            percent: 0,
            value: 5
        }, {
            range: {
                min: 51,
                max: 500
            },
            percent: 10,
            value: 0
        }, {
            range: {
                min: 501,
                max: 99999
            },
            percent: 8,
            value: 10
        }];
        _.merge(this, options);
    };
    //
    // API para resumo de comissão a partir de um valor passado
    //
    Commission.prototype.resume = resume;
    Commission.prototype.sum = sum;

    function resume(value) {
        var _ = window.lodash ? window.lodash : require('lodash');
        if (_.isArray(value)) {
            var fee = 0,
                total = 0;
            _.each(value, function(row) {
                var sum = this.sum(row.product.price);
                fee += sum.fee * row.qty;
                total += row.product.price * row.qty;
            }.bind(this));
            total -= fee;
            return {
                fee: fee.toFixed(2),
                liquid: total.toFixed(2)
            }
        } else if (_.isNumber(value)) {
            var sum = this.sum(value);
            return {
                fee: sum.fee,
                liquid: sum.liquid
            }
        }
    }
    //
    // Calcula a soma pelo valor passado em relação aos planos
    // e retorna um objeto com os totais de:
    // - Comissão
    // - Liquidez 
    //
    function sum(value) {
        var _ = window.lodash ? window.lodash : require('lodash');
        var fee = 0,
            liquid = value;
        _.each(this.plans, function(plan) {
            if (value >= plan.range.min && value <= plan.range.max) {
                if (plan.percent) fee += (value * plan.percent) / 100;
                if (plan.value) fee += plan.value;
            }
        });
        //
        // Subtrair comissão do total liquido
        //
        liquid -= fee;
        return {
            fee: fee.toFixed(2),
            liquid: liquid.toFixed(2)
        }
    }
    //
    // Browser
    //
    if (window && window.length !== undefined) {
        angular.module('core.utils').service('Commission', /*@ngInject*/ function event(lodash) {
            window.lodash = lodash;
            return Commission;
        });
    }
    //
    // Node
    //
    else {
        // var _ = require('lodash');
        module.exports = Commission;
    }
})();
'use strict';
angular.module('core.utils').controller('ImageCutterAreaCtrl', /*@ngInject*/ function($scope, $http, $mdDialog) {
    $scope.send = function() {
        if ($scope.endpointUrl) {
            toggleBusy();
            //colocando em um intervalo de tempo pra pegar corretamente o resultado do cut
            var interval = setInterval(function() {
                var params = {
                        image: $scope.cutResult
                    }
                    //extendendo aos parametros da diretiva
                angular.extend(params, $scope.endpointParams);
                //send to server
                $http
                    .put($scope.endpointUrl, params)
                    .success(function(response) {
                        if (typeof $scope.endpointSuccess === 'function') $scope.endpointSuccess(response);
                        toggleBusy();
                        if ($scope.cutOnModal) {
                            $mdDialog.hide();
                        }
                    })
                    .error(function(response) {
                        if (typeof $scope.endpointFail === 'function') $scope.endpointFail(response);
                        toggleBusy();
                    })
                    //limpando intervalo de tempo pra não gerar loop infinito
                clearInterval(interval);
            }, 1000);
        }
    }

    function toggleOpacity() {
        $scope.$emit('ImageCutterToggleOpacity')
    }

    function toggleBusy() {
        $scope.$emit('ImageCutterToggleBusy')
    }

    function reboot() {
        $scope.$emit('ImageCutterReboot')
    }

})
'use strict';
angular.module('core.utils').directive('imageCutterArea', /*@ngInject*/ function($http, $compile, $rootScope, $mdDialog) {
    return {
        scope: {
            endpointUrl: '@',
            endpointParams: '=',
            endpointSuccess: '=',
            endpointFail: '=',
            cutOnModal: '@',
            cutWidth: '@',
            cutHeight: '@',
            cutShape: '@',
            cutLabel: '@',
            cutResult: '=',
            cutStep: '='
        },
        replace: true,
        //transclude: true,
        restrict: 'EA',
        controller: 'ImageCutterAreaCtrl',
        // controllerAs: 'vm',
        templateUrl: 'core/utils/directives/imageCutter/area/imageCutterArea.tpl.html',
        link: function($scope, $elem, $attr) {
            $scope.cutLabel = $scope.cutLabel ? $scope.cutLabel : 'Crop';
            $scope.endpointParams = $scope.endpointParams ? $scope.endpointParams : {};
            $scope.reboot = reboot;
            $scope.$watch('cutStep', function(nv, ov) {
                if (nv != ov) {
                    /**
                     * Passo 2 - seleção da imagem
                     */
                    if (nv === 2) {
                        //add material classes and icon to "crop" button
                        $($elem).find('button:contains("Crop")')
                            .addClass('md-raised md-primary md-button')
                            .html('<span><i class="fa fa-crop"></i> ' + $scope.cutLabel + '<span>')
                            //coloca o bottao de reset ao lado do bottao de crop
                            .parent()
                            .append($($elem).find('button.refresh').removeAttr('ng-transclude'))
                            .parent()
                            .prepend($($elem).find('div.progress'));

                        // var interval = setInterval(function() {
                        //     $scope.$apply(function() {
                        //         clearInterval(interval);
                        //     })
                        // }, 500);
                    }
                    /**
                     * Passo 3 - corte
                     */
                    if (nv === 3) {
                        /**
                         * Enviar para o server
                         */

                        //if (!$scope.cutOnModal || $scope.cutOnModal == 'false')
                            $scope.send();
                    }


                }
            })
            $rootScope.$on('ImageCutterToggleOpacity', function() {
                toggleOpacity();
            })

            $rootScope.$on('ImageCutterReboot', function() {
                reboot();
            })

            $rootScope.$on('ImageCutterToggleBusy', function() {
                toggleBusy();
            })

            function toggleOpacity() {
                $($elem).find('img.image-crop-final').toggleClass('opacity-3');
            }

            function toggleBusy() {
                $scope.busy = !$scope.busy;
                if ($scope.busy === false) {
                    //$compile($elem)($scope)
                    //re-reboot directive
                    reboot();
                }
                toggleOpacity();
            }

            function reboot() {
                $scope.cutResult = null;
                $scope.cutStep = 1;
                $($elem).find('input.image-crop-input').val('');
                $rootScope.$emit('CropReset');
            }
        }
    }
});
angular.module("app.kit").run(["$templateCache", function($templateCache) {$templateCache.put("core/home/home-secured.tpl.html","<div class=\"main-wrapper anim-zoom-in md-padding home\" layout=\"column\" flex=\"\"><h1>Secured Home</h1><div class=\"text-center\">{{ \'USER_WELCOME_WARN\' | translate:\'{ firstName: \"\'+app.user().profile.firstName+\'\" }\' }}</div><a ui-sref=\"app.login\">entrar</a></div>");
$templateCache.put("core/home/home.tpl.html","<div class=\"main-wrapper anim-zoom-in md-padding home\" layout=\"column\" flex=\"\"><div class=\"text-center\">{{ \'USER_WELCOME_WARN\' | translate:\'{ firstName: \"\'+app.user().profile.firstName+\'\" }\' }}</div><a ui-sref=\"app.login\" ng-if=\"!app.user().isAuthed()\">entrar</a> <a ui-sref=\"app.home-secured\">home secured</a><hr>Company: {{app.user().current(\'company\').name}}<br><a class=\"image-cutter-wrapper\" layout-padding=\"\" image-cutter=\"\" endpoint-url=\"{{vm.imageCutterEndpointUrl}}\" endpoint-success=\"vm.imageCutterEndpointSuccess\" endpoint-fail=\"vm.imageCutterEndpointFail\" cut-on-modal=\"true\" cut-on-modal-title=\"Alterar Banner\" cut-width=\"930\" cut-height=\"200\" cut-shape=\"square\" cut-label=\"Cortar\"><div class=\"pic\" ng-style=\"{\'background-image\': \'url(\'+prize.banner+\')\'}\" ng-if=\"prize.banner\"></div><div class=\"pic-caption md-caption\" ng-if=\"!prize.banner\"><i class=\"material-icons\" style=\"font-size: 54px; margin-top: -10px; margin-left: -9px;\">collections</i></div></a></div>");
$templateCache.put("core/login/login.tpl.html","<md-content class=\"md-padding anim-zoom-in login\" layout=\"row\" layout-sm=\"column\" ng-if=\"!app.user().isAuthed()\" flex=\"\"><div layout=\"column\" class=\"login\" layout-padding=\"\" flex=\"\"><login-form config=\"vm.config\" user=\"app.user\"></login-form></div></md-content>");
$templateCache.put("core/page/page.tpl.html","<div class=\"main-wrapper anim-zoom-in md-padding page\" layout=\"column\" flex=\"\"><div class=\"text-center\">Olá moda foca <a ui-sref=\"app.login\">entrar</a></div></div><style>\r\n/*md-toolbar.main.not-authed, md-toolbar.main.not-authed .md-toolbar-tools {\r\n    min-height: 10px !important; height: 10px !important;\r\n}*/\r\n</style>");
$templateCache.put("core/login/facebook/facebookLogin.tpl.html","<button flex=\"\" ng-click=\"fb.login()\" ng-disabled=\"app.page().load.status\" layout=\"row\"><i class=\"fa fa-facebook\"></i> <span>Entrar com Facebook</span></button>");
$templateCache.put("core/login/form/loginForm.tpl.html","<div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><md-content class=\"md-padding\"><form name=\"logon\" novalidate=\"\"><div layout=\"row\" class=\"email\"><i class=\"fa fa-at\"></i><md-input-container flex=\"\"><label>Email</label> <input ng-model=\"logon.email\" type=\"email\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"senha\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Senha</label> <input ng-model=\"logon.password\" type=\"password\" required=\"\"></md-input-container></div></form></md-content><div layout=\"row\" layout-padding=\"\"><button flex=\"\" class=\"entrar\" ng-click=\"vm.login(logon)\" ng-disabled=\"logon.$invalid||app.page().load.status\">Entrar</button><facebook-login user=\"user\"></facebook-login></div></div><div class=\"help\" layout=\"row\"><a flex=\"\" ui-sref=\"app.login-lost\" class=\"lost\"><i class=\"fa fa-support\"></i> Esqueci minha senha</a> <a flex=\"\" ui-sref=\"app.signup\" class=\"lost\"><i class=\"fa fa-support\"></i> Não tenho cadastro</a></div><style>\r\nbody, html {  overflow: auto;}\r\n</style>");
$templateCache.put("core/login/google/googleLogin.tpl.html","<google-plus-signin clientid=\"{{google.clientId}}\" language=\"{{google.language}}\"><button class=\"google\" layout=\"row\" ng-disabled=\"app.page().load.status\"><i class=\"fa fa-google-plus\"></i> <span>Entrar com Google</span></button></google-plus-signin>");
$templateCache.put("core/login/register/lost.tpl.html","<div layout=\"row\" class=\"login-lost\" ng-if=\"!app.user().isAuthed()\"><div layout=\"column\" class=\"login\" flex=\"\" ng-if=\"!vm.userHash\"><div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><md-content class=\"md-padding\"><form name=\"lost\" novalidate=\"\"><div layout=\"row\" class=\"email\"><i class=\"fa fa-at\"></i><md-input-container flex=\"\"><label>Email</label> <input ng-model=\"email\" type=\"email\" required=\"\"></md-input-container></div></form></md-content><md-button class=\"md-primary md-raised entrar\" ng-disabled=\"lost.$invalid||app.page().load.status\" ng-click=\"!lost.$invalid?vm.lost(email):false\">Recuperar</md-button></div></div><div layout=\"column\" class=\"login\" flex=\"\" ng-if=\"vm.userHash\"><div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><h4 class=\"text-center\">Entre com sua nova senha</h4><md-content class=\"md-padding\"><form name=\"lost\" novalidate=\"\"><div layout=\"row\" class=\"email\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Senha</label> <input ng-model=\"senha\" type=\"password\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"email\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Repetir senha</label> <input ng-model=\"senhaConfirm\" name=\"senhaConfirm\" type=\"password\" match=\"senha\" required=\"\"></md-input-container></div></form></md-content><md-button class=\"md-primary md-raised entrar\" ng-disabled=\"lost.$invalid||app.page().load.status\" ng-click=\"!lost.$invalid?vm.change(senha):false\">Alterar</md-button></div><div ng-show=\"lost.senhaConfirm.$error.match\" class=\"warn\"><span>(!) As senhas não conferem</span></div></div></div><style>\r\nbody, html {  overflow: auto;}\r\n</style>");
$templateCache.put("core/login/register/register.tpl.html","<md-content class=\"md-padding anim-zoom-in login\" layout=\"row\" layout-sm=\"column\" ng-if=\"!app.user().isAuthed()\" flex=\"\"><div layout=\"column\" class=\"register\" layout-padding=\"\" flex=\"\"><register-form config=\"vm.config\"></register-form></div></md-content>");
$templateCache.put("core/login/register/registerForm.tpl.html","<div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><md-content><form name=\"registerForm\" novalidate=\"\"><div layout=\"row\" layout-sm=\"column\" class=\"nome\"><i hide-sm=\"\" class=\"fa fa-smile-o\"></i><md-input-container flex=\"\"><label>Seu nome</label> <input ng-model=\"sign.firstName\" type=\"text\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Sobrenome</label> <input ng-model=\"sign.lastName\" type=\"text\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"email\"><i class=\"fa fa-at\"></i><md-input-container flex=\"\"><label>Email</label> <input ng-model=\"sign.email\" type=\"email\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"senha\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Senha</label> <input ng-model=\"sign.password\" type=\"password\" required=\"\"></md-input-container></div></form><div layout=\"row\" layout-padding=\"\"><button flex=\"\" class=\"entrar\" ng-disabled=\"registerForm.$invalid||app.page().load.status\" ng-click=\"register(sign)\">Registrar</button><facebook-login user=\"user\"></facebook-login></div></md-content></div><div layout=\"column\"><a flex=\"\" class=\"lost\" ui-sref=\"app.pages({slug:\'terms\'})\"><i class=\"fa fa-warning\"></i> Concordo com os termos</a></div><style>\r\nbody, html {  overflow: auto;}\r\n</style>");
$templateCache.put("core/page/layout/layout.tpl.html","<md-sidenav ui-view=\"sidenav\" class=\"page-menu md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"$mdMedia(\'gt-md\')\" ng-if=\"app.user().isAuthed()\"></md-sidenav><div layout=\"column\" flex=\"\" class=\"main-content-wrapper\"><loader></loader><md-toolbar ui-view=\"toolbar\" class=\"main\" md-scroll-shrink=\"\" md-shrink-speed-factor=\"0.25\"></md-toolbar><md-content class=\"main-content\"><div ui-view=\"content\" class=\"anim-in-out anim-slide-below-fade\"></div></md-content></div>");
$templateCache.put("core/page/loader/loader.tpl.html","<div class=\"page-loader\" ng-class=\"{\'show\':app.page().load.status}\"><md-progress-linear md-mode=\"indeterminate\"></md-progress-linear></div>");
$templateCache.put("core/page/menu/menuLink.tpl.html","<md-button ng-class=\"{\'active\' : isSelected()||vm.state.current.name === section.state}\" ng-href=\"{{section.url}}\"><i ng-if=\"section.icon\" class=\"{{section.icon}}\"></i><md-icon ng-if=\"section.iconMi\" md-font-set=\"material-icons\">{{section.iconMi}}</md-icon><span>{{section | menuHuman }}</span></md-button>");
$templateCache.put("core/page/menu/menuToggle.tpl.html","<md-button class=\"md-button-toggle\" ng-click=\"toggle()\" aria-controls=\"appkit-menu-{{section.name | nospace}}\" flex=\"\" layout=\"row\" aria-expanded=\"{{isOpen()}}\"><i ng-if=\"section.icon\" class=\"{{section.icon}}\"></i> <span class=\"title\">{{section.name}}</span> <span aria-hidden=\"true\" class=\"md-toggle-icon\" ng-class=\"{\'toggled\' : isOpen()}\"></span></md-button><ul ng-show=\"isOpen()\" id=\"appkit-menu-{{section.name | nospace}}\" class=\"menu-toggle-list\"><li ng-repeat=\"page in section.pages\"><div layout=\"row\"><menu-link section=\"page\" flex=\"\"></menu-link><md-button ng-click=\"cart.add(page._)\" aria-label=\"adicione {{page.name}} ao carrinho\" title=\"adicione {{page.name}} ao carrinho\" ng-if=\"section.product\"><i class=\"fa fa-cart-plus\"></i></md-button></div></li></ul>");
$templateCache.put("core/page/menu/sidenav.tpl.html","<div layout=\"column\"><menu-avatar first-name=\"app.user.profile.firstName\" last-name=\"app.user.profile.lastName\" gender=\"app.user.profile.gender\" facebook=\"app.user.facebook\"></menu-avatar><div flex=\"\"><ul class=\"appkit-menu\"><li ng-repeat=\"section in app.menu().sections\" class=\"parent-list-item\" ng-class=\"{\'parentActive\' : app.menu().isSectionSelected(section)}\"><h2 class=\"menu-heading\" ng-if=\"section.type === \'heading\'\" id=\"heading_{{ section.name | nospace }}\" layout=\"row\"><i ng-if=\"section.icon\" class=\"{{section.icon}}\"></i><md-icon ng-if=\"section.iconMi\" md-font-set=\"material-icons\">{{section.icon}}</md-icon><my-svg-icon ng-if=\"section.iconSvg\" class=\"ic_24px\" icon=\"{{section.iconSvg}}\"></my-svg-icon><span>{{section.name}}</span></h2><menu-link section=\"section\" ng-if=\"section.type === \'link\'\"></menu-link><menu-toggle section=\"section\" ng-if=\"section.type === \'toggle\'\"></menu-toggle><ul ng-if=\"section.children\" class=\"menu-nested-list\"><li ng-repeat=\"child in section.children\" ng-class=\"{\'childActive\' : app.menu().isChildSectionSelected(child)}\"><menu-toggle section=\"child\"></menu-toggle></li></ul></li><li><a class=\"md-button md-default-theme\" ng-click=\"app.logout()\"><i class=\"fa fa-power-off\"></i> <span class=\"title\">Sair</span></a></li></ul></div><div layout=\"column\" layout-align=\"center center\" class=\"page-footer text-center\"><md-content flex=\"\" class=\"main-wrapper\"><div class=\"copyright\"><strong>{{ app.setting().copyright }} © {{ app.year() }}</strong></div><div class=\"terms\"><a ui-sref=\"app.pages({slug:\'privacy\'})\">Política de Privacidade</a> - <a ui-sref=\"app.pages({slug:\'terms\'})\">Termos de Serviço</a></div></md-content></div></div>");
$templateCache.put("core/page/toolbar/toolbar.tpl.html","<div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\"><div hide=\"\" show-sm=\"\" show-md=\"\" layout=\"row\"><a ng-click=\"app.menu().open()\" ng-if=\"app.user().isAuthed()\" aria-label=\"menu\"><md-icon md-svg-src=\"assets/images/icons/ic_menu_24px.svg\"></md-icon></a><toolbar-title hide-sm=\"\" hide-md=\"\"></toolbar-title></div><toolbar-title hide=\"\" show-gt-md=\"\"></toolbar-title><div layout=\"row\" ng-if=\"app.state().current.name != \'app.home\'\"><ul class=\"top-menu\"><li></li></ul><toolbar-menu ng-if=\"app.user().isAuthed()\"></toolbar-menu><a ui-sref=\"app.home\"><img hide=\"\" show-sm=\"\" show-md=\"\" class=\"logo-header\" ng-src=\"{{app.logoWhite}}\"></a></div></div>");
$templateCache.put("core/page/menu/avatar/menuAvatar.tpl.html","<div layout=\"column\" class=\"avatar-wrapper\"><img ng-src=\"{{vm.picture}}\" class=\"avatar\"><p class=\"name\"><strong>{{firstName}} {{lastName}}</strong></p></div>");
$templateCache.put("core/page/toolbar/menu/toolbarMenu.tpl.html","<ul class=\"top-menu\"><li ng-repeat=\"item in menu\"><a id=\"{{item.id}}\" title=\"{{item.name}}\"><i class=\"{{item.icon}}\"></i></a></li></ul>");
$templateCache.put("core/page/toolbar/title/toolbarTitle.tpl.html","<div class=\"logo-company\" layout=\"row\" layout-align=\"space-between center\"><a href=\"/\"><img class=\"logo-header\" ng-src=\"{{app.logoWhite}}\"></a></div>");
$templateCache.put("core/utils/directives/addrForm/addrForm.tpl.html","<form name=\"handleForm\" class=\"addr-form\"><div layout=\"column\" layout-gt-sm=\"row\"><ceper template-url=\"core/utils/directives/addrForm/ceper.tpl.html\" endpoint-url=\"{{vm.endpointCepUrl}}\" ng-model=\"ngModel.cep\" address=\"ngModel\"></ceper><md-input-container flex=\"\"><label>Endereço</label> <input ng-model=\"ngModel.street\" required=\"\"></md-input-container></div><div layout=\"column\" layout-gt-sm=\"row\"><md-input-container flex=\"\"><label>Número</label> <input type=\"number\" ng-model=\"ngModel.num\"></md-input-container><md-input-container flex=\"\"><label>Bairro</label> <input ng-model=\"ngModel.district\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Complemento</label> <input ng-model=\"ngModel.comp\" md-maxlength=\"50\"></md-input-container></div><div layout=\"column\" layout-gt-sm=\"row\"><md-input-container flex=\"\"><label>Cidade</label> <input ng-model=\"ngModel.city\" required=\"\"></md-input-container><md-select ng-model=\"ngModel.state\" placeholder=\"Estado\" flex=\"\" required=\"\"><md-option ng-value=\"opt.value\" ng-repeat=\"opt in vm.states\">{{ opt.name }}</md-option></md-select></div><md-button class=\"md-fab md-primary md-hue-2 save\" aria-label=\"Salvar\" ng-if=\"endpointUrl\" ng-click=\"vm.save()\" ng-disabled=\"vm.busy||handleForm.$invalid||!handleForm.$dirty||vm.pristine()\"><md-tooltip>Salvar</md-tooltip><i class=\"fa fa-thumbs-up\"></i></md-button></form>");
$templateCache.put("core/utils/directives/addrForm/ceper.tpl.html","<md-input-container class=\"ceper md-primary\" flex=\"\"><label>CEP</label><md-progress-circular class=\"load\" md-mode=\"indeterminate\" md-diameter=\"18\" ng-show=\"vm.busy\" style=\"margin-top: -16px; margin-left: 38px;\"></md-progress-circular><input type=\"text\" ng-minlength=\"\'8\'\" ng-maxlength=\"\'8\'\" ng-model=\"ngModel\" ng-change=\"vm.get()\" focus=\"\"></md-input-container>");
$templateCache.put("core/utils/directives/ceper/ceper.tpl.html","<md-input-container class=\"ceper\" flex=\"\"><label><div clayout=\"row\"><label>Cep</label><md-progress-circular class=\"load\" md-mode=\"indeterminate\" md-diameter=\"18\" ng-show=\"vm.busy\"></md-progress-circular></div></label> <input type=\"text\" ng-minlength=\"\'8\'\" ng-maxlength=\"\'8\'\" ng-model=\"ngModel\" ng-change=\"vm.get()\" required=\"\"></md-input-container>");
$templateCache.put("core/utils/directives/companyChooser/companyChooser.tpl.html","<div class=\"company-chooser\"><div ng-hide=\"hideMe\" ng-if=\"companies.length\"><md-select aria-label=\"placeholder\" ng-model=\"vm.companyid\" placeholder=\"{{placeholder}}\" flex=\"\" required=\"\"><md-option ng-value=\"opt.company._id\" ng-repeat=\"opt in companies\">{{ opt.company.name }}</md-option></md-select></div></div>");
$templateCache.put("core/utils/directives/contactForm/contactForm.tpl.html","<form name=\"handleForm\" class=\"contact-form\"><div layout=\"row\" layout-sm=\"column\"><md-input-container flex=\"\"><label>Nome</label> <input ng-model=\"ngModel.name\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Email</label> <input type=\"email\" ng-model=\"ngModel.email\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Celular</label> <input ng-model=\"ngModel.mobile\" ui-br-phone-number=\"\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Telefone</label> <input ng-model=\"ngModel.phone\" ui-br-phone-number=\"\"></md-input-container></div><md-button class=\"md-fab md-primary md-hue-2 save\" aria-label=\"Salvar\" ng-if=\"endpointUrl\" ng-click=\"vm.save()\" ng-disabled=\"vm.busy||handleForm.$invalid||!handleForm.$dirty||vm.pristine()\"><md-tooltip>Salvar</md-tooltip><i class=\"fa fa-thumbs-up\"></i></md-button></form>");
$templateCache.put("core/utils/directives/dashboardStats/dashboardStats.tpl.html","<div class=\"dashboard-stats bg margin md-whiteframe-z1 counter\" flex=\"\"><md-progress-circular ng-show=\"loading\" class=\"md-hue-2\" md-mode=\"indeterminate\"></md-progress-circular><button class=\"refresh\" ng-click=\"update()\" ng-disabled=\"loading\" ng-hide=\"loading\"><i class=\"fa fa-refresh\"></i><md-tooltip>Atualizar</md-tooltip></button><div flex=\"\" ng-repeat=\"item in data\" class=\"data animate-repeat\" ng-if=\"!loading\"><h4>{{item.name}}</h4><span count-to=\"{{item.value}}\" value=\"0\" duration=\"4\"></span></div></div>");
$templateCache.put("core/utils/directives/imageCutter/imageCutter.tpl.html","<div class=\"image-cutter-wrapper\"><ng-transclude ng-click=\"modal($event)\" ng-if=\"cutOnModal===\'true\'\"></ng-transclude><image-cutter-area ng-if=\"cutOnModal != \'true\'\" endpoint-url=\"{{endpointUrl}}\" endpoint-params=\"endpointParams\" endpoint-success=\"endpointSuccess\" endpoint-fail=\"endpointFail\" cut-on-modal=\"{{cutOnModal}}\" cut-width=\"{{cutWidth}}\" cut-height=\"{{cutHeight}}\" cut-shape=\"{{cutShape}}\" cut-label=\"{{cutLabel}}\" cut-result=\"cutResult\" cut-step=\"cutStep\"></image-cutter-area></div>");
$templateCache.put("core/utils/directives/imageCutter/modal.tpl.html","<md-dialog class=\"image-cutter-wrapper\" aria-label=\"{{cutOnModalTitle}}\"><md-toolbar class=\"md-primary md-{{setting().store.theme}}-theme\"><div class=\"md-toolbar-tools\"><h5>{{cutOnModalTitle}}</h5><span flex=\"\"></span><md-button class=\"close md-icon-button md-primary md-{{setting().store.theme}}-theme\" ng-click=\"hide()\"><i class=\"material-icons\">&#xE14C;</i></md-button></div></md-toolbar><md-dialog-content><p ng-if=\"cutText\">{{cutText}}</p><image-cutter-area endpoint-url=\"{{endpointUrl}}\" endpoint-params=\"endpointParams\" endpoint-success=\"endpointSuccess\" endpoint-fail=\"endpointFail\" cut-on-modal=\"{{cutOnModal}}\" cut-width=\"{{cutWidth}}\" cut-height=\"{{cutHeight}}\" cut-shape=\"{{cutShape}}\" cut-label=\"{{cutLabel}}\" cut-result=\"cutResult\" cut-step=\"cutStep\"></image-cutter-area></md-dialog-content></md-dialog>");
$templateCache.put("core/utils/directives/leadForm/leadForm.tpl.html","<form class=\"lead-form\" name=\"leadForm\" novalidate=\"\"><md-input-container flex=\"\" ng-if=\"!isDisabled(\'name\')\"><label>Seu nome</label> <input name=\"name\" ng-model=\"lead.name\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Melhor email</label> <input name=\"email\" type=\"email\" ng-model=\"lead.email\" required=\"\"></md-input-container><md-input-container flex=\"\" ng-if=\"!isDisabled(\'company\')\"><label>Empresa</label> <input name=\"company\" ng-model=\"lead.company\" required=\"\"></md-input-container><md-input-container flex=\"\" ng-if=\"!isDisabled(\'phone\')\"><label>Telefone</label> <input name=\"phone\" ng-model=\"lead.phone\" ui-br-phone-number=\"\" required=\"\"></md-input-container><md-button ng-click=\"register()\" ng-disabled=\"leadForm.$invalid\" class=\"md-primary\">{{label?label:\'Enviar\'}}</md-button><md-progress-circular md-diameter=\"20\" class=\"md-warn md-hue-3\" md-mode=\"indeterminate\" ng-if=\"vm.busy\" ng-class=\"{\'busy\':vm.busy}\"></md-progress-circular><p class=\"lead-term\">*nunca divulgaremos seus dados</p></form>");
$templateCache.put("core/utils/directives/liveChips/liveChips.tpl.html","<md-chips ng-model=\"vm.selectedItems\" md-autocomplete-snap=\"\" md-require-match=\"\"><md-autocomplete md-selected-item=\"vm.selectedItem\" md-search-text=\"vm.searchText\" md-items=\"item in vm.querySearch(vm.searchText)\" md-item-text=\"item\" placeholder=\"{{vm.placeholder}}\"><span md-highlight-text=\"vm.searchText\">{{item}}</span></md-autocomplete><md-chip-template><span><a ng-class=\"{\'truncate\':truncateInput}\" title=\"{{$chip}}\">{{$chip}}</a></span></md-chip-template></md-chips><v-accordion ng-hide=\"hideOptions\" class=\"vAccordion--default\" layout-align=\"start start\" layout-align-sm=\"center start\" control=\"accordion\"><v-pane><v-pane-header class=\"border-bottom\"><div>Opções</div></v-pane-header><v-pane-content><md-list><md-list-item class=\"filter-opt\" ng-repeat=\"chip in items track by $index\"><div class=\"md-list-item-text compact\"><a ng-class=\"{\'truncate\':truncateOptions}\" title=\"{{chip}}\" ng-click=\"vm.applyRole(chip,accordion)\"><i class=\"fa fa-gear\"></i> {{chip}}</a></div></md-list-item></md-list></v-pane-content></v-pane></v-accordion>");
$templateCache.put("core/utils/directives/moipCcForm/moipCcForm.tpl.html","<form name=\"handleForm\" class=\"moip-cc-form\"><div layout=\"row\" layout-sm=\"column\"><md-select ng-model=\"ngModel.empresa\" placeholder=\"Instituição\" flex=\"\" required=\"\"><md-option ng-value=\"opt\" ng-repeat=\"opt in vm.cc\">{{ opt }}</md-option></md-select><md-select ng-model=\"ngModel.parcelas\" placeholder=\"Parcelas\" flex=\"\" required=\"\"><md-option ng-value=\"opt\" ng-repeat=\"opt in parcels\">{{ opt }}</md-option></md-select></div><div layout=\"row\" layout-sm=\"column\"><md-input-container flex=\"\"><label>Número do cartão</label> <input ng-model=\"ngModel.numero\" type=\"number\" ng-minlength=\"13\" ng-maxlength=\"19\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Validade (MM/AA)</label> <input ng-model=\"ngModel.validade\" mask=\"12/99\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Chave de segurança</label> <input type=\"number\" ng-model=\"ngModel.chave\" ng-minlength=\"3\" ng-maxlength=\"4\" required=\"\"></md-input-container></div><div layout=\"row\" layout-sm=\"column\"><md-input-container flex=\"\"><label>Nome impresso</label> <input ng-model=\"ngModel.nome\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>CPF</label> <input ng-model=\"ngModel.cpf\" ui-br-cpf-mask=\"\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Nascimento</label> <input ng-model=\"ngModel.nascimento\" mask=\"39/19/9999\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Telefone</label> <input ng-model=\"ngModel.telefone\" ui-br-phone-number=\"\" required=\"\"></md-input-container></div></form>");
$templateCache.put("core/utils/directives/optOut/optOut.tpl.html","<div class=\"opt-out md-whiteframe-z1\" layout=\"column\"><img ng-if=\"itemImage\" ng-src=\"{{itemImage}}\"><md-button class=\"md-fab md-primary md-hue-1\" aria-label=\"{{putLabel}}\" ng-click=\"callAction($event)\"><md-tooltip ng-if=\"putLabel\">{{putLabel}}</md-tooltip><i class=\"fa fa-times\"></i></md-button><a class=\"md-primary\" href=\"{{itemLocation}}\"><h4 ng-if=\"itemTitle\" ng-bind=\"itemTitle | cut:true:18:\'..\'\"></h4><md-tooltip ng-if=\"itemTitleTooltip\">{{itemTitleTooltip}}</md-tooltip></a><p ng-bind-html=\"itemInfo\"></p></div>");
$templateCache.put("core/utils/directives/toolbarAvatar/toolbarAvatar.tpl.html","<div class=\"toolbar-avatar\"><md-menu><md-button aria-label=\"Open phone interactions menu\" ng-click=\"$mdOpenMenu()\" class=\"logged-in-menu-button\" ng-class=\"{\'md-icon-button\': app.mdMedia(\'sm\')}\"><div layout=\"row\" layout-align=\"end center\" class=\"toolbar-login-info\"><div layout=\"column\" layout-align=\"center\" class=\"toolbar-login-content\" show-gt-sm=\"\" hide-sm=\"\"><span class=\"md-title\">{{firstName}}</span> <span class=\"md-caption\">{{email}}</span></div><div layout=\"row\" layout-align=\"center center\"><menu-avatar facebook=\"facebook\" md-menu-origin=\"\"></menu-avatar></div></div></md-button><md-menu-content width=\"4\"><md-menu-item ng-repeat=\"item in menu\"><md-button ng-href=\"{{item.href}}\"><md-icon md-font-icon=\"fa {{item.icon}}\" md-menu-align-target=\"\"></md-icon>{{item.title}}</md-button></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item><md-button ng-click=\"vm.logout()\"><md-icon md-font-icon=\"fa fa-power-off\" md-menu-align-target=\"\"></md-icon>Sair</md-button></md-menu-item></md-menu-content></md-menu></div>");
$templateCache.put("core/utils/directives/imageCutter/area/imageCutterArea.tpl.html","<div class=\"image-cutter\"><image-crop data-width=\"{{cutWidth}}\" data-height=\"{{cutHeight}}\" data-shape=\"{{cutShape}}\" data-step=\"cutStep\" data-result=\"cutResult\"></image-crop><div hide=\"\"><md-button class=\"refresh md-raised\" ng-click=\"reboot()\" aria-label=\"Recomeçar\"><i class=\"fa fa-refresh\"></i><md-tooltip>Recomeçar</md-tooltip></md-button><div class=\"progress\" ng-show=\"busy\"><md-progress-circular class=\"md-primary md-{{setting().store.theme}}-theme\" md-mode=\"indeterminate\"></md-progress-circular></div></div></div>");}]);