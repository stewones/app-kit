'use strict';
angular.module('core.account', [
    'core.utils',
    'core.user',
    'core.menu',
    'ui.router',
    'vAccordion',
    'angularMoment',
    'ngLodash',
    'ngMask',
    'angularMoment',
    'satellizer'
])
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
    'ui.router',
    'satellizer',
    'google.login',
    'facebook.login'
]);
'use strict';
angular.module('core.page', [
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
angular.module('core.profile', [
    'core.utils',
    'core.user',
    'core.menu',
    'ui.router',
    'vAccordion',
    'angularMoment',
    'ngLodash',
    'ngMask',
    'string',
    'angularMoment',
    'satellizer'
])
'use strict';
angular.module('core.user', ['ui.router','satellizer','app.setting','app.env','core.menu','core.page']);
'use strict';
angular.module('core.utils', ['core.page', 'angularMoment']);
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
 * Kit para criação de aplicações frontend com angular 1.x <br />
 * Serviços dos módulos com namespace "core" são identificados pelo prefixo $
 **/
angular.module('app.kit', [
    'app.setting',
    'app.env',
    'core.utils',
    'ui.router',
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'angulartics',
    'angulartics.google.analytics',
    'core.page',
    'core.login',
    'core.user',
    'core.profile',
    'core.account'
]);
'use strict';
angular.module('core.account').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider, $accountProvider, $menuProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.account', {
        protected: true,
        url: '/account/',
        views: {
            'content': {
                templateUrl: /*@ngInject*/ function() {
                    return $accountProvider.templateUrl()
                },
                controller: '$AccountCtrl as vm'
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
            closeMenu: /*@ngInject*/ function($timeout, $auth, $menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        $menu.api().close();
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
    $menuProvider.set({
        name: 'Conta',
        type: 'link',
        icon: 'fa fa-at',
        url: '/account/',
        state: 'app.account'
    });
    //
    // Set Toolbar Menu
    //
    // $menuProvider.setToolbarMenu({
    //     id: 'filtros',
    //     name: 'Filtros',
    //     type: 'action',
    //     icon: 'fa fa-sliders'
    // });
});
'use strict';
angular.module('core.account').controller('$AccountCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $mdDialog, $q, $timeout, $Account, $account, $User, UserSetting, $utils, $page, $user, setting, api) {
    var vm = this;
    //
    // SEO
    //
    $page.title(setting.title);
    $page.description(setting.description);
    //
    // Events
    //
    $rootScope.$on('CompanyIdUpdated', function() {});
    //
    // Watchers
    //
    $scope.$on('OptOutItemUnlinked', function(ev, companyid) {
        unlinkCompany(companyid);
    });
    $scope.$watch('vm.account', function(nv, ov) {
        if (nv != ov) {
            vm.form.account.$dirty = true;
        }
    }, true);
    //
    // Bootstrap
    //
    vm.saveAccount = saveAccount;
    vm.savePassword = savePassword;
    vm.pristineAccount = pristineAccount;
    vm.deactivateAccount = deactivateAccount;
    vm.form = {
        account: {},
        password: {}
    };
    // attributes of opt-out component
    vm.optOutInfo = optOutInfo;
    vm.optOutPutLocation = api.url + '/api/profiles/opt-out';
    vm.optOutPutParams = {
        company: $user.instance.current('company')._id
    };
    bootstrap();

    function bootstrap() {
        //instantiate new account
        vm.account = $account.set(new $Account({
            email: $user.instance.email,
            facebook: $user.instance.facebook,
            id: $user.instance.id,
            provider: $user.instance.provider,
            profile: $user.instance.profile,
            role: (UserSetting.roleForCompany != 'user') ? $user.instance.profile.role : $user.instance.role
        }));
        vm.accountPristine = angular.copy(vm.account);
        $timeout(function() {
            dirty(false);
        }, 1000)
    }
    //handle pra confirmação de conta
    function confirmAccount(cbSuccess, cbFail) {
        //confirm account identity
        vm.account.confirm(onSuccessConfirm, onFailConfirm);
        //handle confirm account success
        function onSuccessConfirm(response) {
            if (cbSuccess) cbSuccess(response)
        }
        //handle confirm account fail
        function onFailConfirm(response) {
            if (cbFail) cbFail(response)
        }
    }

    function saveAccount() {
        confirmAccount(function() {
            $page.load.init();
            //company unlink
            $http.put(api.url + '/api/profiles/' + $user.instance.profile.id + '/updateInfo', {
                firstName: vm.account.profile.firstName, //nome do perfil
                lastName: vm.account.profile.lastName, //sobrenome do perfil
                email: vm.account.email, //email da conta e nao do perfil (email do perfil será usado para contatos profissionais)
            }).success(onSuccessUpdateInfo).error(onFailUpdateInfo);
            //handle unlink success
            function onSuccessUpdateInfo(response) {
                var _user = response.user;
                var _profile = response;
                delete _profile.user;
                $user.instance.profile = _profile; //atualizar profile
                $user.set(new $User($user.instance)); //re-instanciar usuario
                bootstrap(); //re-instanciar profile
                $page.toast('Dados atualizados');
                $page.load.done();
                $rootScope.$emit('AccountUpdated');
            }
            //handle unlink fail
            function onFailUpdateInfo(response) {
                $page.toast('não foi possível atualizar seus dados ' + response.error ? response.error : '');
                $page.load.done();
            }
        });
    }

    function unlinkCompany(id) {
        confirmAccount(function() {
            $page.load.init();
            //company unlink
            $http.put(api.url + '/api/profiles/' + $user.instance.profile.id + '/unlinkCompany', {
                cid: id
            }).success(onSuccessUnlink).error(onFailUnlink);
            //handle unlink success
            function onSuccessUnlink(response) {
                var _user = response.user;
                var _profile = response;
                delete _profile.user;
                $user.instance.profile = _profile; //atualizar profile
                $user.instance.current('companies', _profile.role); //re-setar empresas atuais
                if (!$user.instance.current('companies').length || !$user.instance.current('companies')[0].company || !$user.instance.current('companies')[0].company._id) {
                    $user.instance.current('company', {}); //zerar empresa atual se nao existir mais nenhuma
                }
                $user.set(new $User($user.instance)); //re-instanciar usuario
                bootstrap();
                $page.toast('empresa desconectada');
                $page.load.done();
                $rootScope.$emit('AccountUpdated');
            }
            //handle unlink fail
            function onFailUnlink(response) {
                $page.toast('não foi possível desconectar da empresa  ' + response.error ? response.error : '');
            }
        });
    }

    function savePassword() {
        confirmAccount(function() {
            $page.load.init();
            $http.put(api.url + '/api/profiles/' + $user.instance.id + '/updatePassword', {
                pw: vm.account._password,
            }).success(onSuccessUpdatePassword).error(onFailUpdatePassword);

            function onSuccessUpdatePassword(response) {
                $page.toast('Senha atualizada');
                $page.load.done();
                bootstrap();
            }

            function onFailUpdatePassword(response) {
                $page.toast('não foi possível alterar sua senha ' + response && response.error ? response.error : '');
                $page.load.done();
            }
        });
    }

    function deactivateAccount(ev) {
        $mdDialog.show({
            controller: /*@ngInject*/ function($scope, $mdDialog, $location, $user, account, api) {
                $scope.user = $user.instance;
                $scope.account = account.instance;
                $scope.gender = (account.instance.profile && account.instance.profile.gender === 'F') ? 'a' : 'o';
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.confirm = function() {
                    confirmAccount(function() {
                        $page.load.init();
                        //company unlink
                        $http.put(api.url + '/api/profiles/' + $user.instance.profile.id + '/deactivateAccount').success(onSuccessDeactivate).error(onFailDeactivate);
                        //handle unlink success
                        function onSuccessDeactivate(response) {
                            $page.toast('Sua conta foi cancelada, você será desconectado em 5 segundos...');
                            $page.load.done();
                            $timeout(function() {
                                $user.instance.destroy();
                                $location.path('/');
                            }, 5000);
                        }
                        //handle unlink fail
                        function onFailDeactivate(response) {
                            $page.toast('não foi possível cancelar sua conta, por favor entre em contato ' + response.error ? response.error : '');
                        }
                    });
                };
            },
            templateUrl: 'core/account/deactivate.tpl.html',
            parent: angular.element(document.body),
            targetEvent: ev
        }).then(function() {
            this.busy = false;
        }.bind(this), function() {
            this.busy = false;
        }.bind(this));
    }

    function optOutInfo(item) {
        return item.position.length ? 'em ' + item.position.length + ' área' + (item.position.length > 1 ? 's' : '') /*+ ' associada' + (item.position.length > 1 ? 's' : '')*/ : 'nenhuma área';
    }

    function pristineAccount() {
        return (vm.accountPristine.profile.firstName === vm.account.profile.firstName) && (vm.accountPristine.profile.lastName === vm.account.profile.lastName) && (vm.accountPristine.profile.email === vm.account.profile.email);
    }

    function dirty(status) {
        vm.form.account.$dirty = status;
        vm.form.password.$dirty = status;
    }
})
'use strict';
angular.module('core.account').provider('$account',
    /**
     * @ngdoc object
     * @name core.account.$accountProvider
     * @description
     * 2 em 1 - provém configurações e a factory (ver $get) com estados/comportamentos de conta.
     **/
    /*@ngInject*/
    function $accountProvider() {
        /**
         * @ngdoc object
         * @name core.account.$accountProvider#instance
         * @propertyOf core.account.$accountProvider
         * @description 
         * Instância de conta armazenada pelo {@link core.account.service:$Account serviço}
         **/
        this.instance = {};
        /**
         * @ngdoc object
         * @name core.account.$accountProvider#_config
         * @propertyOf core.account.$accountProvider
         * @description 
         * armazena configurações
         **/
        this._config = {};
        /**
         * @ngdoc object
         * @name core.account.$accountProvider#_templateUrl
         * @propertyOf core.account.$accountProvider
         * @description 
         * url do template para a rota
         **/
        this._templateUrl = 'core/account/account.tpl.html';
        /**
         * @ngdoc function
         * @name core.account.$accountProvider#$get
         * @propertyOf core.account.$accountProvider
         * @description 
         * getter que vira factory pelo angular para se tornar injetável em toda aplicação
         * @example
         * <pre>
         * angular.module('myApp.module').controller('MyCtrl', function($account) {     
         *      console.log($account.templateUrl);
         *      //prints the current templateUrl
         *      //ex.: "core/account/account.tpl.html"     
         *      console.log($account.config('myOwnConfiguration'));
         *      //prints the current config
         *      //ex.: "{ configA: 54, configB: '=D' }"
         * })
         * </pre>
         * @return {object} Retorna um objeto correspondente a uma Factory
         **/
        this.$get = this.get = function() {
                return {
                    config: this._config,
                    templateUrl: this._templateUrl,
                    /**
                     * @ngdoc function
                     * @name core.account.$accountProvider#set
                     * @methodOf core.account.$accountProvider
                     * @description 
                     * Setar instância da conta
                     * @example
                     * <pre>
                     * var account = new $Account();
                     * $account.set(account);
                     * //now account instance can be injectable
                     * angular.module('myApp').controller('myCtrl',function($account){
                     * console.log($account.instance) //imprime objeto de instância da conta
                     * })
                     * </pre>
                     **/
                    set: function(data) {
                        this.instance = data;
                        return data;
                    },
                    /**
                     * @ngdoc function
                     * @name core.account.$accountProvider#destroy
                     * @methodOf core.account.$accountProvider
                     * @description 
                     * Apagar instância da conta
                     * @example
                     * <pre>
                     * var account = new $Account();
                     * $account.set(account);
                     * //now account instance can be injectable
                     * angular.module('myApp').controller('myCtrl',function($account){
                     * $account.instance.destroy() //apaga instância da conta
                     * })
                     * </pre>
                     **/
                    destroy: function() {
                        this.instance = {};
                    }
                }
            }
            /**
             * @ngdoc function
             * @name core.account.$accountProvider#config
             * @methodOf core.account.$accountProvider
             * @description
             * getter/setter para configurações
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($accountProvider) {     
             *     $accountProvider.config('myOwnConfiguration', {
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
            }
            /**
             * @ngdoc function
             * @name core.account.$accountProvider#templateUrl
             * @methodOf core.account.$accountProvider
             * @description
             * getter/setter para url do template
             * @example
             * <pre>
             * angular.module('myApp.module').config(function($accountProvider) {     
             *      $accountProvider.templateUrl('app/account/my-account.html')
             * })
             * </pre>
             * @param {string} val url do template
             **/
        this.templateUrl = function(val) {
            if (val) return this._templateUrl = val;
            else return this._templateUrl;
        }
    });
'use strict';
angular.module('core.account').service('$Account', /*@ngInject*/ function($http, $mdDialog, $page, api) {
    /**
     * @ngdoc service
     * @name core.account.service:$Account
     * @description 
     * Model account
     * @param {object} params Propriedades da instância
     **/
    var Account = function(params) {
            params = params ? params : {};
            if (typeof params === 'object') {
                for (var k in params) {
                    if (params.hasOwnProperty(k)) {
                        this[k] = params[k];
                    }
                }
            }
            /**
             * @ngdoc object
             * @name core.account.service:$Account#password
             * @propertyOf core.account.service:$Account
             * @description 
             * destinado a confirmação da conta
             **/
            this.password = '';
            /**
             * @ngdoc object
             * @name core.account.service:$Account#_password
             * @propertyOf core.account.service:$Account
             * @description 
             * destinado a mudança de password
             **/
            this._password = 'lolggiziafkbase';
            /**
             * @ngdoc object
             * @name core.account.service:$Account#__password
             * @propertyOf core.account.service:$Account
             * @description 
             * destinado a confirmação da mudança de password
             **/
            this.__password = 'lolggiziafkbase';
        }
        /**
         * @ngdoc function
         * @name core.account.service:$Account:confirm
         * @methodOf core.account.service:$Account
         * @description
         * Confirmação de identidade da conta
         * @example
         * <pre>
         * var account = new $Account();
         * account.confirm(onSuccessConfirm, onFailConfirm);
         * function onSuccessConfirm(response) {
         *   //do stuff on success
         * }
         * function onFailConfirm(response) {
         *   //do stuff on error
         * } 
         * </pre> 
         * @param {function} cbSuccess callback de sucesso
         * @param {function} cbError callback de erro
         */
    Account.prototype.confirm = function(cbSuccess, cbError) {
        if (this.busy) return;
        this.busy = true;
        var vm = this;
        $mdDialog.show({
            controller: /*@ngInject*/ function($scope, $mdDialog, $user, account, api) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.confirm = function() {
                    $page.load.init();
                    var url = api.url + '/api/users';
                    $http.post(url + '/confirmIdentity', {
                        //id: vm.id, //nao necessario, recupero pelo req.user no express
                        pw: vm.password
                    }).success(function(response) {
                        $page.load.done();
                        this.busy = false;
                        vm.password = '';
                        $mdDialog.hide();
                        if (cbSuccess) return cbSuccess(response);
                    }.bind(this)).error(function(response) {
                        $page.load.done();
                        this.busy = false;
                        vm.password = '';
                        $page.toast('Senha incorreta');
                        if (cbError) return cbError(response);
                    }.bind(this));
                };
                $scope.user = $user.instance;
                $scope.account = account.instance;
            },
            templateUrl: 'core/account/confirm.tpl.html',
            parent: angular.element(document.body),
            //targetEvent: ev,
        }).then(function() {
            this.busy = false;
        }.bind(this), function() {
            this.busy = false;
        }.bind(this));
    }
    return Account;
})
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
            authed: /*@ngInject*/ function($auth, $location, $login) {
                if ($auth.isAuthenticated()) {
                    $location.path($login.config.auth.loginSuccessRedirect);
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
        authed: /*@ngInject*/ function($auth, $location, $login) {
            if ($auth.isAuthenticated()) {
                $location.path($login.config.auth.loginSuccessRedirect);
            }
        }
    });
    $locationProvider.html5Mode(true);
})
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
                    templateUrl: this._templateUrl
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
    });
'use strict';
/**
 * @ngdoc object
 * @name core.login.controller:$LogoutCtrl
 * @description 
 * Destruir sessão
 * @requires core.login.$user
 **/
angular.module('core.login').controller('$LogoutCtrl', /*@ngInject*/ function(user) {
    $user.instance.destroy();
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
angular.module('app.kit').controller('$AppCtrl', /*@ngInject*/ function(setting, $rootScope, $scope, $state, $location, $mdSidenav, $timeout, $auth, $page, $User, $user, enviroment, $menu, $login) {
    var vm = this;
    vm.enviroment = enviroment;
    //
    // SEO
    //
    $page.title(setting.title);
    $page.description(setting.description);
    //
    // OPEN GRAPH
    //
    $page.ogLocale(setting.ogLocale);
    $page.ogSiteName(setting.ogSiteName);
    $page.ogTitle(setting.ogTitle);
    $page.ogDescription(setting.ogDescription);
    $page.ogUrl(setting.ogUrl);
    $page.ogImage(setting.ogImage);
    $page.ogSection(setting.ogSection);
    $page.ogTag(setting.ogTag);
    //
    // Moment
    //
    moment.locale('pt_BR');
    //
    // Watchers
    //
    //
    // Events
    //  
    $rootScope.$on('CompanyIdUpdated', function(e, nv, ov) {
        if (nv != ov) {
            //quando alterar company, atualizar factory  
            var company = $user.instance.filterCompany(nv);
            $user.instance.current('company', company);
            $user.instance.session('company', {
                _id: company._id,
                name: company.name
            });
            $menu.api().close();
            bootstrap();
        }
    });
    $rootScope.$on('AccountUpdated', function() {
        bootstrap();
    });
    $rootScope.$on('Unauthorized', function() {
        $user.instance.destroy();
    });
    //
    // BOOTSTRAP
    //  
    bootstrap(true);

    function bootstrap(withUser) {
        //nonWww2www();
        //http2https(); //@bug - bug com _escaped_fragment_
        if (withUser) {
            var newUser = new $User();
            $user.set(newUser);
        }
        vm.user = $user.instance;
        vm.$page = $page;
        vm.setting = setting;
        vm.year = moment().format('YYYY');
        vm.state = $state;
        vm.isAuthed = $auth.isAuthenticated;
        vm.logout = logout;
        vm.$menu = $menu.api();
        vm.loginConfig = $login.config;
        vm.iframe = $location.hash() === 'iframe' ? true : false;
    }
    //
    // Behaviors
    //
    function logout() {
        $mdSidenav('left').close();
        $timeout(function() {
            $user.instance.destroy(true);
            bootstrap(true);
        }, 500);
    }
    //
    // Redirect http to https //@bug - bug com _escaped_fragment_ - redirecionando via CF
    // https://github.com/esgrupo/livejob/issues/15
    //
    // function http2https() {
    //     //tenho https configurado
    //     if (setting.https.length) {
    //         //host esta na configuração
    //         if (_.indexOf(setting.https, $location.host().replace(/www./g, '')) != -1) {
    //             //protocolo atual não é seguro            
    //             if ($location.protocol() !== 'https') {
    //                 //estou na home #15 bug com _escaped_fragment_
    //                 if ($state.current.name === 'app.home') {
    //                     //bingo
    //                     $window.location.href = $location.absUrl().replace(/http/g, 'https');
    //                 }
    //             }
    //         }
    //     }
    // }
    //
    // Redirect non-www to www
    // https://github.com/esgrupo/livejob/issues/17
    //
    function nonWww2www() {
        //redirecionar www
        if (setting.redirWww) {
            //se estiver em produção
            if (enviroment === 'production') {
                if (!hasWww()) {
                    $window.location.href = 'https://www.' + $location.host() + $location.path();
                }
            }
        }
    }

    function hasWww() {
        var www = new RegExp("www.");
        return www.test($location.host());
    }
})
angular.module("app.env", []).constant("enviroment", "development").constant("api", {
    url: "http://localhost:9000"
});
'use strict';
/* jshint undef: false, unused: false, shadow:true, bitwise: false, -W041: false */
angular.module("ngLocale", [], ["$provide",
    function($provide) {
        var PLURAL_CATEGORY = {
            ZERO: "zero",
            ONE: "one",
            TWO: "two",
            FEW: "few",
            MANY: "many",
            OTHER: "other"
        };

        function getDecimals(n) {
            n = n + '';
            var i = n.indexOf('.');
            return (i == -1) ? 0 : n.length - i - 1;
        }

        function getVF(n, opt_precision) {
            var v = opt_precision;

            if (undefined === v) {
                v = Math.min(getDecimals(n), 3);
            }

            var base = Math.pow(10, v);
            var f = ((n * base) | 0) % base;
            return {
                v: v,
                f: f
            };
        }

        function getWT(v, f) {
            if (f === 0) {
                return {
                    w: 0,
                    t: 0
                };
            }

            while ((f % 10) === 0) {
                f /= 10;
                v--;
            }

            return {
                w: v,
                t: f
            };
        }

        $provide.value("$locale", {
            "DATETIME_FORMATS": {
                "AMPMS": [
                    "AM",
                    "PM"
                ],
                "DAY": [
                    "domingo",
                    "segunda-feira",
                    "ter\u00e7a-feira",
                    "quarta-feira",
                    "quinta-feira",
                    "sexta-feira",
                    "s\u00e1bado"
                ],
                "MONTH": [
                    "janeiro",
                    "fevereiro",
                    "mar\u00e7o",
                    "abril",
                    "maio",
                    "junho",
                    "julho",
                    "agosto",
                    "setembro",
                    "outubro",
                    "novembro",
                    "dezembro"
                ],
                "SHORTDAY": [
                    "dom",
                    "seg",
                    "ter",
                    "qua",
                    "qui",
                    "sex",
                    "s\u00e1b"
                ],
                "SHORTMONTH": [
                    "jan",
                    "fev",
                    "mar",
                    "abr",
                    "mai",
                    "jun",
                    "jul",
                    "ago",
                    "set",
                    "out",
                    "nov",
                    "dez"
                ],
                "fullDate": "EEEE, d 'de' MMMM 'de' y",
                "longDate": "d 'de' MMMM 'de' y",
                "medium": "dd/MM/y HH:mm:ss",
                "mediumDate": "dd/MM/y",
                "mediumTime": "HH:mm:ss",
                "short": "dd/MM/yy HH:mm",
                "shortDate": "dd/MM/yy",
                "shortTime": "HH:mm"
            },
            "NUMBER_FORMATS": {
                "CURRENCY_SYM": "R$",
                "DECIMAL_SEP": ",",
                "GROUP_SEP": ".",
                "PATTERNS": [{
                    "gSize": 3,
                    "lgSize": 3,
                    "maxFrac": 3,
                    "minFrac": 0,
                    "minInt": 1,
                    "negPre": "-",
                    "negSuf": "",
                    "posPre": "",
                    "posSuf": ""
                }, {
                    "gSize": 3,
                    "lgSize": 3,
                    "maxFrac": 2,
                    "minFrac": 2,
                    "minInt": 1,
                    "negPre": "\u00a4-",
                    "negSuf": "",
                    "posPre": "\u00a4",
                    "posSuf": ""
                }]
            },
            "id": "pt-br",
            "pluralCat": function(n, opt_precision) {
                var i = n | 0;
                var vf = getVF(n, opt_precision);
                var wt = getWT(vf.v, vf.f);
                if (i == 1 && vf.v == 0 || i == 0 && wt.t == 1) {
                    return PLURAL_CATEGORY.ONE;
                }
                return PLURAL_CATEGORY.OTHER;
            }
        });
    }
]);
   'use strict';
   angular.module('app.kit').provider('$app',
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
            * @name app.kit.$appProvider#_sidenavUrl
            * @propertyOf app.kit.$appProvider
            * @description 
            * url do template para sidenav
            **/
           this._sidenavUrl = 'core/page/menu/sidenav.tpl.html';
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
           this.$get = this.get = function() {
                   return {
                       config: this._config,
                       layoutUrl: this._layoutUrl,
                       toolbarUrl: this._toolbarUrl,
                       sidenavUrl: this._sidenavUrl
                   }
               }
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
               }
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
               }
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
               }
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
           }
       });
 'use strict';
 angular.module('app.kit').run( /*@ngInject*/ function() {});
angular.module("app.setting", []).constant("setting", {
    name: "app kit",
    slug: "app-kit",
    version: "0.0.1",
    title: "app kit",
    baseUrl: "",
    titleSeparator: " — ",
    description: "app-kit",
    copyright: "app-kit",
    google: {
        clientId: "",
        language: "pt-BR"
    },
    facebook: {
        scope: "email",
        appId: "",
        appSecret: "",
        language: "pt-BR"
    },
    https: [],
    redirWww: false,
    ogLocale: "pt_BR",
    ogSiteName: "app-kit",
    ogTitle: "app-kit",
    ogDescription: "app-kit",
    ogUrl: "",
    ogImage: "",
    ogSection: "app-kit",
    ogTag: "app-kit"
});
'use strict';
/*global window*/
angular.module('core.page').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.page', {
        protected: false,
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
    //$urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);
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
/**
 * @ngdoc service
 * @name core.page.factory:$page
 * @description 
 * Comportamentos e estados da página
 **/
angular.module('core.page').factory('$page', /*@ngInject*/ function($mdToast) {
    this._title = '';
    this._description = '';
    this._ogSiteName = '';
    this._ogTitle = '';
    this._ogDescription = '';
    this._ogUrl = '';
    this._ogImage = '';
    this._ogSection = '';
    this._ogTag = '';
    this._logo = '';
    this._logoWhite = '';
    return {
        load: load(),
        progress: progress(),
        toast: toast,
        title: title,
        description: description,
        ogLocale: ogLocale,
        ogSiteName: ogSiteName,
        ogTitle: ogTitle,
        ogDescription: ogDescription,
        ogUrl: ogUrl,
        ogImage: ogImage,
        ogSection: ogSection,
        ogTag: ogTag
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#title
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#description
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#logo
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para logo
     * @param {string} value caminho para logomarca    
     **/
    function logo(value) {
        if (value) return this._logo = value;
        else return this._logo;
    }

    /**
     * @ngdoc function
     * @name core.page.factory:$page#logoWhite
     * @methodOf core.page.factory:$page
     * @description
     * getter/getter para logo na versão branca com fundo transparente
     * @param {string} value caminho para logomarca    
     **/
    function logoWhite(value) {
        if (value) return this._logoWhite = value;
        else return this._logoWhite;
    }
    /**
     * @ngdoc function
     * @name core.page.factory:$page#ogLocale
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#ogSiteName
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#ogTitle
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#ogDescription
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#ogUrl
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#ogImage
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#ogSection
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#ogTag
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#load
     * @methodOf core.page.factory:$page
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
     * @name core.page.factory:$page#toast
     * @methodOf core.page.factory:$page
     * @description
     * mostra uma mensagem de aviso
     * @param {string} msg mensagem
     * @param {integer} time tempo em milisegundos
     **/
    function toast(msg, time) {
        time = time ? time : 5000;
        $mdToast.show($mdToast.simple().content(msg).position('bottom right').hideDelay(time));
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
angular.module('core.profile').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider, $menuProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.profile', {
        protected: true,
        url: '/profile/',
        views: {
            'content': {
                templateUrl: 'core/profile/profile.tpl.html',
                controller: '$ProfileCtrl as vm'
            }
        },
        resolve: {
            authed: /*@ngInject*/ function($auth, $location) {
                if (!$auth.isAuthenticated()) {
                    $location.path('/login/');
                    return false;
                } else {
                    return true;
                }
            },
            companySession: /*@ngInject*/ function($state, user) {
                var userInstance = $user.instance.session('company');
                if (userInstance && userInstance.ref) {
                    $state.go('app.landing', {
                        ref: userInstance.ref
                    });
                    return true;
                }
                return false;
            },
            companyCurrent: /*@ngInject*/ function($location, $timeout, $user, layout) {
                if (!$user.instance.current('company') || !$user.instance.current('company')._id) {
                    $page.toast('Acesse o LiveJob de alguma empresa para criar conexões', 10000);
                    $timeout(function() {
                        $location.path('/');
                    }, 1000)
                    return false;
                }
                return true;
            },
            closeMenu: /*@ngInject*/ function($timeout, $auth, $menu) {
                if ($auth.isAuthenticated()) {
                    $timeout(function() {
                        $menu.api().close();
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
    $menuProvider.set({
        name: 'Perfil',
        type: 'link',
        icon: 'fa fa-street-view',
        url: '/profile/',
        state: 'app.profile'
    });
    //
    // Set Toolbar Menu
    //
    // $menuProvider.setToolbarMenu({
    //     id: 'filtros',
    //     name: 'Filtros',
    //     type: 'action',
    //     icon: 'fa fa-sliders'
    // });
});
'use strict';
angular.module('core.profile').controller('$ProfileCtrl', /*@ngInject*/ function(companySession, companyCurrent, $rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, $utils, $page, $user, setting) {
    var vm = this;
    vm.companySession = companySession;
    vm.companyCurrent = companyCurrent;
    //
    // SEO
    //
    $page.title(setting.title);
    $page.description(setting.description);
    //
    // Events
    //
    $rootScope.$on('CompanyIdUpdated', function() {});
    //
    // Watchers
    //
    //
    // Bootstrap
    //
    //
    bootstrap();

    function bootstrap() {}
})
'use strict';
angular.module('core.profile').directive('profile', /*@ngInject*/ function() {
    return {
        templateUrl: "core/profile/profile.tpl.html",
        controller: '$ProfileCtrl',
        controllerAs: 'vm'
    }
})
'use strict';
angular.module('core.profile').service('$Profile', /*@ngInject*/ function($http, string, $page, $user, api, moment) {
    /**
     * @ngdoc service
     * @name core.profile.$Profile
     * @description 
     * Comportamentos e estados de perfil do usuário
     * @param {object} params Propriedades da instância
     **/
    var Profile = function(params) {
            /**
             * @ngdoc object
             * @name core.profile.$Profile#params
             * @propertyOf core.profile.$Profile
             * @description 
             * Propriedades da instância
             **/
            params = params ? params : {};
            if (typeof params === 'object') {
                for (var k in params) {
                    if (params.hasOwnProperty(k)) {
                        this[k] = params[k];
                    }
                }
            }
            /**
             * @ngdoc object
             * @name core.profile.$Profile#id
             * @propertyOf core.profile.$Profile
             * @description 
             * Id do perfil
             **/
            this.id = params._id ? params._id : false;
            /**
             * @ngdoc object
             * @name core.profile.$Profile#role
             * @propertyOf core.profile.$Profile
             * @description 
             * Regra de apresentação
             **/
            this.role = params.role ? params.role : [];
            /**
             * @ngdoc object
             * @name core.profile.$Profile#active
             * @propertyOf core.profile.$Profile
             * @description 
             * Status do perfil
             **/
            this.active = params.active ? params.active : false;
            /**
             * @ngdoc object
             * @name core.profile.$Profile#created
             * @propertyOf core.profile.$Profile
             * @description 
             * Data de criação
             **/
            this.created = params.created ? params.created : moment().format();
            /**
             * @ngdoc object
             * @name core.profile.$Profile#positions
             * @propertyOf core.profile.$Profile
             * @description 
             * Posições de trabalho (@todo migrar para aplicações filhas)
             **/
            this.positions = params.role ? getWorkPosition(params.role) : [];
            /**
             * @ngdoc object
             * @name core.profile.$Profile#education
             * @propertyOf core.profile.$Profile
             * @description 
             * Educação (@todo migrar para aplicações filhas)
             **/
            if (this.education && this.education.courses.length) {
                this.education.courses.forEach(function(row, i) {
                    if (row.name)
                        this.education.courses[i].name = string(row.name).decodeHTMLEntities();
                }.bind(this))
            }
        }
        /**
         * @ngdoc function
         * @name core.profile.$Profile:save
         * @methodOf core.profile.$Profile
         * @description
         * Salvar perfil
         * @param {function} cbSuccess callback de sucesso
         * @param {function} cbError callback de erro
         */
    Profile.prototype.save = function(cbSuccess, cbError) {
            $page.load.init();
            if (this.busy) return;
            this.busy = true;
            var url = api.url + '/api/profiles';
            $http.put(url + '/' + this.id, this).success(function(response) {
                $page.load.done();
                this.busy = false;
                $page.toast('Seu perfil foi atualizado, ' + response.firstName + '.');
                if (cbSuccess)
                    return cbSuccess(response);
            }.bind(this)).error(function(response) {
                $page.load.done();
                this.busy = false;
                $page.toast('Problema ao atualizar perfil');
                if (cbError)
                    return cbError(response);
            }.bind(this));
        }
        /**
         * @ngdoc function
         * @name core.profile.$Profile:getWorkPosition
         * @methodOf core.profile.$Profile
         * @description
         * Obter a lista de cargos (@todo migrar para aplicações filhas)
         * @return {array} lista de cargos desejados
         */
    function getWorkPosition() {
        var result = $user.instance.getWorkPosition($user.instance.current('company')._id);
        return result.length ? result : [];
    }
    return Profile;
})
'use strict';
/**
 * @ngdoc service
 * @name core.user.factory:$user
 * @description 
 * Factory para injeção
 * @return {object} com metodos para setar e destruir a instância da factory
 **/
angular.module('core.user').factory('$user',
    /*@ngInject*/
    function() {
        /**
         * @ngdoc object
         * @name core.user.factory:$user#instance
         * @propertyOf core.user.factory:$user
         * @description 
         * Instância de usuário armazenada pelo {@link core.user.service:$User serviço}
         **/
        this.instance = {};

        return {
            /**
             * @ngdoc function
             * @name core.user.factory:$user#set
             * @methodOf core.user.factory:$user
             * @description 
             * Setar instância do usuário
             * @example
             * <pre>
             * var user = new $User();
             * $user.set(user);
             * //now user instance can be injectable
             * angular.module('myApp').controller('myCtrl',function($user){
             * console.log($user.instance) //imprime objeto de instância do usuário
             * })
             * </pre>
             **/
            set: function(data) {
                this.instance = data;
                return data;
            },
            /**
             * @ngdoc function
             * @name core.user.factory:$user#destroy
             * @methodOf core.user.factory:$user
             * @description 
             * Apagar instância do usuário
             * @example
             * <pre>
             * var user = new $User();
             * $user.set(user);
             * //now user instance can be injectable
             * angular.module('myApp').controller('myCtrl',function($user){
             * $user.instance.destroy() //apaga instância do usuário
             * })
             * </pre>
             **/
            destroy: function() {
                this.instance = {};
            }
        }
    })
'use strict';
angular.module('core.user').provider('UserSetting', /*@ngInject*/ function() {
    this.setting = {};
    this.$get = this.get = function() {
        return this.setting;
    }
    this.set = function(key, val) {
        this.setting[key] = val;
    }
})
'use strict';
/* global window */
angular.module('core.user').service('$User', /*@ngInject*/ function($state, $http, $auth, $timeout, UserSetting, $menu, $page, setting) {
    /**
     * @ngdoc service
     * @name core.user.service:$User
     * @description 
     * Model de usuário
     * @param {object} params propriedades da instância
     * @param {bool} alert aviso de boas vindas
     * @param {string} message mensagem do aviso
     **/
    var User = function(params, alert, message) {
            /**
             * @ngdoc object
             * @name core.user.service:$User#params
             * @propertyOf core.user.service:$User
             * @description 
             * Propriedades da instância
             **/
            params = params ? params : {};
            /**
             * @ngdoc object
             * @name core.user.service:$User#currentData
             * @propertyOf core.user.service:$User
             * @description 
             * Armazena dados customizados na instância do usuário
             **/
            this.currentData = {};
            /**
             * @ngdoc object
             * @name core.user.service:$User#sessionData
             * @propertyOf core.user.service:$User
             * @description 
             * Armazena dados customizados no localStorage do usuário
             **/
            this.sessionData = {};
            this.init(params, alert, message);
        }
        /**
         * @ngdoc function
         * @name core.user.service:$User:init
         * @methodOf core.user.service:$User
         * @description
         * Inicialização
         * @param {object} params propriedades da instância
         * @param {bool} alert aviso de boas vindas
         * @param {string} message mensagem do aviso
         */
    User.prototype.init = function(params, alert, message) {
            //set params
            if (typeof params === 'object') {
                for (var k in params) {
                    if (params.hasOwnProperty(k)) {
                        this[k] = params[k];
                    }
                }
            }
            if (params._id) {
                var gender = (params.profile && params.profile.gender === 'F') ? 'a' : 'o',
                    roleForCompany = false;
                if (UserSetting.roleForCompany != 'user') roleForCompany = UserSetting.roleForCompany;
                if (roleForCompany ? params[roleForCompany].role.length : params.role.length) {
                    this.current('company', getCompany(this));
                    this.current('companies', getCompanies(this));
                }
                if (!message) message = 'Olá ' + params.profile.firstName + ', você entrou. Bem vind' + gender + ' de volta.';
                if (alert) $page.toast(message, 10000);
                if (this.session('company') && this.session('company')._id) {
                    this.current('company', this.filterCompany(this.session('company')._id));
                }
                setStorageUser(params);
            } else {
                params = getStorageUser();
                if (params) return this.init(params);
            }
            return false;
        }
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
    User.prototype.current = function(key, val) {
            if (key && val) {
                if (!this.currentData) this.currentData = {};
                this.currentData[key] = val;
            } else if (key) {
                return this.currentData && this.currentData[key] ? this.currentData[key] : false;
            }
            return this.currentData;
        }
        /**
         * @ngdoc function
         * @name core.user.service:$User:session
         * @methodOf core.user.service:$User
         * @description
         * Adiciona informações customizadas no formato chave:valor à instância corrente do usuário e ao localStorage
         * @param {string} key chave
         * @param {*} val valor
         */
    User.prototype.session = function(key, val) {
        if (key && val) {
            if (!this.sessionData) this.sessionData = {};
            this.sessionData[key] = val;
            setStorageSession(this.sessionData);
        } else if (key) {
            this.sessionData = getStorageSession();
            return this.sessionData && this.sessionData[key] ? this.sessionData[key] : false;
        }
        this.sessionData = getStorageSession();
        return this.sessionData;
    }

    /**
     * @ngdoc function
     * @name core.user.service:$User:filterCompany
     * @methodOf core.user.service:$User
     * @description
     * Buscar uma empresa
     * @param {string} _id id da empresa
     * @return {object} objeto da empresa
     */
    User.prototype.filterCompany = function(_id) {
        var result = false,
            companies = getCompanies(this);
        if (companies && companies.length) {
            companies.forEach(function(row) {
                if (row.company._id === _id) {
                    result = row.company;
                    return;
                }
            });
        }
        return result;
    }

    /**
     * @ngdoc function
     * @name core.user.service:$User:destroy
     * @methodOf core.user.service:$User
     * @description
     * Destruir sessão do usuário
     * @param {bool} alert mensagem de aviso (você saiu)
     */
    User.prototype.destroy = function(alert) {
            $auth.logout();
            $auth.removeToken();
            removeStorageSession();
            removeStorageUser();
            $page.load.done();
            if (alert) $page.toast('Você saiu', 3000);
        }
        /**
         * @ngdoc function
         * @name core.user.service:$User:getWorkPosition
         * @methodOf core.user.service:$User
         * @description
         * Obter a lista de cargos (@todo migrar para aplicações filhas)
         * @param {string} companyid id da empresa
         * @return {array} lista de cargos desejados
         */
    User.prototype.getWorkPosition = function(companyid) {
        var result = false,
            companies = getCompanies(this);
        if (companies.length) {
            companies.forEach(function(row) {
                if (row.company._id === companyid) {
                    result = row.position;
                    return;
                }
            });
        }
        return result;
    }
    User.prototype.profileUpdate = function(profile) {
        this.profile = profile;
        setStorageUser(this);
    }
    User.prototype.getCompany = getCompany;
    User.prototype.getCompanies = getCompanies;

    function token() {
        return $auth.getToken();
    }

    function getStorageUser() {
        return JSON.parse(window.localStorage.getItem(setting.slug + '.user'));
    }

    function setStorageUser(user) {
        return window.localStorage.setItem(setting.slug + '.user', JSON.stringify(user));
    }

    function removeStorageUser() {
        window.localStorage.removeItem(setting.slug + '.user');
    }

    function getStorageSession() {
        return JSON.parse(window.localStorage.getItem(setting.slug + '.session'));
    }

    function setStorageSession(session) {
        return window.localStorage.setItem(setting.slug + '.session', JSON.stringify(session));
    }

    function removeStorageSession() {
        window.localStorage.removeItem(setting.slug + '.session');
    }

    function getCompanies(userInstance) {
        var roleForCompany = false;
        if (UserSetting.roleForCompany != 'user') roleForCompany = UserSetting.roleForCompany;
        return roleForCompany && userInstance[roleForCompany] ? userInstance[roleForCompany].role : userInstance.role;
    }

    function getCompany(userInstance) {
        var roleForCompany = false;
        if (UserSetting.roleForCompany != 'user') roleForCompany = UserSetting.roleForCompany;
        return roleForCompany ? userInstance[roleForCompany].role[0].company : userInstance.role[0].company;
    }
    return User;
})
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
angular.module('core.account').controller('OptOutCtrl', /*@ngInject*/ function($scope, $location, $mdDialog) {
    $scope.callAction = function(ev) {
        var confirm = $mdDialog.confirm().parent(angular.element(document.body)).title($scope.alertTitle).content($scope.alertInfo).ariaLabel($scope.alertTitle).ok($scope.alertOk).cancel($scope.alertCancel).targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.$emit('OptOutItemUnlinked', $scope.itemId);
        }, function() {});
    }
});
'use strict';
angular.module('core.account').directive('optOut', /*@ngInject*/ function() {
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
        templateUrl: 'core/account/optOut/optOut.tpl.html',
        controller: 'OptOutCtrl',
        controllerAs: 'vm',
        replace: true
    }
})
'use strict';
angular.module('facebook.login').config(function(FacebookProvider, setting) {
    FacebookProvider.init({
        version: 'v2.3',
        appId: setting.facebook.appId,
        locale: 'pt_BR'
    });
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
        templateUrl: "core/login/facebook/facebookLogin.tpl.html",
        scope: {
            user: '='
        },
        controller: 'FacebookLoginCtrl',
        controllerAs: 'fb'
    }
})
'use strict';
angular.module('facebook.login').factory('fbLogin', /*@ngInject*/ function($auth, $mdToast, $http, Facebook, $user, $page, api, setting) {
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
                var msg = false;
                var gender = (response.data.user.profile && response.data.user.profile.gender && response.data.user.profile.gender === 'F') ? 'a' : 'o';
                if (response.data.new) msg = 'Olá ' + response.data.user.profile.firstName + ', você entrou. Seja bem vind' + gender + ' ao ' + setting.name;
                $auth.setToken(response.data.token);
                $user.instance.init(response.data.user, true, msg);
                if (cbSuccess)
                    cbSuccess()
            }
            var onFail = function(result) {
                $page.load.done();
                $mdToast.show($mdToast.simple()
                    .content(result.data ? result.data : 'server away')
                    .position('bottom right')
                    .hideDelay(3000))
                if (cbFail)
                    cbFail()
            }
            var gender = '';
            gender = fbUser.gender && fbUser.gender === 'female' ? 'F' : gender;
            $http.post(api.url + '/auth/facebook', {
                provider: 'facebook',
                id: fbUser.id,
                firstName: fbUser.first_name,
                lastName: fbUser.last_name,
                email: fbUser.email,
                gender: gender,
                applicant: true
            }).then(onSuccess, onFail);
        }
        var onFail = function() {}
        me().then(onSuccess, onFail);
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
angular.module('core.login').controller('$LoginFormCtrl', /*@ngInject*/ function($scope, $auth, $page, $mdToast, $user) {
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
        var onSuccess = function(result) {
            $page.load.done();
            $user.instance.init(result.data.user, true);
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.message ? result.data.message : 'server away').position('bottom right').hideDelay(3000))
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
 **/
angular.module('core.login').directive('loginForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '=',
            user: '='
        },
        restrict: 'EA',
        templateUrl: "core/login/form/loginForm.tpl.html",
        controller: '$LoginFormCtrl',
        controllerAs: 'vm',
        link: function() {}
    }
});
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
        })
            .execute(handleResponse);
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
            $user.instance.init(response.data.user, true, msg);
        }
        var onFail = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple()
                .content(result.data ? result.data : 'server away')
                .position('bottom right')
                .hideDelay(3000))
        }
        $http.post(api.url + '/auth/google', {
            provider: 'google',
            id: glUser.id,
            firstName: glUser.name.givenName,
            lastName: glUser.name.familyName,
            email: glUser.emails[0].value,
            gender: glUser.gender
        })
            .then(onSuccess, onFail);
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
angular.module('core.login').controller('RegisterFormCtrl', /*@ngInject*/ function($scope, $auth, $mdToast, $user, $page, setting) {
    $scope.register = register;
    $scope.sign = {};

    function register(sign) {
        $page.load.init();
        var onSuccess = function(result) {
            $page.load.done();
            $user.instance.init(result.data.user, true, 'Olá ' + result.data.user.profile.firstName + ', você entrou para o ' + setting.name, 10000);
        }
        var onError = function(result) {
            $page.load.done();
            $mdToast.show($mdToast.simple().content(result.data && result.data.error ? result.data.error : 'server away').position('bottom right').hideDelay(10000))
        }
        $auth.signup({
            firstName: sign.firstName,
            lastName: sign.lastName,
            email: sign.email,
            password: sign.password,
            provider: 'local'
        }).then(onSuccess, onError);
    }

})
'use strict';
angular.module('core.login').directive('registerForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '='
        },
        templateUrl: "core/login/register/registerForm.tpl.html",
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
        this.mainMenu = [];
        this.toolbarMenu = [];
        this.$get = this.get = /*@ngInject*/ function($rootScope, $mdSidenav, $location) {
            return {
                main: this.mainMenu,
                toolbar: this.toolbarMenu,
                api: api
            }
        }
        this.set = function(menu) {
            this.mainMenu.push(menu);
        }
        this.setToolbar = function(menu) {
                this.toolbarMenu.push(menu);
            }
            //
            // MENU API
            //
        function api() {
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
                sections: this.mainMenu,
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
        //
        // MENU SECTIONS
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
        templateUrl: 'core/layout/menu/menuLink.tpl.html',
        link: function($scope, $element) {
            var controller = $element.parent().controller();
            $scope.isSelected = function() {
                return controller.menu.isSelected($scope.section);
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
        templateUrl: 'core/layout/menu/menuToggle.tpl.html',
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
/* global moment, confirm */
angular.module('core.profile').controller('ProfileFormCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, $log, $utils, $page, $user, $Profile, setting, api) {
    var vm = this;
    //
    // Estados Brasileiros
    //
    vm.states = $utils.brStates();
    //
    // Tipos de CNH
    //
    vm.cnh = ["A", "B", "C", "D"];
    //
    // Idiomas
    //
    vm.idioms = ["Inglês", "Italiano", "Espanhol", "Francês", "Japonês", "Russo", "Aramaico", "Árabe", "Mandarim"];
    vm.idiomsLevel = ["Básico", "Intermediário", "Fluente"];
    //
    // Form
    //
    vm.save = save;
    vm.add = add;
    vm.remove = remove;
    vm.forms = {
        profile: {}
    };
    vm.hasFormError = hasFormError;
    vm.hasFormErrorToast = hasFormErrorToast;
    vm.setAddrByCep = setAddrByCep;
    vm.hideActionAddWhen = hideActionAddWhen;
    vm.cycleXpMonths = cycleXpMonths;
    vm.education = {};
    vm.education.schooling = [];
    vm.education.technical = [];
    vm.education.graduation = [];
    //
    // Tabs
    //
    var tabs = [{
        name: 'Cargos',
        slug: 'positions',
        title: "<i class='fa fa-heartbeat'></i> Área de Interesse",
        subtitle: "Escolha em quais cargos você se encaixa em <strong>" + $user.instance.current('company').name + "</strong>",
        template: "core/profile/form/profileForm-step1.tpl.html"
    }, {
        name: 'Dados Pessoais',
        slug: 'personal',
        title: "<i class='fa fa-smile-o'></i> Dados Pessoais",
        subtitle: "Algumas informações sobre você",
        template: "core/profile/form/profileForm-step2.tpl.html"
    }, {
        name: 'Curso',
        slug: 'graduation',
        title: "<i class='fa fa-graduation-cap'></i> Formação e Cursos",
        subtitle: "Nos informe sua formação escolar e cite alguns cursos que já tenha realizado",
        template: "core/profile/form/profileForm-step3.tpl.html"
    }, {
        name: 'Experiência',
        slug: 'xps',
        title: "<i class='fa fa-flask'></i> Experiências",
        subtitle: "Conte-nos um pouco sobre sua trajetória.",
        template: "core/profile/form/profileForm-step4.tpl.html"
    }, {
        name: 'Idioma',
        slug: 'idioms',
        title: "<i class='fa fa-language'></i> Idiomas",
        subtitle: "Especifique alguns idiomas que você fale",
        template: "core/profile/form/profileForm-step5.tpl.html"
    }];
    $scope.tabs = tabs;
    $scope.tabCurrent = 0;
    //
    // Education
    //
    function education() {
        var url = api.url + '/api/configs/education';
        var onSuccess = function(education) {
            vm.education = education;
            $user.instance.current('education', education);
            $timeout(function() {
                vm.educationLoading = false;
            }, 1000);
        }
        var onFail = function() {
            $page.toast('Impossible to load education options');
            $timeout(function() {
                vm.educationLoading = false;
            }, 1000);
        }
        if (!$user.instance.current('education')) {
            vm.educationLoading = true;
            $http.post(url, {
                company: $user.instance.current().company._id
            }).success(onSuccess).error(onFail);
        } else {
            vm.education = $user.instance.current('education');
        }
    }
    //
    // Events
    //
    $rootScope.$on('CompanyIdUpdated', function() {
        bootstrap($user.instance.profile);
        // $timeout(function() {
        $scope.tabCurrent = 0;
        // }, 2000)
    });
    //
    // Watchers
    //           
    $scope.$watch('tabCurrent', function() {
        if (tabs[$scope.tabCurrent].slug === 'graduation') {
            education();
        }
    });
    $scope.$watch('vm.profile.positions', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.doc.cnh', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.courses', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.graduation', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.schooling', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.technical', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.education.idioms', function(nv, ov) {
        if (nv != ov) vm.forms.profile.$dirty = true;
    }, true);
    $scope.$watchCollection('vm.profile.xp.companies', function(nv, ov) {
        if (nv != ov) {
            vm.forms.profile.$dirty = true;
            cycleXpMonths(nv);
        }
    }, true);
    //
    // Bootstrap
    //
    bootstrap($user.instance.profile);

    function bootstrap(params) {
        if (!$auth.isAuthenticated()) return;
        //update tab with company name
        $scope.tabs[0].subtitle = "Escolha em quais cargos você se encaixa em <strong>" + $user.instance.current('company').name + "</strong>";
        //
        // Profile corrente
        //
        vm.profile = new $Profile(params);
        vm.profile.company = $user.instance.current('company')._id; //vincular empresa no perfil atual
        //
        // Empresa corrente
        //
        vm.company = $user.instance.current('company');
        //
        // Feedback
        //
        vm.feedback = [{
            value: "indicacao",
            label: "Indicação"
        }, {
            value: "oferta",
            label: "Anúncios"
        }, {
            value: "companySite",
            label: "Site " + $user.instance.current('company').name
        }, {
            value: "google",
            label: "Google"
        }, {
            value: "facebook",
            label: "Facebook"
        }, {
            value: "outros",
            label: "Outros meios"
        }]
    }
    //
    // Behaviors
    //
    function cycleXpMonths(companies) {
        if (!companies) companies = vm.profile.xp.companies;
        var total = 0;
        companies.forEach(function(company) {
            if (company.start && company.end) {
                total += Math.floor(moment(company.end, 'DD/MM/YYYY').diff(moment(company.start, 'DD/MM/YYYY'), 'months', true));
            }
        });
        vm.profile.xp.months = total;
    }

    function save() {
        vm.profile.save(function(response) {
            $user.instance.profileUpdate(response);
            $user.instance.current('companies', response.role);
            bootstrap(response);
            $timeout(function() {
                vm.forms.profile.$dirty = false;
            }, 500);
            if (tabs[$scope.tabCurrent].slug != 'graduation' && tabs[$scope.tabCurrent].slug != 'xps') {
                if ($scope.tabCurrent < 4) $scope.tabCurrent++; //proxima etapa
                //else
                // $scope.tabCurrent = 0; //vai pro inicio
            }
        });
    }

    function hasFormError(name) {
        var result = false;
        if (vm.forms.profile.$error) {
            if (vm.forms.profile.$error.required && vm.forms.profile.$error.required.length) angular.forEach(vm.forms.profile.$error.required, function(row) {
                if (row.$name === name) {
                    result = true;
                    return;
                }
            })
        }
        return result;
    }

    function hasFormInvalid() {
        return vm.forms.profile.$invalid;
    }

    function hasFormErrorToast() {
        if (hasFormInvalid() && $scope.tabCurrent !== 0) {
            $page.toast($user.instance.profile.firstName + ', verifique todos os campos e corrija os erros.', 10000);
        }
    }

    function setAddrByCep() {
        var cep = vm.profile.address.
        default.cep;
        if (cep && cep.toString().length === 8) {
            var url = api.url + '/api/cep/';
            //$page.load.init();
            var onSuccess = function(response) {
                //$page.load.done();
                var addr = response.data;
                vm.profile.address.
                default.street = addr.street;
                vm.profile.address.
                default.district = addr.district;
                vm.profile.address.
                default.city = addr.city;
                vm.profile.address.
                default.state = addr.state;
            }
            var onError = function() {
                $page.load.done();
            }
            $http.get(url + cep, {}).then(onSuccess, onError);
        }
    }

    function hideActionAddWhen() {
        return tabs[$scope.tabCurrent].slug != 'graduation' && tabs[$scope.tabCurrent].slug != 'idioms' && tabs[$scope.tabCurrent].slug != 'xps';
    }

    function add() {
        //adicionar curso
        if (tabs[$scope.tabCurrent].slug === 'graduation') {
            vm.profile.education.courses.unshift({
                name: '',
                hours: ''
            });
        }
        //adicionar idioma
        if (tabs[$scope.tabCurrent].slug === 'idioms') {
            vm.profile.education.idioms.unshift({
                idiom: '',
                level: ''
            });
        }
        //adicionar xp
        if (tabs[$scope.tabCurrent].slug === 'xps') {
            vm.profile.xp.companies.unshift({
                name: '',
                position: '',
                start: '',
                end: '',
                info: '',
                current: ''
            });
        }
        $scope.$emit('itemAdded');
    }

    function remove(item) {
        var index;
        //remover curso
        if (tabs[$scope.tabCurrent].slug === 'graduation') {
            index = vm.profile.education.courses.indexOf(item);
            if (confirm('Certeza que deseja remover o curso ' + item.name + '?')) {
                vm.profile.education.courses.splice(index, 1);
            }
        }
        //remover idioma
        if (tabs[$scope.tabCurrent].slug === 'idioms') {
            index = vm.profile.education.idioms.indexOf(item);
            if (confirm('Certeza que deseja remover o idioma ' + item.lang + '?')) {
                vm.profile.education.idioms.splice(index, 1);
            }
        }
        //remover xp
        if (tabs[$scope.tabCurrent].slug === 'xps') {
            index = vm.profile.xp.companies.indexOf(item);
            if (confirm('Certeza que deseja remover a empresa ' + item.name + ' de suas experiências?')) {
                vm.profile.xp.companies.splice(index, 1);
            }
        }
    }
})
'use strict';
angular.module('core.profile').directive('profileForm', /*@ngInject*/ function() {
    return {
        scope: {
            company: '=',
        },
        restrict: "E",
        controller: 'ProfileFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/profile/form/profileForm.tpl.html',
    }
})
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
            if (rejection.status === 401) {
                $rootScope.$emit('Unauthorized');
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
        templateUrl: 'core/layout/menu/avatar/menuAvatar.tpl.html'
    }
});
'use strict';
angular.module('core.menu').controller('MenuFacepileCtrl', /*@ngInject*/ function() {});
'use strict';
angular.module('core.menu').directive('menuFacepile', /*@ngInject*/ function() {
    return {
        templateUrl: "core/layout/menu/facepile/menuFacepile.tpl.html",
        scope: {
            width: '=',
            url: '@',
            facepile: '@',
            hideCover: '@'
        },
        //transclude: true,
        controller: 'MenuFacepileCtrl',
        controllerAs: 'vm',
        link: function(scope) {
            scope.$watch("url", function() {
                scope.loading = true;
                var interval = setInterval(function() {
                    if (window.FB) {
                        window.FB.XFBML.parse();
                        scope.loading = false;
                        clearInterval(interval);
                    }
                }, 2000);
            });
        }
    }
});
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
angular.module('core.page').directive('toolbarTitle', /*@ngInject*/ function() {
    return {
        templateUrl: "core/page/toolbar/title/toolbarTitle.tpl.html"
    }
});
'use strict';
angular.module('core.profile').controller('ProfileFormPositionsCtrl', function() {
    var vm = this;
    vm.exists = function(item, list) {
        return list.indexOf(item) > -1;
    };
    vm.selected = [];
    vm.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };

})
'use strict';
angular.module('core.profile').directive('profileFormPositions', /*@ngInject*/ function() {
    return {
        scope: {
            options: '=',
            selected: '=',
        },
        templateUrl: "core/profile/form/positions/profileFormPositions.tpl.html",
        controller: 'ProfileFormPositionsCtrl',
        controllerAs: 'vm'
    }
})
'use strict';
angular.module('core.utils').controller('CompanyChooserCtrl', /*@ngInject*/ function($rootScope, $scope) {
    var vm = this;
    vm.companyid = $scope.companyid;
    //external scope databind
    $scope.$watch('companyid', function(nv, ov) {
        if (nv != ov) {
            vm.companyid = nv;
        }
    });
    //internal scope databind
    $scope.$watch('vm.companyid', function(nv, ov) {
        if (nv != ov) {
            $scope.companyid = nv;
            $rootScope.$emit('CompanyIdUpdated', nv, ov);
        }
    });
});
'use strict';
angular.module('core.utils').directive('companyChooser', /*@ngInject*/ function() {
    return {
        scope: {
            companyid: '=',
            companies: '=',
            hideMe: '=',
            placeholder: '='
        },
        replace: true,
        restrict: 'EA',
        controller: 'CompanyChooserCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/companyChooser/companyChooser.tpl.html'
            // link: function($scope, $elem) {
            //     //acompanhando issue no github https://github.com/angular/material/issues/2114
            //     //quando o model é alterado, as vezes, ele adiciona "," repetindo o valor corrente. Ex: "Shopping Boulevard, Shopping Boulevard"
            //     // $scope.$watch('companyid', function() {
            //     //     var elem = $elem[0],
            //     //         random = randomString(10),
            //     //         timeout = [];
            //     //     //  timeout[random] = setInterval(function() {
            //     //     $scope.$apply(function() {
            //     //         var company = $(elem).find('md-select-label span').first().text();
            //     //         var split = company.split(',');
            //     //         $(elem).find('md-select-label span').first().text(split[0]);
            //     //            // $(elem).find('md-select').hide().show();
            //     //          clearInterval(timeout[random]);
            //     //     });
            //     //     //  }, 3000);
            //     // }, true);
            //     function randomString(length) {
            //         return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
            //     }
            // }
    }
});
'use strict';
angular.module('core.utils').directive('focus', /*@ngInject*/ function() {
    return {
        scope: {
            focus: '=',
            focusWhen: '='
        },
        restrict: 'A',
        link: function(scope, elem) {
            scope.$watch('focusWhen', function(nv, ov) {
                if (nv != ov) {
                    if (nv) {
                        elem.focus();
                    }
                }
            });
            if (scope.focus)
                elem.focus();
        }
    }
})
'use strict';
angular.module('core.utils').controller('LeadFormCtrl', /*@ngInject*/ function($scope, $http, api, layout) {
    var vm = this;
    $scope.register = function() {
        vm.busy = true;
        var onSuccess = function() {
            vm.busy = false;
            $page.toast($scope.lead.name + ' agradecemos o interesse, responderemos seu contato em breve.', 10000);
            $scope.lead = {};
        }
        var onFail = function(response) {
            vm.busy = false;
            $page.toast(response);
        }
        $http.post(api.url + '/api/leads', $scope.lead).success(onSuccess).error(onFail);
    }
});
'use strict';
angular.module('core.utils').directive('leadForm', /*@ngInject*/ function() {
    return {
        scope: {
            label: '@'
        },
        templateUrl: 'core/utils/directives/leadForm/leadForm.tpl.html',
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
'use strict';
//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
/* jshint ignore:start */
(function(a){function b(a,b,c){switch(arguments.length){case 2:return null!=a?a:b;case 3:return null!=a?a:null!=b?b:c;default:throw new Error("Implement me")}}function c(a,b){return Bb.call(a,b)}function d(){return{empty:!1,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:!1,invalidMonth:null,invalidFormat:!1,userInvalidated:!1,iso:!1}}function e(a){vb.suppressDeprecationWarnings===!1&&"undefined"!=typeof console&&console.warn&&console.warn("Deprecation warning: "+a)}function f(a,b){var c=!0;return o(function(){return c&&(e(a),c=!1),b.apply(this,arguments)},b)}function g(a,b){sc[a]||(e(b),sc[a]=!0)}function h(a,b){return function(c){return r(a.call(this,c),b)}}function i(a,b){return function(c){return this.localeData().ordinal(a.call(this,c),b)}}function j(a,b){var c,d,e=12*(b.year()-a.year())+(b.month()-a.month()),f=a.clone().add(e,"months");return 0>b-f?(c=a.clone().add(e-1,"months"),d=(b-f)/(f-c)):(c=a.clone().add(e+1,"months"),d=(b-f)/(c-f)),-(e+d)}function k(a,b,c){var d;return null==c?b:null!=a.meridiemHour?a.meridiemHour(b,c):null!=a.isPM?(d=a.isPM(c),d&&12>b&&(b+=12),d||12!==b||(b=0),b):b}function l(){}function m(a,b){b!==!1&&H(a),p(this,a),this._d=new Date(+a._d),uc===!1&&(uc=!0,vb.updateOffset(this),uc=!1)}function n(a){var b=A(a),c=b.year||0,d=b.quarter||0,e=b.month||0,f=b.week||0,g=b.day||0,h=b.hour||0,i=b.minute||0,j=b.second||0,k=b.millisecond||0;this._milliseconds=+k+1e3*j+6e4*i+36e5*h,this._days=+g+7*f,this._months=+e+3*d+12*c,this._data={},this._locale=vb.localeData(),this._bubble()}function o(a,b){for(var d in b)c(b,d)&&(a[d]=b[d]);return c(b,"toString")&&(a.toString=b.toString),c(b,"valueOf")&&(a.valueOf=b.valueOf),a}function p(a,b){var c,d,e;if("undefined"!=typeof b._isAMomentObject&&(a._isAMomentObject=b._isAMomentObject),"undefined"!=typeof b._i&&(a._i=b._i),"undefined"!=typeof b._f&&(a._f=b._f),"undefined"!=typeof b._l&&(a._l=b._l),"undefined"!=typeof b._strict&&(a._strict=b._strict),"undefined"!=typeof b._tzm&&(a._tzm=b._tzm),"undefined"!=typeof b._isUTC&&(a._isUTC=b._isUTC),"undefined"!=typeof b._offset&&(a._offset=b._offset),"undefined"!=typeof b._pf&&(a._pf=b._pf),"undefined"!=typeof b._locale&&(a._locale=b._locale),Kb.length>0)for(c in Kb)d=Kb[c],e=b[d],"undefined"!=typeof e&&(a[d]=e);return a}function q(a){return 0>a?Math.ceil(a):Math.floor(a)}function r(a,b,c){for(var d=""+Math.abs(a),e=a>=0;d.length<b;)d="0"+d;return(e?c?"+":"":"-")+d}function s(a,b){var c={milliseconds:0,months:0};return c.months=b.month()-a.month()+12*(b.year()-a.year()),a.clone().add(c.months,"M").isAfter(b)&&--c.months,c.milliseconds=+b-+a.clone().add(c.months,"M"),c}function t(a,b){var c;return b=M(b,a),a.isBefore(b)?c=s(a,b):(c=s(b,a),c.milliseconds=-c.milliseconds,c.months=-c.months),c}function u(a,b){return function(c,d){var e,f;return null===d||isNaN(+d)||(g(b,"moment()."+b+"(period, number) is deprecated. Please use moment()."+b+"(number, period)."),f=c,c=d,d=f),c="string"==typeof c?+c:c,e=vb.duration(c,d),v(this,e,a),this}}function v(a,b,c,d){var e=b._milliseconds,f=b._days,g=b._months;d=null==d?!0:d,e&&a._d.setTime(+a._d+e*c),f&&pb(a,"Date",ob(a,"Date")+f*c),g&&nb(a,ob(a,"Month")+g*c),d&&vb.updateOffset(a,f||g)}function w(a){return"[object Array]"===Object.prototype.toString.call(a)}function x(a){return"[object Date]"===Object.prototype.toString.call(a)||a instanceof Date}function y(a,b,c){var d,e=Math.min(a.length,b.length),f=Math.abs(a.length-b.length),g=0;for(d=0;e>d;d++)(c&&a[d]!==b[d]||!c&&C(a[d])!==C(b[d]))&&g++;return g+f}function z(a){if(a){var b=a.toLowerCase().replace(/(.)s$/,"$1");a=lc[a]||mc[b]||b}return a}function A(a){var b,d,e={};for(d in a)c(a,d)&&(b=z(d),b&&(e[b]=a[d]));return e}function B(b){var c,d;if(0===b.indexOf("week"))c=7,d="day";else{if(0!==b.indexOf("month"))return;c=12,d="month"}vb[b]=function(e,f){var g,h,i=vb._locale[b],j=[];if("number"==typeof e&&(f=e,e=a),h=function(a){var b=vb().utc().set(d,a);return i.call(vb._locale,b,e||"")},null!=f)return h(f);for(g=0;c>g;g++)j.push(h(g));return j}}function C(a){var b=+a,c=0;return 0!==b&&isFinite(b)&&(c=b>=0?Math.floor(b):Math.ceil(b)),c}function D(a,b){return new Date(Date.UTC(a,b+1,0)).getUTCDate()}function E(a,b,c){return jb(vb([a,11,31+b-c]),b,c).week}function F(a){return G(a)?366:365}function G(a){return a%4===0&&a%100!==0||a%400===0}function H(a){var b;a._a&&-2===a._pf.overflow&&(b=a._a[Db]<0||a._a[Db]>11?Db:a._a[Eb]<1||a._a[Eb]>D(a._a[Cb],a._a[Db])?Eb:a._a[Fb]<0||a._a[Fb]>24||24===a._a[Fb]&&(0!==a._a[Gb]||0!==a._a[Hb]||0!==a._a[Ib])?Fb:a._a[Gb]<0||a._a[Gb]>59?Gb:a._a[Hb]<0||a._a[Hb]>59?Hb:a._a[Ib]<0||a._a[Ib]>999?Ib:-1,a._pf._overflowDayOfYear&&(Cb>b||b>Eb)&&(b=Eb),a._pf.overflow=b)}function I(b){return null==b._isValid&&(b._isValid=!isNaN(b._d.getTime())&&b._pf.overflow<0&&!b._pf.empty&&!b._pf.invalidMonth&&!b._pf.nullInput&&!b._pf.invalidFormat&&!b._pf.userInvalidated,b._strict&&(b._isValid=b._isValid&&0===b._pf.charsLeftOver&&0===b._pf.unusedTokens.length&&b._pf.bigHour===a)),b._isValid}function J(a){return a?a.toLowerCase().replace("_","-"):a}function K(a){for(var b,c,d,e,f=0;f<a.length;){for(e=J(a[f]).split("-"),b=e.length,c=J(a[f+1]),c=c?c.split("-"):null;b>0;){if(d=L(e.slice(0,b).join("-")))return d;if(c&&c.length>=b&&y(e,c,!0)>=b-1)break;b--}f++}return null}function L(a){var b=null;if(!Jb[a]&&Lb)try{b=vb.locale(),require("./locale/"+a),vb.locale(b)}catch(c){}return Jb[a]}function M(a,b){var c,d;return b._isUTC?(c=b.clone(),d=(vb.isMoment(a)||x(a)?+a:+vb(a))-+c,c._d.setTime(+c._d+d),vb.updateOffset(c,!1),c):vb(a).local()}function N(a){return a.match(/\[[\s\S]/)?a.replace(/^\[|\]$/g,""):a.replace(/\\/g,"")}function O(a){var b,c,d=a.match(Pb);for(b=0,c=d.length;c>b;b++)d[b]=rc[d[b]]?rc[d[b]]:N(d[b]);return function(e){var f="";for(b=0;c>b;b++)f+=d[b]instanceof Function?d[b].call(e,a):d[b];return f}}function P(a,b){return a.isValid()?(b=Q(b,a.localeData()),nc[b]||(nc[b]=O(b)),nc[b](a)):a.localeData().invalidDate()}function Q(a,b){function c(a){return b.longDateFormat(a)||a}var d=5;for(Qb.lastIndex=0;d>=0&&Qb.test(a);)a=a.replace(Qb,c),Qb.lastIndex=0,d-=1;return a}function R(a,b){var c,d=b._strict;switch(a){case"Q":return _b;case"DDDD":return bc;case"YYYY":case"GGGG":case"gggg":return d?cc:Tb;case"Y":case"G":case"g":return ec;case"YYYYYY":case"YYYYY":case"GGGGG":case"ggggg":return d?dc:Ub;case"S":if(d)return _b;case"SS":if(d)return ac;case"SSS":if(d)return bc;case"DDD":return Sb;case"MMM":case"MMMM":case"dd":case"ddd":case"dddd":return Wb;case"a":case"A":return b._locale._meridiemParse;case"x":return Zb;case"X":return $b;case"Z":case"ZZ":return Xb;case"T":return Yb;case"SSSS":return Vb;case"MM":case"DD":case"YY":case"GG":case"gg":case"HH":case"hh":case"mm":case"ss":case"ww":case"WW":return d?ac:Rb;case"M":case"D":case"d":case"H":case"h":case"m":case"s":case"w":case"W":case"e":case"E":return Rb;case"Do":return d?b._locale._ordinalParse:b._locale._ordinalParseLenient;default:return c=new RegExp($(Z(a.replace("\\","")),"i"))}}function S(a){a=a||"";var b=a.match(Xb)||[],c=b[b.length-1]||[],d=(c+"").match(jc)||["-",0,0],e=+(60*d[1])+C(d[2]);return"+"===d[0]?e:-e}function T(a,b,c){var d,e=c._a;switch(a){case"Q":null!=b&&(e[Db]=3*(C(b)-1));break;case"M":case"MM":null!=b&&(e[Db]=C(b)-1);break;case"MMM":case"MMMM":d=c._locale.monthsParse(b,a,c._strict),null!=d?e[Db]=d:c._pf.invalidMonth=b;break;case"D":case"DD":null!=b&&(e[Eb]=C(b));break;case"Do":null!=b&&(e[Eb]=C(parseInt(b.match(/\d{1,2}/)[0],10)));break;case"DDD":case"DDDD":null!=b&&(c._dayOfYear=C(b));break;case"YY":e[Cb]=vb.parseTwoDigitYear(b);break;case"YYYY":case"YYYYY":case"YYYYYY":e[Cb]=C(b);break;case"a":case"A":c._meridiem=b;break;case"h":case"hh":c._pf.bigHour=!0;case"H":case"HH":e[Fb]=C(b);break;case"m":case"mm":e[Gb]=C(b);break;case"s":case"ss":e[Hb]=C(b);break;case"S":case"SS":case"SSS":case"SSSS":e[Ib]=C(1e3*("0."+b));break;case"x":c._d=new Date(C(b));break;case"X":c._d=new Date(1e3*parseFloat(b));break;case"Z":case"ZZ":c._useUTC=!0,c._tzm=S(b);break;case"dd":case"ddd":case"dddd":d=c._locale.weekdaysParse(b),null!=d?(c._w=c._w||{},c._w.d=d):c._pf.invalidWeekday=b;break;case"w":case"ww":case"W":case"WW":case"d":case"e":case"E":a=a.substr(0,1);case"gggg":case"GGGG":case"GGGGG":a=a.substr(0,2),b&&(c._w=c._w||{},c._w[a]=C(b));break;case"gg":case"GG":c._w=c._w||{},c._w[a]=vb.parseTwoDigitYear(b)}}function U(a){var c,d,e,f,g,h,i;c=a._w,null!=c.GG||null!=c.W||null!=c.E?(g=1,h=4,d=b(c.GG,a._a[Cb],jb(vb(),1,4).year),e=b(c.W,1),f=b(c.E,1)):(g=a._locale._week.dow,h=a._locale._week.doy,d=b(c.gg,a._a[Cb],jb(vb(),g,h).year),e=b(c.w,1),null!=c.d?(f=c.d,g>f&&++e):f=null!=c.e?c.e+g:g),i=kb(d,e,f,h,g),a._a[Cb]=i.year,a._dayOfYear=i.dayOfYear}function V(a){var c,d,e,f,g=[];if(!a._d){for(e=X(a),a._w&&null==a._a[Eb]&&null==a._a[Db]&&U(a),a._dayOfYear&&(f=b(a._a[Cb],e[Cb]),a._dayOfYear>F(f)&&(a._pf._overflowDayOfYear=!0),d=fb(f,0,a._dayOfYear),a._a[Db]=d.getUTCMonth(),a._a[Eb]=d.getUTCDate()),c=0;3>c&&null==a._a[c];++c)a._a[c]=g[c]=e[c];for(;7>c;c++)a._a[c]=g[c]=null==a._a[c]?2===c?1:0:a._a[c];24===a._a[Fb]&&0===a._a[Gb]&&0===a._a[Hb]&&0===a._a[Ib]&&(a._nextDay=!0,a._a[Fb]=0),a._d=(a._useUTC?fb:eb).apply(null,g),null!=a._tzm&&a._d.setUTCMinutes(a._d.getUTCMinutes()-a._tzm),a._nextDay&&(a._a[Fb]=24)}}function W(a){var b;a._d||(b=A(a._i),a._a=[b.year,b.month,b.day||b.date,b.hour,b.minute,b.second,b.millisecond],V(a))}function X(a){var b=new Date;return a._useUTC?[b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate()]:[b.getFullYear(),b.getMonth(),b.getDate()]}function Y(b){if(b._f===vb.ISO_8601)return void ab(b);b._a=[],b._pf.empty=!0;var c,d,e,f,g,h=""+b._i,i=h.length,j=0;for(e=Q(b._f,b._locale).match(Pb)||[],c=0;c<e.length;c++)f=e[c],d=(h.match(R(f,b))||[])[0],d&&(g=h.substr(0,h.indexOf(d)),g.length>0&&b._pf.unusedInput.push(g),h=h.slice(h.indexOf(d)+d.length),j+=d.length),rc[f]?(d?b._pf.empty=!1:b._pf.unusedTokens.push(f),T(f,d,b)):b._strict&&!d&&b._pf.unusedTokens.push(f);b._pf.charsLeftOver=i-j,h.length>0&&b._pf.unusedInput.push(h),b._pf.bigHour===!0&&b._a[Fb]<=12&&(b._pf.bigHour=a),b._a[Fb]=k(b._locale,b._a[Fb],b._meridiem),V(b),H(b)}function Z(a){return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(a,b,c,d,e){return b||c||d||e})}function $(a){return a.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}function _(a){var b,c,e,f,g;if(0===a._f.length)return a._pf.invalidFormat=!0,void(a._d=new Date(0/0));for(f=0;f<a._f.length;f++)g=0,b=p({},a),null!=a._useUTC&&(b._useUTC=a._useUTC),b._pf=d(),b._f=a._f[f],Y(b),I(b)&&(g+=b._pf.charsLeftOver,g+=10*b._pf.unusedTokens.length,b._pf.score=g,(null==e||e>g)&&(e=g,c=b));o(a,c||b)}function ab(a){var b,c,d=a._i,e=fc.exec(d);if(e){for(a._pf.iso=!0,b=0,c=hc.length;c>b;b++)if(hc[b][1].exec(d)){a._f=hc[b][0]+(e[6]||" ");break}for(b=0,c=ic.length;c>b;b++)if(ic[b][1].exec(d)){a._f+=ic[b][0];break}d.match(Xb)&&(a._f+="Z"),Y(a)}else a._isValid=!1}function bb(a){ab(a),a._isValid===!1&&(delete a._isValid,vb.createFromInputFallback(a))}function cb(a,b){var c,d=[];for(c=0;c<a.length;++c)d.push(b(a[c],c));return d}function db(b){var c,d=b._i;d===a?b._d=new Date:x(d)?b._d=new Date(+d):null!==(c=Mb.exec(d))?b._d=new Date(+c[1]):"string"==typeof d?bb(b):w(d)?(b._a=cb(d.slice(0),function(a){return parseInt(a,10)}),V(b)):"object"==typeof d?W(b):"number"==typeof d?b._d=new Date(d):vb.createFromInputFallback(b)}function eb(a,b,c,d,e,f,g){var h=new Date(a,b,c,d,e,f,g);return 1970>a&&h.setFullYear(a),h}function fb(a){var b=new Date(Date.UTC.apply(null,arguments));return 1970>a&&b.setUTCFullYear(a),b}function gb(a,b){if("string"==typeof a)if(isNaN(a)){if(a=b.weekdaysParse(a),"number"!=typeof a)return null}else a=parseInt(a,10);return a}function hb(a,b,c,d,e){return e.relativeTime(b||1,!!c,a,d)}function ib(a,b,c){var d=vb.duration(a).abs(),e=Ab(d.as("s")),f=Ab(d.as("m")),g=Ab(d.as("h")),h=Ab(d.as("d")),i=Ab(d.as("M")),j=Ab(d.as("y")),k=e<oc.s&&["s",e]||1===f&&["m"]||f<oc.m&&["mm",f]||1===g&&["h"]||g<oc.h&&["hh",g]||1===h&&["d"]||h<oc.d&&["dd",h]||1===i&&["M"]||i<oc.M&&["MM",i]||1===j&&["y"]||["yy",j];return k[2]=b,k[3]=+a>0,k[4]=c,hb.apply({},k)}function jb(a,b,c){var d,e=c-b,f=c-a.day();return f>e&&(f-=7),e-7>f&&(f+=7),d=vb(a).add(f,"d"),{week:Math.ceil(d.dayOfYear()/7),year:d.year()}}function kb(a,b,c,d,e){var f,g,h=fb(a,0,1).getUTCDay();return h=0===h?7:h,c=null!=c?c:e,f=e-h+(h>d?7:0)-(e>h?7:0),g=7*(b-1)+(c-e)+f+1,{year:g>0?a:a-1,dayOfYear:g>0?g:F(a-1)+g}}function lb(b){var c,d=b._i,e=b._f;return b._locale=b._locale||vb.localeData(b._l),null===d||e===a&&""===d?vb.invalid({nullInput:!0}):("string"==typeof d&&(b._i=d=b._locale.preparse(d)),vb.isMoment(d)?new m(d,!0):(e?w(e)?_(b):Y(b):db(b),c=new m(b),c._nextDay&&(c.add(1,"d"),c._nextDay=a),c))}function mb(a,b){var c,d;if(1===b.length&&w(b[0])&&(b=b[0]),!b.length)return vb();for(c=b[0],d=1;d<b.length;++d)b[d][a](c)&&(c=b[d]);return c}function nb(a,b){var c;return"string"==typeof b&&(b=a.localeData().monthsParse(b),"number"!=typeof b)?a:(c=Math.min(a.date(),D(a.year(),b)),a._d["set"+(a._isUTC?"UTC":"")+"Month"](b,c),a)}function ob(a,b){return a._d["get"+(a._isUTC?"UTC":"")+b]()}function pb(a,b,c){return"Month"===b?nb(a,c):a._d["set"+(a._isUTC?"UTC":"")+b](c)}function qb(a,b){return function(c){return null!=c?(pb(this,a,c),vb.updateOffset(this,b),this):ob(this,a)}}function rb(a){return 400*a/146097}function sb(a){return 146097*a/400}function tb(a){vb.duration.fn[a]=function(){return this._data[a]}}function ub(a){"undefined"==typeof ender&&(wb=zb.moment,zb.moment=a?f("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.",vb):vb)}for(var vb,wb,xb,yb="2.9.0",zb="undefined"==typeof global||"undefined"!=typeof window&&window!==global.window?this:global,Ab=Math.round,Bb=Object.prototype.hasOwnProperty,Cb=0,Db=1,Eb=2,Fb=3,Gb=4,Hb=5,Ib=6,Jb={},Kb=[],Lb="undefined"!=typeof module&&module&&module.exports,Mb=/^\/?Date\((\-?\d+)/i,Nb=/(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,Ob=/^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,Pb=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,Qb=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,Rb=/\d\d?/,Sb=/\d{1,3}/,Tb=/\d{1,4}/,Ub=/[+\-]?\d{1,6}/,Vb=/\d+/,Wb=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,Xb=/Z|[\+\-]\d\d:?\d\d/gi,Yb=/T/i,Zb=/[\+\-]?\d+/,$b=/[\+\-]?\d+(\.\d{1,3})?/,_b=/\d/,ac=/\d\d/,bc=/\d{3}/,cc=/\d{4}/,dc=/[+-]?\d{6}/,ec=/[+-]?\d+/,fc=/^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,gc="YYYY-MM-DDTHH:mm:ssZ",hc=[["YYYYYY-MM-DD",/[+-]\d{6}-\d{2}-\d{2}/],["YYYY-MM-DD",/\d{4}-\d{2}-\d{2}/],["GGGG-[W]WW-E",/\d{4}-W\d{2}-\d/],["GGGG-[W]WW",/\d{4}-W\d{2}/],["YYYY-DDD",/\d{4}-\d{3}/]],ic=[["HH:mm:ss.SSSS",/(T| )\d\d:\d\d:\d\d\.\d+/],["HH:mm:ss",/(T| )\d\d:\d\d:\d\d/],["HH:mm",/(T| )\d\d:\d\d/],["HH",/(T| )\d\d/]],jc=/([\+\-]|\d\d)/gi,kc=("Date|Hours|Minutes|Seconds|Milliseconds".split("|"),{Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Months:2592e6,Years:31536e6}),lc={ms:"millisecond",s:"second",m:"minute",h:"hour",d:"day",D:"date",w:"week",W:"isoWeek",M:"month",Q:"quarter",y:"year",DDD:"dayOfYear",e:"weekday",E:"isoWeekday",gg:"weekYear",GG:"isoWeekYear"},mc={dayofyear:"dayOfYear",isoweekday:"isoWeekday",isoweek:"isoWeek",weekyear:"weekYear",isoweekyear:"isoWeekYear"},nc={},oc={s:45,m:45,h:22,d:26,M:11},pc="DDD w W M D d".split(" "),qc="M D H h m s w W".split(" "),rc={M:function(){return this.month()+1},MMM:function(a){return this.localeData().monthsShort(this,a)},MMMM:function(a){return this.localeData().months(this,a)},D:function(){return this.date()},DDD:function(){return this.dayOfYear()},d:function(){return this.day()},dd:function(a){return this.localeData().weekdaysMin(this,a)},ddd:function(a){return this.localeData().weekdaysShort(this,a)},dddd:function(a){return this.localeData().weekdays(this,a)},w:function(){return this.week()},W:function(){return this.isoWeek()},YY:function(){return r(this.year()%100,2)},YYYY:function(){return r(this.year(),4)},YYYYY:function(){return r(this.year(),5)},YYYYYY:function(){var a=this.year(),b=a>=0?"+":"-";return b+r(Math.abs(a),6)},gg:function(){return r(this.weekYear()%100,2)},gggg:function(){return r(this.weekYear(),4)},ggggg:function(){return r(this.weekYear(),5)},GG:function(){return r(this.isoWeekYear()%100,2)},GGGG:function(){return r(this.isoWeekYear(),4)},GGGGG:function(){return r(this.isoWeekYear(),5)},e:function(){return this.weekday()},E:function(){return this.isoWeekday()},a:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!0)},A:function(){return this.localeData().meridiem(this.hours(),this.minutes(),!1)},H:function(){return this.hours()},h:function(){return this.hours()%12||12},m:function(){return this.minutes()},s:function(){return this.seconds()},S:function(){return C(this.milliseconds()/100)},SS:function(){return r(C(this.milliseconds()/10),2)},SSS:function(){return r(this.milliseconds(),3)},SSSS:function(){return r(this.milliseconds(),3)},Z:function(){var a=this.utcOffset(),b="+";return 0>a&&(a=-a,b="-"),b+r(C(a/60),2)+":"+r(C(a)%60,2)},ZZ:function(){var a=this.utcOffset(),b="+";return 0>a&&(a=-a,b="-"),b+r(C(a/60),2)+r(C(a)%60,2)},z:function(){return this.zoneAbbr()},zz:function(){return this.zoneName()},x:function(){return this.valueOf()},X:function(){return this.unix()},Q:function(){return this.quarter()}},sc={},tc=["months","monthsShort","weekdays","weekdaysShort","weekdaysMin"],uc=!1;pc.length;)xb=pc.pop(),rc[xb+"o"]=i(rc[xb],xb);for(;qc.length;)xb=qc.pop(),rc[xb+xb]=h(rc[xb],2);rc.DDDD=h(rc.DDD,3),o(l.prototype,{set:function(a){var b,c;for(c in a)b=a[c],"function"==typeof b?this[c]=b:this["_"+c]=b;this._ordinalParseLenient=new RegExp(this._ordinalParse.source+"|"+/\d{1,2}/.source)},_months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),months:function(a){return this._months[a.month()]},_monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),monthsShort:function(a){return this._monthsShort[a.month()]},monthsParse:function(a,b,c){var d,e,f;for(this._monthsParse||(this._monthsParse=[],this._longMonthsParse=[],this._shortMonthsParse=[]),d=0;12>d;d++){if(e=vb.utc([2e3,d]),c&&!this._longMonthsParse[d]&&(this._longMonthsParse[d]=new RegExp("^"+this.months(e,"").replace(".","")+"$","i"),this._shortMonthsParse[d]=new RegExp("^"+this.monthsShort(e,"").replace(".","")+"$","i")),c||this._monthsParse[d]||(f="^"+this.months(e,"")+"|^"+this.monthsShort(e,""),this._monthsParse[d]=new RegExp(f.replace(".",""),"i")),c&&"MMMM"===b&&this._longMonthsParse[d].test(a))return d;if(c&&"MMM"===b&&this._shortMonthsParse[d].test(a))return d;if(!c&&this._monthsParse[d].test(a))return d}},_weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdays:function(a){return this._weekdays[a.day()]},_weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysShort:function(a){return this._weekdaysShort[a.day()]},_weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),weekdaysMin:function(a){return this._weekdaysMin[a.day()]},weekdaysParse:function(a){var b,c,d;for(this._weekdaysParse||(this._weekdaysParse=[]),b=0;7>b;b++)if(this._weekdaysParse[b]||(c=vb([2e3,1]).day(b),d="^"+this.weekdays(c,"")+"|^"+this.weekdaysShort(c,"")+"|^"+this.weekdaysMin(c,""),this._weekdaysParse[b]=new RegExp(d.replace(".",""),"i")),this._weekdaysParse[b].test(a))return b},_longDateFormat:{LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM D, YYYY LT"},longDateFormat:function(a){var b=this._longDateFormat[a];return!b&&this._longDateFormat[a.toUpperCase()]&&(b=this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g,function(a){return a.slice(1)}),this._longDateFormat[a]=b),b},isPM:function(a){return"p"===(a+"").toLowerCase().charAt(0)},_meridiemParse:/[ap]\.?m?\.?/i,meridiem:function(a,b,c){return a>11?c?"pm":"PM":c?"am":"AM"},_calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},calendar:function(a,b,c){var d=this._calendar[a];return"function"==typeof d?d.apply(b,[c]):d},_relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},relativeTime:function(a,b,c,d){var e=this._relativeTime[c];return"function"==typeof e?e(a,b,c,d):e.replace(/%d/i,a)},pastFuture:function(a,b){var c=this._relativeTime[a>0?"future":"past"];return"function"==typeof c?c(b):c.replace(/%s/i,b)},ordinal:function(a){return this._ordinal.replace("%d",a)},_ordinal:"%d",_ordinalParse:/\d{1,2}/,preparse:function(a){return a},postformat:function(a){return a},week:function(a){return jb(a,this._week.dow,this._week.doy).week},_week:{dow:0,doy:6},firstDayOfWeek:function(){return this._week.dow},firstDayOfYear:function(){return this._week.doy},_invalidDate:"Invalid date",invalidDate:function(){return this._invalidDate}}),vb=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._i=b,g._f=c,g._l=e,g._strict=f,g._isUTC=!1,g._pf=d(),lb(g)},vb.suppressDeprecationWarnings=!1,vb.createFromInputFallback=f("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.",function(a){a._d=new Date(a._i+(a._useUTC?" UTC":""))}),vb.min=function(){var a=[].slice.call(arguments,0);return mb("isBefore",a)},vb.max=function(){var a=[].slice.call(arguments,0);return mb("isAfter",a)},vb.utc=function(b,c,e,f){var g;return"boolean"==typeof e&&(f=e,e=a),g={},g._isAMomentObject=!0,g._useUTC=!0,g._isUTC=!0,g._l=e,g._i=b,g._f=c,g._strict=f,g._pf=d(),lb(g).utc()},vb.unix=function(a){return vb(1e3*a)},vb.duration=function(a,b){var d,e,f,g,h=a,i=null;return vb.isDuration(a)?h={ms:a._milliseconds,d:a._days,M:a._months}:"number"==typeof a?(h={},b?h[b]=a:h.milliseconds=a):(i=Nb.exec(a))?(d="-"===i[1]?-1:1,h={y:0,d:C(i[Eb])*d,h:C(i[Fb])*d,m:C(i[Gb])*d,s:C(i[Hb])*d,ms:C(i[Ib])*d}):(i=Ob.exec(a))?(d="-"===i[1]?-1:1,f=function(a){var b=a&&parseFloat(a.replace(",","."));return(isNaN(b)?0:b)*d},h={y:f(i[2]),M:f(i[3]),d:f(i[4]),h:f(i[5]),m:f(i[6]),s:f(i[7]),w:f(i[8])}):null==h?h={}:"object"==typeof h&&("from"in h||"to"in h)&&(g=t(vb(h.from),vb(h.to)),h={},h.ms=g.milliseconds,h.M=g.months),e=new n(h),vb.isDuration(a)&&c(a,"_locale")&&(e._locale=a._locale),e},vb.version=yb,vb.defaultFormat=gc,vb.ISO_8601=function(){},vb.momentProperties=Kb,vb.updateOffset=function(){},vb.relativeTimeThreshold=function(b,c){return oc[b]===a?!1:c===a?oc[b]:(oc[b]=c,!0)},vb.lang=f("moment.lang is deprecated. Use moment.locale instead.",function(a,b){return vb.locale(a,b)}),vb.locale=function(a,b){var c;return a&&(c="undefined"!=typeof b?vb.defineLocale(a,b):vb.localeData(a),c&&(vb.duration._locale=vb._locale=c)),vb._locale._abbr},vb.defineLocale=function(a,b){return null!==b?(b.abbr=a,Jb[a]||(Jb[a]=new l),Jb[a].set(b),vb.locale(a),Jb[a]):(delete Jb[a],null)},vb.langData=f("moment.langData is deprecated. Use moment.localeData instead.",function(a){return vb.localeData(a)}),vb.localeData=function(a){var b;if(a&&a._locale&&a._locale._abbr&&(a=a._locale._abbr),!a)return vb._locale;if(!w(a)){if(b=L(a))return b;a=[a]}return K(a)},vb.isMoment=function(a){return a instanceof m||null!=a&&c(a,"_isAMomentObject")},vb.isDuration=function(a){return a instanceof n};for(xb=tc.length-1;xb>=0;--xb)B(tc[xb]);vb.normalizeUnits=function(a){return z(a)},vb.invalid=function(a){var b=vb.utc(0/0);return null!=a?o(b._pf,a):b._pf.userInvalidated=!0,b},vb.parseZone=function(){return vb.apply(null,arguments).parseZone()},vb.parseTwoDigitYear=function(a){return C(a)+(C(a)>68?1900:2e3)},vb.isDate=x,o(vb.fn=m.prototype,{clone:function(){return vb(this)},valueOf:function(){return+this._d-6e4*(this._offset||0)},unix:function(){return Math.floor(+this/1e3)},toString:function(){return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")},toDate:function(){return this._offset?new Date(+this):this._d},toISOString:function(){var a=vb(this).utc();return 0<a.year()&&a.year()<=9999?"function"==typeof Date.prototype.toISOString?this.toDate().toISOString():P(a,"YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"):P(a,"YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")},toArray:function(){var a=this;return[a.year(),a.month(),a.date(),a.hours(),a.minutes(),a.seconds(),a.milliseconds()]},isValid:function(){return I(this)},isDSTShifted:function(){return this._a?this.isValid()&&y(this._a,(this._isUTC?vb.utc(this._a):vb(this._a)).toArray())>0:!1},parsingFlags:function(){return o({},this._pf)},invalidAt:function(){return this._pf.overflow},utc:function(a){return this.utcOffset(0,a)},local:function(a){return this._isUTC&&(this.utcOffset(0,a),this._isUTC=!1,a&&this.subtract(this._dateUtcOffset(),"m")),this},format:function(a){var b=P(this,a||vb.defaultFormat);return this.localeData().postformat(b)},add:u(1,"add"),subtract:u(-1,"subtract"),diff:function(a,b,c){var d,e,f=M(a,this),g=6e4*(f.utcOffset()-this.utcOffset());return b=z(b),"year"===b||"month"===b||"quarter"===b?(e=j(this,f),"quarter"===b?e/=3:"year"===b&&(e/=12)):(d=this-f,e="second"===b?d/1e3:"minute"===b?d/6e4:"hour"===b?d/36e5:"day"===b?(d-g)/864e5:"week"===b?(d-g)/6048e5:d),c?e:q(e)},from:function(a,b){return vb.duration({to:this,from:a}).locale(this.locale()).humanize(!b)},fromNow:function(a){return this.from(vb(),a)},calendar:function(a){var b=a||vb(),c=M(b,this).startOf("day"),d=this.diff(c,"days",!0),e=-6>d?"sameElse":-1>d?"lastWeek":0>d?"lastDay":1>d?"sameDay":2>d?"nextDay":7>d?"nextWeek":"sameElse";return this.format(this.localeData().calendar(e,this,vb(b)))},isLeapYear:function(){return G(this.year())},isDST:function(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return null!=a?(a=gb(a,this.localeData()),this.add(a-b,"d")):b},month:qb("Month",!0),startOf:function(a){switch(a=z(a)){case"year":this.month(0);case"quarter":case"month":this.date(1);case"week":case"isoWeek":case"day":this.hours(0);case"hour":this.minutes(0);case"minute":this.seconds(0);case"second":this.milliseconds(0)}return"week"===a?this.weekday(0):"isoWeek"===a&&this.isoWeekday(1),"quarter"===a&&this.month(3*Math.floor(this.month()/3)),this},endOf:function(b){return b=z(b),b===a||"millisecond"===b?this:this.startOf(b).add(1,"isoWeek"===b?"week":b).subtract(1,"ms")},isAfter:function(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+this>+a):(c=vb.isMoment(a)?+a:+vb(a),c<+this.clone().startOf(b))},isBefore:function(a,b){var c;return b=z("undefined"!=typeof b?b:"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+a>+this):(c=vb.isMoment(a)?+a:+vb(a),+this.clone().endOf(b)<c)},isBetween:function(a,b,c){return this.isAfter(a,c)&&this.isBefore(b,c)},isSame:function(a,b){var c;return b=z(b||"millisecond"),"millisecond"===b?(a=vb.isMoment(a)?a:vb(a),+this===+a):(c=+vb(a),+this.clone().startOf(b)<=c&&c<=+this.clone().endOf(b))},min:f("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548",function(a){return a=vb.apply(null,arguments),this>a?this:a}),max:f("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548",function(a){return a=vb.apply(null,arguments),a>this?this:a}),zone:f("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779",function(a,b){return null!=a?("string"!=typeof a&&(a=-a),this.utcOffset(a,b),this):-this.utcOffset()}),utcOffset:function(a,b){var c,d=this._offset||0;return null!=a?("string"==typeof a&&(a=S(a)),Math.abs(a)<16&&(a=60*a),!this._isUTC&&b&&(c=this._dateUtcOffset()),this._offset=a,this._isUTC=!0,null!=c&&this.add(c,"m"),d!==a&&(!b||this._changeInProgress?v(this,vb.duration(a-d,"m"),1,!1):this._changeInProgress||(this._changeInProgress=!0,vb.updateOffset(this,!0),this._changeInProgress=null)),this):this._isUTC?d:this._dateUtcOffset()},isLocal:function(){return!this._isUTC},isUtcOffset:function(){return this._isUTC},isUtc:function(){return this._isUTC&&0===this._offset},zoneAbbr:function(){return this._isUTC?"UTC":""},zoneName:function(){return this._isUTC?"Coordinated Universal Time":""},parseZone:function(){return this._tzm?this.utcOffset(this._tzm):"string"==typeof this._i&&this.utcOffset(S(this._i)),this},hasAlignedHourOffset:function(a){return a=a?vb(a).utcOffset():0,(this.utcOffset()-a)%60===0},daysInMonth:function(){return D(this.year(),this.month())},dayOfYear:function(a){var b=Ab((vb(this).startOf("day")-vb(this).startOf("year"))/864e5)+1;return null==a?b:this.add(a-b,"d")},quarter:function(a){return null==a?Math.ceil((this.month()+1)/3):this.month(3*(a-1)+this.month()%3)},weekYear:function(a){var b=jb(this,this.localeData()._week.dow,this.localeData()._week.doy).year;return null==a?b:this.add(a-b,"y")},isoWeekYear:function(a){var b=jb(this,1,4).year;return null==a?b:this.add(a-b,"y")},week:function(a){var b=this.localeData().week(this);return null==a?b:this.add(7*(a-b),"d")},isoWeek:function(a){var b=jb(this,1,4).week;return null==a?b:this.add(7*(a-b),"d")},weekday:function(a){var b=(this.day()+7-this.localeData()._week.dow)%7;return null==a?b:this.add(a-b,"d")},isoWeekday:function(a){return null==a?this.day()||7:this.day(this.day()%7?a:a-7)},isoWeeksInYear:function(){return E(this.year(),1,4)},weeksInYear:function(){var a=this.localeData()._week;return E(this.year(),a.dow,a.doy)},get:function(a){return a=z(a),this[a]()},set:function(a,b){var c;if("object"==typeof a)for(c in a)this.set(c,a[c]);else a=z(a),"function"==typeof this[a]&&this[a](b);return this},locale:function(b){var c;return b===a?this._locale._abbr:(c=vb.localeData(b),null!=c&&(this._locale=c),this)},lang:f("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",function(b){return b===a?this.localeData():this.locale(b)}),localeData:function(){return this._locale},_dateUtcOffset:function(){return 15*-Math.round(this._d.getTimezoneOffset()/15)}}),vb.fn.millisecond=vb.fn.milliseconds=qb("Milliseconds",!1),vb.fn.second=vb.fn.seconds=qb("Seconds",!1),vb.fn.minute=vb.fn.minutes=qb("Minutes",!1),vb.fn.hour=vb.fn.hours=qb("Hours",!0),vb.fn.date=qb("Date",!0),vb.fn.dates=f("dates accessor is deprecated. Use date instead.",qb("Date",!0)),vb.fn.year=qb("FullYear",!0),vb.fn.years=f("years accessor is deprecated. Use year instead.",qb("FullYear",!0)),vb.fn.days=vb.fn.day,vb.fn.months=vb.fn.month,vb.fn.weeks=vb.fn.week,vb.fn.isoWeeks=vb.fn.isoWeek,vb.fn.quarters=vb.fn.quarter,vb.fn.toJSON=vb.fn.toISOString,vb.fn.isUTC=vb.fn.isUtc,o(vb.duration.fn=n.prototype,{_bubble:function(){var a,b,c,d=this._milliseconds,e=this._days,f=this._months,g=this._data,h=0;g.milliseconds=d%1e3,a=q(d/1e3),g.seconds=a%60,b=q(a/60),g.minutes=b%60,c=q(b/60),g.hours=c%24,e+=q(c/24),h=q(rb(e)),e-=q(sb(h)),f+=q(e/30),e%=30,h+=q(f/12),f%=12,g.days=e,g.months=f,g.years=h},abs:function(){return this._milliseconds=Math.abs(this._milliseconds),this._days=Math.abs(this._days),this._months=Math.abs(this._months),this._data.milliseconds=Math.abs(this._data.milliseconds),this._data.seconds=Math.abs(this._data.seconds),this._data.minutes=Math.abs(this._data.minutes),this._data.hours=Math.abs(this._data.hours),this._data.months=Math.abs(this._data.months),this._data.years=Math.abs(this._data.years),this},weeks:function(){return q(this.days()/7)},valueOf:function(){return this._milliseconds+864e5*this._days+this._months%12*2592e6+31536e6*C(this._months/12)
},humanize:function(a){var b=ib(this,!a,this.localeData());return a&&(b=this.localeData().pastFuture(+this,b)),this.localeData().postformat(b)},add:function(a,b){var c=vb.duration(a,b);return this._milliseconds+=c._milliseconds,this._days+=c._days,this._months+=c._months,this._bubble(),this},subtract:function(a,b){var c=vb.duration(a,b);return this._milliseconds-=c._milliseconds,this._days-=c._days,this._months-=c._months,this._bubble(),this},get:function(a){return a=z(a),this[a.toLowerCase()+"s"]()},as:function(a){var b,c;if(a=z(a),"month"===a||"year"===a)return b=this._days+this._milliseconds/864e5,c=this._months+12*rb(b),"month"===a?c:c/12;switch(b=this._days+Math.round(sb(this._months/12)),a){case"week":return b/7+this._milliseconds/6048e5;case"day":return b+this._milliseconds/864e5;case"hour":return 24*b+this._milliseconds/36e5;case"minute":return 24*b*60+this._milliseconds/6e4;case"second":return 24*b*60*60+this._milliseconds/1e3;case"millisecond":return Math.floor(24*b*60*60*1e3)+this._milliseconds;default:throw new Error("Unknown unit "+a)}},lang:vb.fn.lang,locale:vb.fn.locale,toIsoString:f("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",function(){return this.toISOString()}),toISOString:function(){var a=Math.abs(this.years()),b=Math.abs(this.months()),c=Math.abs(this.days()),d=Math.abs(this.hours()),e=Math.abs(this.minutes()),f=Math.abs(this.seconds()+this.milliseconds()/1e3);return this.asSeconds()?(this.asSeconds()<0?"-":"")+"P"+(a?a+"Y":"")+(b?b+"M":"")+(c?c+"D":"")+(d||e||f?"T":"")+(d?d+"H":"")+(e?e+"M":"")+(f?f+"S":""):"P0D"},localeData:function(){return this._locale},toJSON:function(){return this.toISOString()}}),vb.duration.fn.toString=vb.duration.fn.toISOString;for(xb in kc)c(kc,xb)&&tb(xb.toLowerCase());vb.duration.fn.asMilliseconds=function(){return this.as("ms")},vb.duration.fn.asSeconds=function(){return this.as("s")},vb.duration.fn.asMinutes=function(){return this.as("m")},vb.duration.fn.asHours=function(){return this.as("h")},vb.duration.fn.asDays=function(){return this.as("d")},vb.duration.fn.asWeeks=function(){return this.as("weeks")},vb.duration.fn.asMonths=function(){return this.as("M")},vb.duration.fn.asYears=function(){return this.as("y")},vb.locale("en",{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function(a){var b=a%10,c=1===C(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c}}),function(a){a(vb)}(function(a){return a.defineLocale("af",{months:"Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des".split("_"),weekdays:"Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag".split("_"),weekdaysShort:"Son_Maa_Din_Woe_Don_Vry_Sat".split("_"),weekdaysMin:"So_Ma_Di_Wo_Do_Vr_Sa".split("_"),meridiemParse:/vm|nm/i,isPM:function(a){return/^nm$/i.test(a)},meridiem:function(a,b,c){return 12>a?c?"vm":"VM":c?"nm":"NM"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Vandag om] LT",nextDay:"[Môre om] LT",nextWeek:"dddd [om] LT",lastDay:"[Gister om] LT",lastWeek:"[Laas] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oor %s",past:"%s gelede",s:"'n paar sekondes",m:"'n minuut",mm:"%d minute",h:"'n uur",hh:"%d ure",d:"'n dag",dd:"%d dae",M:"'n maand",MM:"%d maande",y:"'n jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ar-ma",{months:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split("_"),weekdays:"الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){var b={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},c={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"};return a.defineLocale("ar-sa",{months:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return c[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){return a.defineLocale("ar-tn",{months:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),monthsShort:"جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر".split("_"),weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[اليوم على الساعة] LT",nextDay:"[غدا على الساعة] LT",nextWeek:"dddd [على الساعة] LT",lastDay:"[أمس على الساعة] LT",lastWeek:"dddd [على الساعة] LT",sameElse:"L"},relativeTime:{future:"في %s",past:"منذ %s",s:"ثوان",m:"دقيقة",mm:"%d دقائق",h:"ساعة",hh:"%d ساعات",d:"يوم",dd:"%d أيام",M:"شهر",MM:"%d أشهر",y:"سنة",yy:"%d سنوات"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={1:"١",2:"٢",3:"٣",4:"٤",5:"٥",6:"٦",7:"٧",8:"٨",9:"٩",0:"٠"},c={"١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","٠":"0"},d=function(a){return 0===a?0:1===a?1:2===a?2:a%100>=3&&10>=a%100?3:a%100>=11?4:5},e={s:["أقل من ثانية","ثانية واحدة",["ثانيتان","ثانيتين"],"%d ثوان","%d ثانية","%d ثانية"],m:["أقل من دقيقة","دقيقة واحدة",["دقيقتان","دقيقتين"],"%d دقائق","%d دقيقة","%d دقيقة"],h:["أقل من ساعة","ساعة واحدة",["ساعتان","ساعتين"],"%d ساعات","%d ساعة","%d ساعة"],d:["أقل من يوم","يوم واحد",["يومان","يومين"],"%d أيام","%d يومًا","%d يوم"],M:["أقل من شهر","شهر واحد",["شهران","شهرين"],"%d أشهر","%d شهرا","%d شهر"],y:["أقل من عام","عام واحد",["عامان","عامين"],"%d أعوام","%d عامًا","%d عام"]},f=function(a){return function(b,c){var f=d(b),g=e[a][d(b)];return 2===f&&(g=g[c?0:1]),g.replace(/%d/i,b)}},g=["كانون الثاني يناير","شباط فبراير","آذار مارس","نيسان أبريل","أيار مايو","حزيران يونيو","تموز يوليو","آب أغسطس","أيلول سبتمبر","تشرين الأول أكتوبر","تشرين الثاني نوفمبر","كانون الأول ديسمبر"];return a.defineLocale("ar",{months:g,monthsShort:g,weekdays:"الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split("_"),weekdaysShort:"أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت".split("_"),weekdaysMin:"ح_ن_ث_ر_خ_ج_س".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},meridiemParse:/ص|م/,isPM:function(a){return"م"===a},meridiem:function(a){return 12>a?"ص":"م"},calendar:{sameDay:"[اليوم عند الساعة] LT",nextDay:"[غدًا عند الساعة] LT",nextWeek:"dddd [عند الساعة] LT",lastDay:"[أمس عند الساعة] LT",lastWeek:"dddd [عند الساعة] LT",sameElse:"L"},relativeTime:{future:"بعد %s",past:"منذ %s",s:f("s"),m:f("m"),mm:f("m"),h:f("h"),hh:f("h"),d:f("d"),dd:f("d"),M:f("M"),MM:f("M"),y:f("y"),yy:f("y")},preparse:function(a){return a.replace(/[١٢٣٤٥٦٧٨٩٠]/g,function(a){return c[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]}).replace(/,/g,"،")},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){var b={1:"-inci",5:"-inci",8:"-inci",70:"-inci",80:"-inci",2:"-nci",7:"-nci",20:"-nci",50:"-nci",3:"-üncü",4:"-üncü",100:"-üncü",6:"-ncı",9:"-uncu",10:"-uncu",30:"-uncu",60:"-ıncı",90:"-ıncı"};return a.defineLocale("az",{months:"yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr".split("_"),monthsShort:"yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek".split("_"),weekdays:"Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə".split("_"),weekdaysShort:"Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən".split("_"),weekdaysMin:"Bz_BE_ÇA_Çə_CA_Cü_Şə".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[sabah saat] LT",nextWeek:"[gələn həftə] dddd [saat] LT",lastDay:"[dünən] LT",lastWeek:"[keçən həftə] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s əvvəl",s:"birneçə saniyyə",m:"bir dəqiqə",mm:"%d dəqiqə",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir il",yy:"%d il"},meridiemParse:/gecə|səhər|gündüz|axşam/,isPM:function(a){return/^(gündüz|axşam)$/.test(a)},meridiem:function(a){return 4>a?"gecə":12>a?"səhər":17>a?"gündüz":"axşam"},ordinalParse:/\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,ordinal:function(a){if(0===a)return a+"-ıncı";var c=a%10,d=a%100-c,e=a>=100?100:null;return a+(b[c]||b[d]||b[e])},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function c(a,c,d){var e={mm:c?"хвіліна_хвіліны_хвілін":"хвіліну_хвіліны_хвілін",hh:c?"гадзіна_гадзіны_гадзін":"гадзіну_гадзіны_гадзін",dd:"дзень_дні_дзён",MM:"месяц_месяцы_месяцаў",yy:"год_гады_гадоў"};return"m"===d?c?"хвіліна":"хвіліну":"h"===d?c?"гадзіна":"гадзіну":a+" "+b(e[d],+a)}function d(a,b){var c={nominative:"студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань".split("_"),accusative:"студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function e(a,b){var c={nominative:"нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота".split("_"),accusative:"нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу".split("_")},d=/\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}return a.defineLocale("be",{months:d,monthsShort:"студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж".split("_"),weekdays:e,weekdaysShort:"нд_пн_ат_ср_чц_пт_сб".split("_"),weekdaysMin:"нд_пн_ат_ср_чц_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сёння ў] LT",nextDay:"[Заўтра ў] LT",lastDay:"[Учора ў] LT",nextWeek:function(){return"[У] dddd [ў] LT"},lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return"[У мінулую] dddd [ў] LT";case 1:case 2:case 4:return"[У мінулы] dddd [ў] LT"}},sameElse:"L"},relativeTime:{future:"праз %s",past:"%s таму",s:"некалькі секунд",m:c,mm:c,h:c,hh:c,d:"дзень",dd:c,M:"месяц",MM:c,y:"год",yy:c},meridiemParse:/ночы|раніцы|дня|вечара/,isPM:function(a){return/^(дня|вечара)$/.test(a)},meridiem:function(a){return 4>a?"ночы":12>a?"раніцы":17>a?"дня":"вечара"},ordinalParse:/\d{1,2}-(і|ы|га)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a%10!==2&&a%10!==3||a%100===12||a%100===13?a+"-ы":a+"-і";case"D":return a+"-га";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("bg",{months:"януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split("_"),monthsShort:"янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split("_"),weekdays:"неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split("_"),weekdaysShort:"нед_пон_вто_сря_чет_пет_съб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Днес в] LT",nextDay:"[Утре в] LT",nextWeek:"dddd [в] LT",lastDay:"[Вчера в] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[В изминалата] dddd [в] LT";case 1:case 2:case 4:case 5:return"[В изминалия] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"след %s",past:"преди %s",s:"няколко секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дни",M:"месец",MM:"%d месеца",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={1:"১",2:"২",3:"৩",4:"৪",5:"৫",6:"৬",7:"৭",8:"৮",9:"৯",0:"০"},c={"১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9","০":"0"};return a.defineLocale("bn",{months:"জানুয়ারী_ফেবুয়ারী_মার্চ_এপ্রিল_মে_জুন_জুলাই_অগাস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর".split("_"),monthsShort:"জানু_ফেব_মার্চ_এপর_মে_জুন_জুল_অগ_সেপ্ট_অক্টো_নভ_ডিসেম্".split("_"),weekdays:"রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পত্তিবার_শুক্রুবার_শনিবার".split("_"),weekdaysShort:"রবি_সোম_মঙ্গল_বুধ_বৃহস্পত্তি_শুক্রু_শনি".split("_"),weekdaysMin:"রব_সম_মঙ্গ_বু_ব্রিহ_শু_শনি".split("_"),longDateFormat:{LT:"A h:mm সময়",LTS:"A h:mm:ss সময়",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[আজ] LT",nextDay:"[আগামীকাল] LT",nextWeek:"dddd, LT",lastDay:"[গতকাল] LT",lastWeek:"[গত] dddd, LT",sameElse:"L"},relativeTime:{future:"%s পরে",past:"%s আগে",s:"কএক সেকেন্ড",m:"এক মিনিট",mm:"%d মিনিট",h:"এক ঘন্টা",hh:"%d ঘন্টা",d:"এক দিন",dd:"%d দিন",M:"এক মাস",MM:"%d মাস",y:"এক বছর",yy:"%d বছর"},preparse:function(a){return a.replace(/[১২৩৪৫৬৭৮৯০]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/রাত|শকাল|দুপুর|বিকেল|রাত/,isPM:function(a){return/^(দুপুর|বিকেল|রাত)$/.test(a)},meridiem:function(a){return 4>a?"রাত":10>a?"শকাল":17>a?"দুপুর":20>a?"বিকেল":"রাত"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){var b={1:"༡",2:"༢",3:"༣",4:"༤",5:"༥",6:"༦",7:"༧",8:"༨",9:"༩",0:"༠"},c={"༡":"1","༢":"2","༣":"3","༤":"4","༥":"5","༦":"6","༧":"7","༨":"8","༩":"9","༠":"0"};return a.defineLocale("bo",{months:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),monthsShort:"ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ".split("_"),weekdays:"གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་".split("_"),weekdaysShort:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),weekdaysMin:"ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་".split("_"),longDateFormat:{LT:"A h:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[དི་རིང] LT",nextDay:"[སང་ཉིན] LT",nextWeek:"[བདུན་ཕྲག་རྗེས་མ], LT",lastDay:"[ཁ་སང] LT",lastWeek:"[བདུན་ཕྲག་མཐའ་མ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s ལ་",past:"%s སྔན་ལ",s:"ལམ་སང",m:"སྐར་མ་གཅིག",mm:"%d སྐར་མ",h:"ཆུ་ཚོད་གཅིག",hh:"%d ཆུ་ཚོད",d:"ཉིན་གཅིག",dd:"%d ཉིན་",M:"ཟླ་བ་གཅིག",MM:"%d ཟླ་བ",y:"ལོ་གཅིག",yy:"%d ལོ"},preparse:function(a){return a.replace(/[༡༢༣༤༥༦༧༨༩༠]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,isPM:function(a){return/^(ཉིན་གུང|དགོང་དག|མཚན་མོ)$/.test(a)},meridiem:function(a){return 4>a?"མཚན་མོ":10>a?"ཞོགས་ཀས":17>a?"ཉིན་གུང":20>a?"དགོང་དག":"མཚན་མོ"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(b){function c(a,b,c){var d={mm:"munutenn",MM:"miz",dd:"devezh"};return a+" "+f(d[c],a)}function d(a){switch(e(a)){case 1:case 3:case 4:case 5:case 9:return a+" bloaz";default:return a+" vloaz"}}function e(a){return a>9?e(a%10):a}function f(a,b){return 2===b?g(a):a}function g(b){var c={m:"v",b:"v",d:"z"};return c[b.charAt(0)]===a?b:c[b.charAt(0)]+b.substring(1)}return b.defineLocale("br",{months:"Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split("_"),monthsShort:"Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split("_"),weekdays:"Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split("_"),weekdaysShort:"Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split("_"),weekdaysMin:"Su_Lu_Me_Mer_Ya_Gw_Sa".split("_"),longDateFormat:{LT:"h[e]mm A",LTS:"h[e]mm:ss A",L:"DD/MM/YYYY",LL:"D [a viz] MMMM YYYY",LLL:"D [a viz] MMMM YYYY LT",LLLL:"dddd, D [a viz] MMMM YYYY LT"},calendar:{sameDay:"[Hiziv da] LT",nextDay:"[Warc'hoazh da] LT",nextWeek:"dddd [da] LT",lastDay:"[Dec'h da] LT",lastWeek:"dddd [paset da] LT",sameElse:"L"},relativeTime:{future:"a-benn %s",past:"%s 'zo",s:"un nebeud segondennoù",m:"ur vunutenn",mm:c,h:"un eur",hh:"%d eur",d:"un devezh",dd:c,M:"ur miz",MM:c,y:"ur bloaz",yy:d},ordinalParse:/\d{1,2}(añ|vet)/,ordinal:function(a){var b=1===a?"añ":"vet";return a+b},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}return a.defineLocale("bs",{months:"januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:b,mm:b,h:b,hh:b,d:"dan",dd:b,M:"mjesec",MM:b,y:"godinu",yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("ca",{months:"gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre".split("_"),monthsShort:"gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.".split("_"),weekdays:"diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte".split("_"),weekdaysShort:"dg._dl._dt._dc._dj._dv._ds.".split("_"),weekdaysMin:"Dg_Dl_Dt_Dc_Dj_Dv_Ds".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[avui a "+(1!==this.hours()?"les":"la")+"] LT"},nextDay:function(){return"[demà a "+(1!==this.hours()?"les":"la")+"] LT"},nextWeek:function(){return"dddd [a "+(1!==this.hours()?"les":"la")+"] LT"},lastDay:function(){return"[ahir a "+(1!==this.hours()?"les":"la")+"] LT"},lastWeek:function(){return"[el] dddd [passat a "+(1!==this.hours()?"les":"la")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"fa %s",s:"uns segons",m:"un minut",mm:"%d minuts",h:"una hora",hh:"%d hores",d:"un dia",dd:"%d dies",M:"un mes",MM:"%d mesos",y:"un any",yy:"%d anys"},ordinalParse:/\d{1,2}(r|n|t|è|a)/,ordinal:function(a,b){var c=1===a?"r":2===a?"n":3===a?"r":4===a?"t":"è";return("w"===b||"W"===b)&&(c="a"),a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a){return a>1&&5>a&&1!==~~(a/10)}function c(a,c,d,e){var f=a+" ";switch(d){case"s":return c||e?"pár sekund":"pár sekundami";case"m":return c?"minuta":e?"minutu":"minutou";case"mm":return c||e?f+(b(a)?"minuty":"minut"):f+"minutami";break;case"h":return c?"hodina":e?"hodinu":"hodinou";case"hh":return c||e?f+(b(a)?"hodiny":"hodin"):f+"hodinami";break;case"d":return c||e?"den":"dnem";case"dd":return c||e?f+(b(a)?"dny":"dní"):f+"dny";break;case"M":return c||e?"měsíc":"měsícem";case"MM":return c||e?f+(b(a)?"měsíce":"měsíců"):f+"měsíci";break;case"y":return c||e?"rok":"rokem";case"yy":return c||e?f+(b(a)?"roky":"let"):f+"lety"}}var d="leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split("_"),e="led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split("_");return a.defineLocale("cs",{months:d,monthsShort:e,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(d,e),weekdays:"neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split("_"),weekdaysShort:"ne_po_út_st_čt_pá_so".split("_"),weekdaysMin:"ne_po_út_st_čt_pá_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes v] LT",nextDay:"[zítra v] LT",nextWeek:function(){switch(this.day()){case 0:return"[v neděli v] LT";case 1:case 2:return"[v] dddd [v] LT";case 3:return"[ve středu v] LT";case 4:return"[ve čtvrtek v] LT";case 5:return"[v pátek v] LT";case 6:return"[v sobotu v] LT"}},lastDay:"[včera v] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulou neděli v] LT";case 1:case 2:return"[minulé] dddd [v] LT";case 3:return"[minulou středu v] LT";case 4:case 5:return"[minulý] dddd [v] LT";case 6:return"[minulou sobotu v] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"před %s",s:c,m:c,mm:c,h:c,hh:c,d:c,dd:c,M:c,MM:c,y:c,yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("cv",{months:"кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split("_"),monthsShort:"кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split("_"),weekdays:"вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split("_"),weekdaysShort:"выр_тун_ытл_юн_кĕç_эрн_шăм".split("_"),weekdaysMin:"вр_тн_ыт_юн_кç_эр_шм".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]",LLL:"YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT",LLLL:"dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"},calendar:{sameDay:"[Паян] LT [сехетре]",nextDay:"[Ыран] LT [сехетре]",lastDay:"[Ĕнер] LT [сехетре]",nextWeek:"[Çитес] dddd LT [сехетре]",lastWeek:"[Иртнĕ] dddd LT [сехетре]",sameElse:"L"},relativeTime:{future:function(a){var b=/сехет$/i.exec(a)?"рен":/çул$/i.exec(a)?"тан":"ран";return a+b},past:"%s каялла",s:"пĕр-ик çеккунт",m:"пĕр минут",mm:"%d минут",h:"пĕр сехет",hh:"%d сехет",d:"пĕр кун",dd:"%d кун",M:"пĕр уйăх",MM:"%d уйăх",y:"пĕр çул",yy:"%d çул"},ordinalParse:/\d{1,2}-мĕш/,ordinal:"%d-мĕш",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("cy",{months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Heddiw am] LT",nextDay:"[Yfory am] LT",nextWeek:"dddd [am] LT",lastDay:"[Ddoe am] LT",lastWeek:"dddd [diwethaf am] LT",sameElse:"L"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"},ordinalParse:/\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,ordinal:function(a){var b=a,c="",d=["","af","il","ydd","ydd","ed","ed","ed","fed","fed","fed","eg","fed","eg","eg","fed","eg","eg","fed","eg","fed"];return b>20?c=40===b||50===b||60===b||80===b||100===b?"fed":"ain":b>0&&(c=d[b]),a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("da",{months:"januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tir_ons_tor_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd [d.] D. MMMM YYYY LT"},calendar:{sameDay:"[I dag kl.] LT",nextDay:"[I morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[I går kl.] LT",lastWeek:"[sidste] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"%s siden",s:"få sekunder",m:"et minut",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dage",M:"en måned",MM:"%d måneder",y:"et år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?d[c][0]:d[c][1]}return a.defineLocale("de-at",{months:"Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:b,mm:"%d Minuten",h:b,hh:"%d Stunden",d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={m:["eine Minute","einer Minute"],h:["eine Stunde","einer Stunde"],d:["ein Tag","einem Tag"],dd:[a+" Tage",a+" Tagen"],M:["ein Monat","einem Monat"],MM:[a+" Monate",a+" Monaten"],y:["ein Jahr","einem Jahr"],yy:[a+" Jahre",a+" Jahren"]};return b?d[c][0]:d[c][1]}return a.defineLocale("de",{months:"Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),weekdaysShort:"So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mo_Di_Mi_Do_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Heute um] LT [Uhr]",sameElse:"L",nextDay:"[Morgen um] LT [Uhr]",nextWeek:"dddd [um] LT [Uhr]",lastDay:"[Gestern um] LT [Uhr]",lastWeek:"[letzten] dddd [um] LT [Uhr]"},relativeTime:{future:"in %s",past:"vor %s",s:"ein paar Sekunden",m:b,mm:"%d Minuten",h:b,hh:"%d Stunden",d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("el",{monthsNominativeEl:"Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split("_"),monthsGenitiveEl:"Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split("_"),months:function(a,b){return/D/.test(b.substring(0,b.indexOf("MMMM")))?this._monthsGenitiveEl[a.month()]:this._monthsNominativeEl[a.month()]},monthsShort:"Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split("_"),weekdays:"Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split("_"),weekdaysShort:"Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split("_"),weekdaysMin:"Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split("_"),meridiem:function(a,b,c){return a>11?c?"μμ":"ΜΜ":c?"πμ":"ΠΜ"},isPM:function(a){return"μ"===(a+"").toLowerCase()[0]},meridiemParse:/[ΠΜ]\.?Μ?\.?/i,longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendarEl:{sameDay:"[Σήμερα {}] LT",nextDay:"[Αύριο {}] LT",nextWeek:"dddd [{}] LT",lastDay:"[Χθες {}] LT",lastWeek:function(){switch(this.day()){case 6:return"[το προηγούμενο] dddd [{}] LT";default:return"[την προηγούμενη] dddd [{}] LT"}},sameElse:"L"},calendar:function(a,b){var c=this._calendarEl[a],d=b&&b.hours();return"function"==typeof c&&(c=c.apply(b)),c.replace("{}",d%12===1?"στη":"στις")},relativeTime:{future:"σε %s",past:"%s πριν",s:"λίγα δευτερόλεπτα",m:"ένα λεπτό",mm:"%d λεπτά",h:"μία ώρα",hh:"%d ώρες",d:"μία μέρα",dd:"%d μέρες",M:"ένας μήνας",MM:"%d μήνες",y:"ένας χρόνος",yy:"%d χρόνια"},ordinalParse:/\d{1,2}η/,ordinal:"%dη",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("en-au",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("en-ca",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"YYYY-MM-DD",LL:"D MMMM, YYYY",LLL:"D MMMM, YYYY LT",LLLL:"dddd, D MMMM, YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";
return a+c}})}),function(a){a(vb)}(function(a){return a.defineLocale("en-gb",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[Last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinalParse:/\d{1,2}(st|nd|rd|th)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"th":1===b?"st":2===b?"nd":3===b?"rd":"th";return a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("eo",{months:"januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split("_"),weekdays:"Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split("_"),weekdaysShort:"Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Ĵa_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D[-an de] MMMM, YYYY",LLL:"D[-an de] MMMM, YYYY LT",LLLL:"dddd, [la] D[-an de] MMMM, YYYY LT"},meridiemParse:/[ap]\.t\.m/i,isPM:function(a){return"p"===a.charAt(0).toLowerCase()},meridiem:function(a,b,c){return a>11?c?"p.t.m.":"P.T.M.":c?"a.t.m.":"A.T.M."},calendar:{sameDay:"[Hodiaŭ je] LT",nextDay:"[Morgaŭ je] LT",nextWeek:"dddd [je] LT",lastDay:"[Hieraŭ je] LT",lastWeek:"[pasinta] dddd [je] LT",sameElse:"L"},relativeTime:{future:"je %s",past:"antaŭ %s",s:"sekundoj",m:"minuto",mm:"%d minutoj",h:"horo",hh:"%d horoj",d:"tago",dd:"%d tagoj",M:"monato",MM:"%d monatoj",y:"jaro",yy:"%d jaroj"},ordinalParse:/\d{1,2}a/,ordinal:"%da",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b="ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),c="ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");return a.defineLocale("es",{months:"enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),monthsShort:function(a,d){return/-MMM-/.test(d)?c[a.month()]:b[a.month()]},weekdays:"domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),weekdaysShort:"dom._lun._mar._mié._jue._vie._sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:function(){return"[hoy a la"+(1!==this.hours()?"s":"")+"] LT"},nextDay:function(){return"[mañana a la"+(1!==this.hours()?"s":"")+"] LT"},nextWeek:function(){return"dddd [a la"+(1!==this.hours()?"s":"")+"] LT"},lastDay:function(){return"[ayer a la"+(1!==this.hours()?"s":"")+"] LT"},lastWeek:function(){return"[el] dddd [pasado a la"+(1!==this.hours()?"s":"")+"] LT"},sameElse:"L"},relativeTime:{future:"en %s",past:"hace %s",s:"unos segundos",m:"un minuto",mm:"%d minutos",h:"una hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un año",yy:"%d años"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c,d){var e={s:["mõne sekundi","mõni sekund","paar sekundit"],m:["ühe minuti","üks minut"],mm:[a+" minuti",a+" minutit"],h:["ühe tunni","tund aega","üks tund"],hh:[a+" tunni",a+" tundi"],d:["ühe päeva","üks päev"],M:["kuu aja","kuu aega","üks kuu"],MM:[a+" kuu",a+" kuud"],y:["ühe aasta","aasta","üks aasta"],yy:[a+" aasta",a+" aastat"]};return b?e[c][2]?e[c][2]:e[c][1]:d?e[c][0]:e[c][1]}return a.defineLocale("et",{months:"jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split("_"),monthsShort:"jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split("_"),weekdays:"pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split("_"),weekdaysShort:"P_E_T_K_N_R_L".split("_"),weekdaysMin:"P_E_T_K_N_R_L".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Täna,] LT",nextDay:"[Homme,] LT",nextWeek:"[Järgmine] dddd LT",lastDay:"[Eile,] LT",lastWeek:"[Eelmine] dddd LT",sameElse:"L"},relativeTime:{future:"%s pärast",past:"%s tagasi",s:b,m:b,mm:b,h:b,hh:b,d:b,dd:"%d päeva",M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("eu",{months:"urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),monthsShort:"urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),weekdays:"igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),weekdaysShort:"ig._al._ar._az._og._ol._lr.".split("_"),weekdaysMin:"ig_al_ar_az_og_ol_lr".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY[ko] MMMM[ren] D[a]",LLL:"YYYY[ko] MMMM[ren] D[a] LT",LLLL:"dddd, YYYY[ko] MMMM[ren] D[a] LT",l:"YYYY-M-D",ll:"YYYY[ko] MMM D[a]",lll:"YYYY[ko] MMM D[a] LT",llll:"ddd, YYYY[ko] MMM D[a] LT"},calendar:{sameDay:"[gaur] LT[etan]",nextDay:"[bihar] LT[etan]",nextWeek:"dddd LT[etan]",lastDay:"[atzo] LT[etan]",lastWeek:"[aurreko] dddd LT[etan]",sameElse:"L"},relativeTime:{future:"%s barru",past:"duela %s",s:"segundo batzuk",m:"minutu bat",mm:"%d minutu",h:"ordu bat",hh:"%d ordu",d:"egun bat",dd:"%d egun",M:"hilabete bat",MM:"%d hilabete",y:"urte bat",yy:"%d urte"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={1:"۱",2:"۲",3:"۳",4:"۴",5:"۵",6:"۶",7:"۷",8:"۸",9:"۹",0:"۰"},c={"۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","۰":"0"};return a.defineLocale("fa",{months:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),monthsShort:"ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split("_"),weekdays:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysShort:"یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split("_"),weekdaysMin:"ی_د_س_چ_پ_ج_ش".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},meridiemParse:/قبل از ظهر|بعد از ظهر/,isPM:function(a){return/بعد از ظهر/.test(a)},meridiem:function(a){return 12>a?"قبل از ظهر":"بعد از ظهر"},calendar:{sameDay:"[امروز ساعت] LT",nextDay:"[فردا ساعت] LT",nextWeek:"dddd [ساعت] LT",lastDay:"[دیروز ساعت] LT",lastWeek:"dddd [پیش] [ساعت] LT",sameElse:"L"},relativeTime:{future:"در %s",past:"%s پیش",s:"چندین ثانیه",m:"یک دقیقه",mm:"%d دقیقه",h:"یک ساعت",hh:"%d ساعت",d:"یک روز",dd:"%d روز",M:"یک ماه",MM:"%d ماه",y:"یک سال",yy:"%d سال"},preparse:function(a){return a.replace(/[۰-۹]/g,function(a){return c[a]}).replace(/،/g,",")},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]}).replace(/,/g,"،")},ordinalParse:/\d{1,2}م/,ordinal:"%dم",week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){function b(a,b,d,e){var f="";switch(d){case"s":return e?"muutaman sekunnin":"muutama sekunti";case"m":return e?"minuutin":"minuutti";case"mm":f=e?"minuutin":"minuuttia";break;case"h":return e?"tunnin":"tunti";case"hh":f=e?"tunnin":"tuntia";break;case"d":return e?"päivän":"päivä";case"dd":f=e?"päivän":"päivää";break;case"M":return e?"kuukauden":"kuukausi";case"MM":f=e?"kuukauden":"kuukautta";break;case"y":return e?"vuoden":"vuosi";case"yy":f=e?"vuoden":"vuotta"}return f=c(a,e)+" "+f}function c(a,b){return 10>a?b?e[a]:d[a]:a}var d="nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(" "),e=["nolla","yhden","kahden","kolmen","neljän","viiden","kuuden",d[7],d[8],d[9]];return a.defineLocale("fi",{months:"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),monthsShort:"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split("_"),weekdays:"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),weekdaysShort:"su_ma_ti_ke_to_pe_la".split("_"),weekdaysMin:"su_ma_ti_ke_to_pe_la".split("_"),longDateFormat:{LT:"HH.mm",LTS:"HH.mm.ss",L:"DD.MM.YYYY",LL:"Do MMMM[ta] YYYY",LLL:"Do MMMM[ta] YYYY, [klo] LT",LLLL:"dddd, Do MMMM[ta] YYYY, [klo] LT",l:"D.M.YYYY",ll:"Do MMM YYYY",lll:"Do MMM YYYY, [klo] LT",llll:"ddd, Do MMM YYYY, [klo] LT"},calendar:{sameDay:"[tänään] [klo] LT",nextDay:"[huomenna] [klo] LT",nextWeek:"dddd [klo] LT",lastDay:"[eilen] [klo] LT",lastWeek:"[viime] dddd[na] [klo] LT",sameElse:"L"},relativeTime:{future:"%s päästä",past:"%s sitten",s:b,m:b,mm:b,h:b,hh:b,d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("fo",{months:"januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split("_"),weekdaysShort:"sun_mán_týs_mik_hós_frí_ley".split("_"),weekdaysMin:"su_má_tý_mi_hó_fr_le".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D. MMMM, YYYY LT"},calendar:{sameDay:"[Í dag kl.] LT",nextDay:"[Í morgin kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[Í gjár kl.] LT",lastWeek:"[síðstu] dddd [kl] LT",sameElse:"L"},relativeTime:{future:"um %s",past:"%s síðani",s:"fá sekund",m:"ein minutt",mm:"%d minuttir",h:"ein tími",hh:"%d tímar",d:"ein dagur",dd:"%d dagar",M:"ein mánaði",MM:"%d mánaðir",y:"eitt ár",yy:"%d ár"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("fr-ca",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")}})}),function(a){a(vb)}(function(a){return a.defineLocale("fr",{months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Aujourd'hui à] LT",nextDay:"[Demain à] LT",nextWeek:"dddd [à] LT",lastDay:"[Hier à] LT",lastWeek:"dddd [dernier à] LT",sameElse:"L"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinalParse:/\d{1,2}(er|)/,ordinal:function(a){return a+(1===a?"er":"")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b="jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.".split("_"),c="jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_");return a.defineLocale("fy",{months:"jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber".split("_"),monthsShort:function(a,d){return/-MMM-/.test(d)?c[a.month()]:b[a.month()]},weekdays:"snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon".split("_"),weekdaysShort:"si._mo._ti._wo._to._fr._so.".split("_"),weekdaysMin:"Si_Mo_Ti_Wo_To_Fr_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[hjoed om] LT",nextDay:"[moarn om] LT",nextWeek:"dddd [om] LT",lastDay:"[juster om] LT",lastWeek:"[ôfrûne] dddd [om] LT",sameElse:"L"},relativeTime:{future:"oer %s",past:"%s lyn",s:"in pear sekonden",m:"ien minút",mm:"%d minuten",h:"ien oere",hh:"%d oeren",d:"ien dei",dd:"%d dagen",M:"ien moanne",MM:"%d moannen",y:"ien jier",yy:"%d jierren"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("gl",{months:"Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split("_"),monthsShort:"Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),weekdays:"Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),weekdaysShort:"Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),weekdaysMin:"Do_Lu_Ma_Mé_Xo_Ve_Sá".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:function(){return"[hoxe "+(1!==this.hours()?"ás":"á")+"] LT"},nextDay:function(){return"[mañá "+(1!==this.hours()?"ás":"á")+"] LT"},nextWeek:function(){return"dddd ["+(1!==this.hours()?"ás":"a")+"] LT"},lastDay:function(){return"[onte "+(1!==this.hours()?"á":"a")+"] LT"},lastWeek:function(){return"[o] dddd [pasado "+(1!==this.hours()?"ás":"a")+"] LT"},sameElse:"L"},relativeTime:{future:function(a){return"uns segundos"===a?"nuns segundos":"en "+a},past:"hai %s",s:"uns segundos",m:"un minuto",mm:"%d minutos",h:"unha hora",hh:"%d horas",d:"un día",dd:"%d días",M:"un mes",MM:"%d meses",y:"un ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("he",{months:"ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split("_"),monthsShort:"ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split("_"),weekdays:"ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split("_"),weekdaysShort:"א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split("_"),weekdaysMin:"א_ב_ג_ד_ה_ו_ש".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [ב]MMMM YYYY",LLL:"D [ב]MMMM YYYY LT",LLLL:"dddd, D [ב]MMMM YYYY LT",l:"D/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[היום ב־]LT",nextDay:"[מחר ב־]LT",nextWeek:"dddd [בשעה] LT",lastDay:"[אתמול ב־]LT",lastWeek:"[ביום] dddd [האחרון בשעה] LT",sameElse:"L"},relativeTime:{future:"בעוד %s",past:"לפני %s",s:"מספר שניות",m:"דקה",mm:"%d דקות",h:"שעה",hh:function(a){return 2===a?"שעתיים":a+" שעות"},d:"יום",dd:function(a){return 2===a?"יומיים":a+" ימים"},M:"חודש",MM:function(a){return 2===a?"חודשיים":a+" חודשים"},y:"שנה",yy:function(a){return 2===a?"שנתיים":a%10===0&&10!==a?a+" שנה":a+" שנים"}}})}),function(a){a(vb)}(function(a){var b={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},c={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};return a.defineLocale("hi",{months:"जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split("_"),monthsShort:"जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split("_"),weekdays:"रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm बजे",LTS:"A h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[कल] LT",nextWeek:"dddd, LT",lastDay:"[कल] LT",lastWeek:"[पिछले] dddd, LT",sameElse:"L"},relativeTime:{future:"%s में",past:"%s पहले",s:"कुछ ही क्षण",m:"एक मिनट",mm:"%d मिनट",h:"एक घंटा",hh:"%d घंटे",d:"एक दिन",dd:"%d दिन",M:"एक महीने",MM:"%d महीने",y:"एक वर्ष",yy:"%d वर्ष"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/रात|सुबह|दोपहर|शाम/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात"===b?4>a?a:a+12:"सुबह"===b?a:"दोपहर"===b?a>=10?a:a+12:"शाम"===b?a+12:void 0},meridiem:function(a){return 4>a?"रात":10>a?"सुबह":17>a?"दोपहर":20>a?"शाम":"रात"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a+" ";switch(c){case"m":return b?"jedna minuta":"jedne minute";case"mm":return d+=1===a?"minuta":2===a||3===a||4===a?"minute":"minuta";case"h":return b?"jedan sat":"jednog sata";case"hh":return d+=1===a?"sat":2===a||3===a||4===a?"sata":"sati";case"dd":return d+=1===a?"dan":"dana";case"MM":return d+=1===a?"mjesec":2===a||3===a||4===a?"mjeseca":"mjeseci";case"yy":return d+=1===a?"godina":2===a||3===a||4===a?"godine":"godina"}}return a.defineLocale("hr",{months:"sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split("_"),monthsShort:"sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split("_"),weekdays:"nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split("_"),weekdaysShort:"ned._pon._uto._sri._čet._pet._sub.".split("_"),weekdaysMin:"ne_po_ut_sr_če_pe_su".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedjelju] [u] LT";case 3:return"[u] [srijedu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[jučer u] LT",lastWeek:function(){switch(this.day()){case 0:case 3:return"[prošlu] dddd [u] LT";case 6:return"[prošle] [subote] [u] LT";case 1:case 2:case 4:case 5:return"[prošli] dddd [u] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"prije %s",s:"par sekundi",m:b,mm:b,h:b,hh:b,d:"dan",dd:b,M:"mjesec",MM:b,y:"godinu",yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b,c,d){var e=a;switch(c){case"s":return d||b?"néhány másodperc":"néhány másodperce";case"m":return"egy"+(d||b?" perc":" perce");case"mm":return e+(d||b?" perc":" perce");case"h":return"egy"+(d||b?" óra":" órája");case"hh":return e+(d||b?" óra":" órája");case"d":return"egy"+(d||b?" nap":" napja");case"dd":return e+(d||b?" nap":" napja");case"M":return"egy"+(d||b?" hónap":" hónapja");case"MM":return e+(d||b?" hónap":" hónapja");case"y":return"egy"+(d||b?" év":" éve");case"yy":return e+(d||b?" év":" éve")}return""}function c(a){return(a?"":"[múlt] ")+"["+d[this.day()]+"] LT[-kor]"}var d="vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split(" ");return a.defineLocale("hu",{months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D., LT",LLLL:"YYYY. MMMM D., dddd LT"},meridiemParse:/de|du/i,isPM:function(a){return"u"===a.charAt(1).toLowerCase()},meridiem:function(a,b,c){return 12>a?c===!0?"de":"DE":c===!0?"du":"DU"},calendar:{sameDay:"[ma] LT[-kor]",nextDay:"[holnap] LT[-kor]",nextWeek:function(){return c.call(this,!0)},lastDay:"[tegnap] LT[-kor]",lastWeek:function(){return c.call(this,!1)},sameElse:"L"},relativeTime:{future:"%s múlva",past:"%s",s:b,m:b,mm:b,h:b,hh:b,d:b,dd:b,M:b,MM:b,y:b,yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b){var c={nominative:"հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր".split("_"),accusative:"հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function c(a){var b="հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ".split("_");return b[a.month()]}function d(a){var b="կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ".split("_");return b[a.day()]}return a.defineLocale("hy-am",{months:b,monthsShort:c,weekdays:d,weekdaysShort:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),weekdaysMin:"կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY թ.",LLL:"D MMMM YYYY թ., LT",LLLL:"dddd, D MMMM YYYY թ., LT"},calendar:{sameDay:"[այսօր] LT",nextDay:"[վաղը] LT",lastDay:"[երեկ] LT",nextWeek:function(){return"dddd [օրը ժամը] LT"},lastWeek:function(){return"[անցած] dddd [օրը ժամը] LT"},sameElse:"L"},relativeTime:{future:"%s հետո",past:"%s առաջ",s:"մի քանի վայրկյան",m:"րոպե",mm:"%d րոպե",h:"ժամ",hh:"%d ժամ",d:"օր",dd:"%d օր",M:"ամիս",MM:"%d ամիս",y:"տարի",yy:"%d տարի"},meridiemParse:/գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,isPM:function(a){return/^(ցերեկվա|երեկոյան)$/.test(a)},meridiem:function(a){return 4>a?"գիշերվա":12>a?"առավոտվա":17>a?"ցերեկվա":"երեկոյան"},ordinalParse:/\d{1,2}|\d{1,2}-(ին|րդ)/,ordinal:function(a,b){switch(b){case"DDD":case"w":case"W":case"DDDo":return 1===a?a+"-ին":a+"-րդ";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("id",{months:"Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split("_"),monthsShort:"Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split("_"),weekdays:"Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split("_"),weekdaysShort:"Min_Sen_Sel_Rab_Kam_Jum_Sab".split("_"),weekdaysMin:"Mg_Sn_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|siang|sore|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"siang"===b?a>=11?a:a+12:"sore"===b||"malam"===b?a+12:void 0},meridiem:function(a){return 11>a?"pagi":15>a?"siang":19>a?"sore":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Besok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kemarin pukul] LT",lastWeek:"dddd [lalu pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lalu",s:"beberapa detik",m:"semenit",mm:"%d menit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a){return a%100===11?!0:a%10===1?!1:!0}function c(a,c,d,e){var f=a+" ";switch(d){case"s":return c||e?"nokkrar sekúndur":"nokkrum sekúndum";case"m":return c?"mínúta":"mínútu";case"mm":return b(a)?f+(c||e?"mínútur":"mínútum"):c?f+"mínúta":f+"mínútu";case"hh":return b(a)?f+(c||e?"klukkustundir":"klukkustundum"):f+"klukkustund";case"d":return c?"dagur":e?"dag":"degi";case"dd":return b(a)?c?f+"dagar":f+(e?"daga":"dögum"):c?f+"dagur":f+(e?"dag":"degi");case"M":return c?"mánuður":e?"mánuð":"mánuði";case"MM":return b(a)?c?f+"mánuðir":f+(e?"mánuði":"mánuðum"):c?f+"mánuður":f+(e?"mánuð":"mánuði");case"y":return c||e?"ár":"ári";case"yy":return b(a)?f+(c||e?"ár":"árum"):f+(c||e?"ár":"ári")}}return a.defineLocale("is",{months:"janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split("_"),monthsShort:"jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split("_"),weekdays:"sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split("_"),weekdaysShort:"sun_mán_þri_mið_fim_fös_lau".split("_"),weekdaysMin:"Su_Má_Þr_Mi_Fi_Fö_La".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd, D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[í dag kl.] LT",nextDay:"[á morgun kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[í gær kl.] LT",lastWeek:"[síðasta] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"eftir %s",past:"fyrir %s síðan",s:c,m:c,mm:c,h:"klukkustund",hh:c,d:c,dd:c,M:c,MM:c,y:c,yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("it",{months:"gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre".split("_"),monthsShort:"gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic".split("_"),weekdays:"Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split("_"),weekdaysShort:"Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),weekdaysMin:"D_L_Ma_Me_G_V_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Oggi alle] LT",nextDay:"[Domani alle] LT",nextWeek:"dddd [alle] LT",lastDay:"[Ieri alle] LT",lastWeek:function(){switch(this.day()){case 0:return"[la scorsa] dddd [alle] LT";default:return"[lo scorso] dddd [alle] LT"}},sameElse:"L"},relativeTime:{future:function(a){return(/^[0-9].+$/.test(a)?"tra":"in")+" "+a},past:"%s fa",s:"alcuni secondi",m:"un minuto",mm:"%d minuti",h:"un'ora",hh:"%d ore",d:"un giorno",dd:"%d giorni",M:"un mese",MM:"%d mesi",y:"un anno",yy:"%d anni"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ja",{months:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split("_"),weekdaysShort:"日_月_火_水_木_金_土".split("_"),weekdaysMin:"日_月_火_水_木_金_土".split("_"),longDateFormat:{LT:"Ah時m分",LTS:"LTs秒",L:"YYYY/MM/DD",LL:"YYYY年M月D日",LLL:"YYYY年M月D日LT",LLLL:"YYYY年M月D日LT dddd"},meridiemParse:/午前|午後/i,isPM:function(a){return"午後"===a},meridiem:function(a){return 12>a?"午前":"午後"},calendar:{sameDay:"[今日] LT",nextDay:"[明日] LT",nextWeek:"[来週]dddd LT",lastDay:"[昨日] LT",lastWeek:"[前週]dddd LT",sameElse:"L"},relativeTime:{future:"%s後",past:"%s前",s:"数秒",m:"1分",mm:"%d分",h:"1時間",hh:"%d時間",d:"1日",dd:"%d日",M:"1ヶ月",MM:"%dヶ月",y:"1年",yy:"%d年"}})}),function(a){a(vb)}(function(a){function b(a,b){var c={nominative:"იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split("_"),accusative:"იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split("_")},d=/D[oD] *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function c(a,b){var c={nominative:"კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split("_"),accusative:"კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split("_")},d=/(წინა|შემდეგ)/.test(b)?"accusative":"nominative";return c[d][a.day()]}return a.defineLocale("ka",{months:b,monthsShort:"იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split("_"),weekdays:c,weekdaysShort:"კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split("_"),weekdaysMin:"კვ_ორ_სა_ოთ_ხუ_პა_შა".split("_"),longDateFormat:{LT:"h:mm A",LTS:"h:mm:ss A",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[დღეს] LT[-ზე]",nextDay:"[ხვალ] LT[-ზე]",lastDay:"[გუშინ] LT[-ზე]",nextWeek:"[შემდეგ] dddd LT[-ზე]",lastWeek:"[წინა] dddd LT-ზე",sameElse:"L"},relativeTime:{future:function(a){return/(წამი|წუთი|საათი|წელი)/.test(a)?a.replace(/ი$/,"ში"):a+"ში"},past:function(a){return/(წამი|წუთი|საათი|დღე|თვე)/.test(a)?a.replace(/(ი|ე)$/,"ის წინ"):/წელი/.test(a)?a.replace(/წელი$/,"წლის წინ"):void 0},s:"რამდენიმე წამი",m:"წუთი",mm:"%d წუთი",h:"საათი",hh:"%d საათი",d:"დღე",dd:"%d დღე",M:"თვე",MM:"%d თვე",y:"წელი",yy:"%d წელი"},ordinalParse:/0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,ordinal:function(a){return 0===a?a:1===a?a+"-ლი":20>a||100>=a&&a%20===0||a%100===0?"მე-"+a:a+"-ე"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("km",{months:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),monthsShort:"មករា_កុម្ភៈ_មិនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ".split("_"),weekdays:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysShort:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),weekdaysMin:"អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[ថ្ងៃនៈ ម៉ោង] LT",nextDay:"[ស្អែក ម៉ោង] LT",nextWeek:"dddd [ម៉ោង] LT",lastDay:"[ម្សិលមិញ ម៉ោង] LT",lastWeek:"dddd [សប្តាហ៍មុន] [ម៉ោង] LT",sameElse:"L"},relativeTime:{future:"%sទៀត",past:"%sមុន",s:"ប៉ុន្មានវិនាទី",m:"មួយនាទី",mm:"%d នាទី",h:"មួយម៉ោង",hh:"%d ម៉ោង",d:"មួយថ្ងៃ",dd:"%d ថ្ងៃ",M:"មួយខែ",MM:"%d ខែ",y:"មួយឆ្នាំ",yy:"%d ឆ្នាំ"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ko",{months:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),monthsShort:"1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),weekdays:"일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),weekdaysShort:"일_월_화_수_목_금_토".split("_"),weekdaysMin:"일_월_화_수_목_금_토".split("_"),longDateFormat:{LT:"A h시 m분",LTS:"A h시 m분 s초",L:"YYYY.MM.DD",LL:"YYYY년 MMMM D일",LLL:"YYYY년 MMMM D일 LT",LLLL:"YYYY년 MMMM D일 dddd LT"},calendar:{sameDay:"오늘 LT",nextDay:"내일 LT",nextWeek:"dddd LT",lastDay:"어제 LT",lastWeek:"지난주 dddd LT",sameElse:"L"},relativeTime:{future:"%s 후",past:"%s 전",s:"몇초",ss:"%d초",m:"일분",mm:"%d분",h:"한시간",hh:"%d시간",d:"하루",dd:"%d일",M:"한달",MM:"%d달",y:"일년",yy:"%d년"},ordinalParse:/\d{1,2}일/,ordinal:"%d일",meridiemParse:/오전|오후/,isPM:function(a){return"오후"===a},meridiem:function(a){return 12>a?"오전":"오후"}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={m:["eng Minutt","enger Minutt"],h:["eng Stonn","enger Stonn"],d:["een Dag","engem Dag"],M:["ee Mount","engem Mount"],y:["ee Joer","engem Joer"]};return b?d[c][0]:d[c][1]}function c(a){var b=a.substr(0,a.indexOf(" "));return e(b)?"a "+a:"an "+a}function d(a){var b=a.substr(0,a.indexOf(" "));return e(b)?"viru "+a:"virun "+a}function e(a){if(a=parseInt(a,10),isNaN(a))return!1;if(0>a)return!0;if(10>a)return a>=4&&7>=a?!0:!1;if(100>a){var b=a%10,c=a/10;return e(0===b?c:b)}if(1e4>a){for(;a>=10;)a/=10;return e(a)}return a/=1e3,e(a)}return a.defineLocale("lb",{months:"Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),monthsShort:"Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),weekdays:"Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split("_"),weekdaysShort:"So._Mé._Dë._Më._Do._Fr._Sa.".split("_"),weekdaysMin:"So_Mé_Dë_Më_Do_Fr_Sa".split("_"),longDateFormat:{LT:"H:mm [Auer]",LTS:"H:mm:ss [Auer]",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[Haut um] LT",sameElse:"L",nextDay:"[Muer um] LT",nextWeek:"dddd [um] LT",lastDay:"[Gëschter um] LT",lastWeek:function(){switch(this.day()){case 2:case 4:return"[Leschten] dddd [um] LT";default:return"[Leschte] dddd [um] LT"}}},relativeTime:{future:c,past:d,s:"e puer Sekonnen",m:b,mm:"%d Minutten",h:b,hh:"%d Stonnen",d:b,dd:"%d Deeg",M:b,MM:"%d Méint",y:b,yy:"%d Joer"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c,d){return b?"kelios sekundės":d?"kelių sekundžių":"kelias sekundes"}function c(a,b,c,d){return b?e(c)[0]:d?e(c)[1]:e(c)[2]
}function d(a){return a%10===0||a>10&&20>a}function e(a){return h[a].split("_")}function f(a,b,f,g){var h=a+" ";return 1===a?h+c(a,b,f[0],g):b?h+(d(a)?e(f)[1]:e(f)[0]):g?h+e(f)[1]:h+(d(a)?e(f)[1]:e(f)[2])}function g(a,b){var c=-1===b.indexOf("dddd HH:mm"),d=i[a.day()];return c?d:d.substring(0,d.length-2)+"į"}var h={m:"minutė_minutės_minutę",mm:"minutės_minučių_minutes",h:"valanda_valandos_valandą",hh:"valandos_valandų_valandas",d:"diena_dienos_dieną",dd:"dienos_dienų_dienas",M:"mėnuo_mėnesio_mėnesį",MM:"mėnesiai_mėnesių_mėnesius",y:"metai_metų_metus",yy:"metai_metų_metus"},i="sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis".split("_");return a.defineLocale("lt",{months:"sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split("_"),monthsShort:"sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split("_"),weekdays:g,weekdaysShort:"Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split("_"),weekdaysMin:"S_P_A_T_K_Pn_Š".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"YYYY [m.] MMMM D [d.]",LLL:"YYYY [m.] MMMM D [d.], LT [val.]",LLLL:"YYYY [m.] MMMM D [d.], dddd, LT [val.]",l:"YYYY-MM-DD",ll:"YYYY [m.] MMMM D [d.]",lll:"YYYY [m.] MMMM D [d.], LT [val.]",llll:"YYYY [m.] MMMM D [d.], ddd, LT [val.]"},calendar:{sameDay:"[Šiandien] LT",nextDay:"[Rytoj] LT",nextWeek:"dddd LT",lastDay:"[Vakar] LT",lastWeek:"[Praėjusį] dddd LT",sameElse:"L"},relativeTime:{future:"po %s",past:"prieš %s",s:b,m:c,mm:f,h:c,hh:f,d:c,dd:f,M:c,MM:f,y:c,yy:f},ordinalParse:/\d{1,2}-oji/,ordinal:function(a){return a+"-oji"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a.split("_");return c?b%10===1&&11!==b?d[2]:d[3]:b%10===1&&11!==b?d[0]:d[1]}function c(a,c,e){return a+" "+b(d[e],a,c)}var d={mm:"minūti_minūtes_minūte_minūtes",hh:"stundu_stundas_stunda_stundas",dd:"dienu_dienas_diena_dienas",MM:"mēnesi_mēnešus_mēnesis_mēneši",yy:"gadu_gadus_gads_gadi"};return a.defineLocale("lv",{months:"janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split("_"),monthsShort:"jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split("_"),weekdays:"svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split("_"),weekdaysShort:"Sv_P_O_T_C_Pk_S".split("_"),weekdaysMin:"Sv_P_O_T_C_Pk_S".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"YYYY. [gada] D. MMMM",LLL:"YYYY. [gada] D. MMMM, LT",LLLL:"YYYY. [gada] D. MMMM, dddd, LT"},calendar:{sameDay:"[Šodien pulksten] LT",nextDay:"[Rīt pulksten] LT",nextWeek:"dddd [pulksten] LT",lastDay:"[Vakar pulksten] LT",lastWeek:"[Pagājušā] dddd [pulksten] LT",sameElse:"L"},relativeTime:{future:"%s vēlāk",past:"%s agrāk",s:"dažas sekundes",m:"minūti",mm:c,h:"stundu",hh:c,d:"dienu",dd:c,M:"mēnesi",MM:c,y:"gadu",yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("mk",{months:"јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split("_"),monthsShort:"јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split("_"),weekdays:"недела_понеделник_вторник_среда_четврток_петок_сабота".split("_"),weekdaysShort:"нед_пон_вто_сре_чет_пет_саб".split("_"),weekdaysMin:"нe_пo_вт_ср_че_пе_сa".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"D.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Денес во] LT",nextDay:"[Утре во] LT",nextWeek:"dddd [во] LT",lastDay:"[Вчера во] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[Во изминатата] dddd [во] LT";case 1:case 2:case 4:case 5:return"[Во изминатиот] dddd [во] LT"}},sameElse:"L"},relativeTime:{future:"после %s",past:"пред %s",s:"неколку секунди",m:"минута",mm:"%d минути",h:"час",hh:"%d часа",d:"ден",dd:"%d дена",M:"месец",MM:"%d месеци",y:"година",yy:"%d години"},ordinalParse:/\d{1,2}-(ев|ен|ти|ви|ри|ми)/,ordinal:function(a){var b=a%10,c=a%100;return 0===a?a+"-ев":0===c?a+"-ен":c>10&&20>c?a+"-ти":1===b?a+"-ви":2===b?a+"-ри":7===b||8===b?a+"-ми":a+"-ти"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("ml",{months:"ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split("_"),monthsShort:"ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split("_"),weekdays:"ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split("_"),weekdaysShort:"ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split("_"),weekdaysMin:"ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split("_"),longDateFormat:{LT:"A h:mm -നു",LTS:"A h:mm:ss -നു",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[ഇന്ന്] LT",nextDay:"[നാളെ] LT",nextWeek:"dddd, LT",lastDay:"[ഇന്നലെ] LT",lastWeek:"[കഴിഞ്ഞ] dddd, LT",sameElse:"L"},relativeTime:{future:"%s കഴിഞ്ഞ്",past:"%s മുൻപ്",s:"അൽപ നിമിഷങ്ങൾ",m:"ഒരു മിനിറ്റ്",mm:"%d മിനിറ്റ്",h:"ഒരു മണിക്കൂർ",hh:"%d മണിക്കൂർ",d:"ഒരു ദിവസം",dd:"%d ദിവസം",M:"ഒരു മാസം",MM:"%d മാസം",y:"ഒരു വർഷം",yy:"%d വർഷം"},meridiemParse:/രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,isPM:function(a){return/^(ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി)$/.test(a)},meridiem:function(a){return 4>a?"രാത്രി":12>a?"രാവിലെ":17>a?"ഉച്ച കഴിഞ്ഞ്":20>a?"വൈകുന്നേരം":"രാത്രി"}})}),function(a){a(vb)}(function(a){var b={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},c={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};return a.defineLocale("mr",{months:"जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split("_"),monthsShort:"जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split("_"),weekdays:"रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split("_"),weekdaysShort:"रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split("_"),weekdaysMin:"र_सो_मं_बु_गु_शु_श".split("_"),longDateFormat:{LT:"A h:mm वाजता",LTS:"A h:mm:ss वाजता",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[आज] LT",nextDay:"[उद्या] LT",nextWeek:"dddd, LT",lastDay:"[काल] LT",lastWeek:"[मागील] dddd, LT",sameElse:"L"},relativeTime:{future:"%s नंतर",past:"%s पूर्वी",s:"सेकंद",m:"एक मिनिट",mm:"%d मिनिटे",h:"एक तास",hh:"%d तास",d:"एक दिवस",dd:"%d दिवस",M:"एक महिना",MM:"%d महिने",y:"एक वर्ष",yy:"%d वर्षे"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/रात्री|सकाळी|दुपारी|सायंकाळी/,meridiemHour:function(a,b){return 12===a&&(a=0),"रात्री"===b?4>a?a:a+12:"सकाळी"===b?a:"दुपारी"===b?a>=10?a:a+12:"सायंकाळी"===b?a+12:void 0},meridiem:function(a){return 4>a?"रात्री":10>a?"सकाळी":17>a?"दुपारी":20>a?"सायंकाळी":"रात्री"},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){return a.defineLocale("ms-my",{months:"Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split("_"),weekdays:"Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split("_"),weekdaysShort:"Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split("_"),weekdaysMin:"Ah_Is_Sl_Rb_Km_Jm_Sb".split("_"),longDateFormat:{LT:"HH.mm",LTS:"LT.ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY [pukul] LT",LLLL:"dddd, D MMMM YYYY [pukul] LT"},meridiemParse:/pagi|tengahari|petang|malam/,meridiemHour:function(a,b){return 12===a&&(a=0),"pagi"===b?a:"tengahari"===b?a>=11?a:a+12:"petang"===b||"malam"===b?a+12:void 0},meridiem:function(a){return 11>a?"pagi":15>a?"tengahari":19>a?"petang":"malam"},calendar:{sameDay:"[Hari ini pukul] LT",nextDay:"[Esok pukul] LT",nextWeek:"dddd [pukul] LT",lastDay:"[Kelmarin pukul] LT",lastWeek:"dddd [lepas pukul] LT",sameElse:"L"},relativeTime:{future:"dalam %s",past:"%s yang lepas",s:"beberapa saat",m:"seminit",mm:"%d minit",h:"sejam",hh:"%d jam",d:"sehari",dd:"%d hari",M:"sebulan",MM:"%d bulan",y:"setahun",yy:"%d tahun"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={1:"၁",2:"၂",3:"၃",4:"၄",5:"၅",6:"၆",7:"၇",8:"၈",9:"၉",0:"၀"},c={"၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","၀":"0"};return a.defineLocale("my",{months:"ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ".split("_"),monthsShort:"ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ".split("_"),weekdays:"တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ".split("_"),weekdaysShort:"နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),weekdaysMin:"နွေ_လာ_င်္ဂါ_ဟူး_ကြာ_သော_နေ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ယနေ.] LT [မှာ]",nextDay:"[မနက်ဖြန်] LT [မှာ]",nextWeek:"dddd LT [မှာ]",lastDay:"[မနေ.က] LT [မှာ]",lastWeek:"[ပြီးခဲ့သော] dddd LT [မှာ]",sameElse:"L"},relativeTime:{future:"လာမည့် %s မှာ",past:"လွန်ခဲ့သော %s က",s:"စက္ကန်.အနည်းငယ်",m:"တစ်မိနစ်",mm:"%d မိနစ်",h:"တစ်နာရီ",hh:"%d နာရီ",d:"တစ်ရက်",dd:"%d ရက်",M:"တစ်လ",MM:"%d လ",y:"တစ်နှစ်",yy:"%d နှစ်"},preparse:function(a){return a.replace(/[၁၂၃၄၅၆၇၈၉၀]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("nb",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),weekdaysShort:"søn_man_tirs_ons_tors_fre_lør".split("_"),weekdaysMin:"sø_ma_ti_on_to_fr_lø".split("_"),longDateFormat:{LT:"H.mm",LTS:"LT.ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY [kl.] LT",LLLL:"dddd D. MMMM YYYY [kl.] LT"},calendar:{sameDay:"[i dag kl.] LT",nextDay:"[i morgen kl.] LT",nextWeek:"dddd [kl.] LT",lastDay:"[i går kl.] LT",lastWeek:"[forrige] dddd [kl.] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s siden",s:"noen sekunder",m:"ett minutt",mm:"%d minutter",h:"en time",hh:"%d timer",d:"en dag",dd:"%d dager",M:"en måned",MM:"%d måneder",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={1:"१",2:"२",3:"३",4:"४",5:"५",6:"६",7:"७",8:"८",9:"९",0:"०"},c={"१":"1","२":"2","३":"3","४":"4","५":"5","६":"6","७":"7","८":"8","९":"9","०":"0"};return a.defineLocale("ne",{months:"जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split("_"),monthsShort:"जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split("_"),weekdays:"आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split("_"),weekdaysShort:"आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split("_"),weekdaysMin:"आइ._सो._मङ्_बु._बि._शु._श.".split("_"),longDateFormat:{LT:"Aको h:mm बजे",LTS:"Aको h:mm:ss बजे",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},preparse:function(a){return a.replace(/[१२३४५६७८९०]/g,function(a){return c[a]})},postformat:function(a){return a.replace(/\d/g,function(a){return b[a]})},meridiemParse:/राती|बिहान|दिउँसो|बेलुका|साँझ|राती/,meridiemHour:function(a,b){return 12===a&&(a=0),"राती"===b?3>a?a:a+12:"बिहान"===b?a:"दिउँसो"===b?a>=10?a:a+12:"बेलुका"===b||"साँझ"===b?a+12:void 0},meridiem:function(a){return 3>a?"राती":10>a?"बिहान":15>a?"दिउँसो":18>a?"बेलुका":20>a?"साँझ":"राती"},calendar:{sameDay:"[आज] LT",nextDay:"[भोली] LT",nextWeek:"[आउँदो] dddd[,] LT",lastDay:"[हिजो] LT",lastWeek:"[गएको] dddd[,] LT",sameElse:"L"},relativeTime:{future:"%sमा",past:"%s अगाडी",s:"केही समय",m:"एक मिनेट",mm:"%d मिनेट",h:"एक घण्टा",hh:"%d घण्टा",d:"एक दिन",dd:"%d दिन",M:"एक महिना",MM:"%d महिना",y:"एक बर्ष",yy:"%d बर्ष"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b="jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split("_"),c="jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split("_");return a.defineLocale("nl",{months:"januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),monthsShort:function(a,d){return/-MMM-/.test(d)?c[a.month()]:b[a.month()]},weekdays:"zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),weekdaysShort:"zo._ma._di._wo._do._vr._za.".split("_"),weekdaysMin:"Zo_Ma_Di_Wo_Do_Vr_Za".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD-MM-YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[vandaag om] LT",nextDay:"[morgen om] LT",nextWeek:"dddd [om] LT",lastDay:"[gisteren om] LT",lastWeek:"[afgelopen] dddd [om] LT",sameElse:"L"},relativeTime:{future:"over %s",past:"%s geleden",s:"een paar seconden",m:"één minuut",mm:"%d minuten",h:"één uur",hh:"%d uur",d:"één dag",dd:"%d dagen",M:"één maand",MM:"%d maanden",y:"één jaar",yy:"%d jaar"},ordinalParse:/\d{1,2}(ste|de)/,ordinal:function(a){return a+(1===a||8===a||a>=20?"ste":"de")},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("nn",{months:"januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),monthsShort:"jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),weekdays:"sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split("_"),weekdaysShort:"sun_mån_tys_ons_tor_fre_lau".split("_"),weekdaysMin:"su_må_ty_on_to_fr_lø".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[I dag klokka] LT",nextDay:"[I morgon klokka] LT",nextWeek:"dddd [klokka] LT",lastDay:"[I går klokka] LT",lastWeek:"[Føregåande] dddd [klokka] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"for %s sidan",s:"nokre sekund",m:"eit minutt",mm:"%d minutt",h:"ein time",hh:"%d timar",d:"ein dag",dd:"%d dagar",M:"ein månad",MM:"%d månader",y:"eit år",yy:"%d år"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a){return 5>a%10&&a%10>1&&~~(a/10)%10!==1}function c(a,c,d){var e=a+" ";switch(d){case"m":return c?"minuta":"minutę";case"mm":return e+(b(a)?"minuty":"minut");case"h":return c?"godzina":"godzinę";case"hh":return e+(b(a)?"godziny":"godzin");case"MM":return e+(b(a)?"miesiące":"miesięcy");case"yy":return e+(b(a)?"lata":"lat")}}var d="styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),e="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split("_");return a.defineLocale("pl",{months:function(a,b){return/D MMMM/.test(b)?e[a.month()]:d[a.month()]},monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),weekdays:"niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),weekdaysShort:"nie_pon_wt_śr_czw_pt_sb".split("_"),weekdaysMin:"N_Pn_Wt_Śr_Cz_Pt_So".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Dziś o] LT",nextDay:"[Jutro o] LT",nextWeek:"[W] dddd [o] LT",lastDay:"[Wczoraj o] LT",lastWeek:function(){switch(this.day()){case 0:return"[W zeszłą niedzielę o] LT";case 3:return"[W zeszłą środę o] LT";case 6:return"[W zeszłą sobotę o] LT";default:return"[W zeszły] dddd [o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:c,mm:c,h:c,hh:c,d:"1 dzień",dd:"%d dni",M:"miesiąc",MM:c,y:"rok",yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("pt-br",{months:"janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),monthsShort:"jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),weekdays:"domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),weekdaysShort:"dom_seg_ter_qua_qui_sex_sáb".split("_"),weekdaysMin:"dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY [às] LT",LLLL:"dddd, D [de] MMMM [de] YYYY [às] LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"%s atrás",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº"})}),function(a){a(vb)}(function(a){return a.defineLocale("pt",{months:"janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),monthsShort:"jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),weekdays:"domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),weekdaysShort:"dom_seg_ter_qua_qui_sex_sáb".split("_"),weekdaysMin:"dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D [de] MMMM [de] YYYY",LLL:"D [de] MMMM [de] YYYY LT",LLLL:"dddd, D [de] MMMM [de] YYYY LT"},calendar:{sameDay:"[Hoje às] LT",nextDay:"[Amanhã às] LT",nextWeek:"dddd [às] LT",lastDay:"[Ontem às] LT",lastWeek:function(){return 0===this.day()||6===this.day()?"[Último] dddd [às] LT":"[Última] dddd [às] LT"},sameElse:"L"},relativeTime:{future:"em %s",past:"há %s",s:"segundos",m:"um minuto",mm:"%d minutos",h:"uma hora",hh:"%d horas",d:"um dia",dd:"%d dias",M:"um mês",MM:"%d meses",y:"um ano",yy:"%d anos"},ordinalParse:/\d{1,2}º/,ordinal:"%dº",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d={mm:"minute",hh:"ore",dd:"zile",MM:"luni",yy:"ani"},e=" ";return(a%100>=20||a>=100&&a%100===0)&&(e=" de "),a+e+d[c]}return a.defineLocale("ro",{months:"ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split("_"),monthsShort:"ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.".split("_"),weekdays:"duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split("_"),weekdaysShort:"Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split("_"),weekdaysMin:"Du_Lu_Ma_Mi_Jo_Vi_Sâ".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY H:mm",LLLL:"dddd, D MMMM YYYY H:mm"},calendar:{sameDay:"[azi la] LT",nextDay:"[mâine la] LT",nextWeek:"dddd [la] LT",lastDay:"[ieri la] LT",lastWeek:"[fosta] dddd [la] LT",sameElse:"L"},relativeTime:{future:"peste %s",past:"%s în urmă",s:"câteva secunde",m:"un minut",mm:b,h:"o oră",hh:b,d:"o zi",dd:b,M:"o lună",MM:b,y:"un an",yy:b},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function c(a,c,d){var e={mm:c?"минута_минуты_минут":"минуту_минуты_минут",hh:"час_часа_часов",dd:"день_дня_дней",MM:"месяц_месяца_месяцев",yy:"год_года_лет"};return"m"===d?c?"минута":"минуту":a+" "+b(e[d],+a)}function d(a,b){var c={nominative:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),accusative:"января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function e(a,b){var c={nominative:"янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split("_"),accusative:"янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split("_")},d=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function f(a,b){var c={nominative:"воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),accusative:"воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split("_")},d=/\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/.test(b)?"accusative":"nominative";return c[d][a.day()]}return a.defineLocale("ru",{months:d,monthsShort:e,weekdays:f,weekdaysShort:"вс_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"вс_пн_вт_ср_чт_пт_сб".split("_"),monthsParse:[/^янв/i,/^фев/i,/^мар/i,/^апр/i,/^ма[й|я]/i,/^июн/i,/^июл/i,/^авг/i,/^сен/i,/^окт/i,/^ноя/i,/^дек/i],longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY г.",LLL:"D MMMM YYYY г., LT",LLLL:"dddd, D MMMM YYYY г., LT"},calendar:{sameDay:"[Сегодня в] LT",nextDay:"[Завтра в] LT",lastDay:"[Вчера в] LT",nextWeek:function(){return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT"},lastWeek:function(a){if(a.week()===this.week())return 2===this.day()?"[Во] dddd [в] LT":"[В] dddd [в] LT";switch(this.day()){case 0:return"[В прошлое] dddd [в] LT";case 1:case 2:case 4:return"[В прошлый] dddd [в] LT";case 3:case 5:case 6:return"[В прошлую] dddd [в] LT"}},sameElse:"L"},relativeTime:{future:"через %s",past:"%s назад",s:"несколько секунд",m:c,mm:c,h:"час",hh:c,d:"день",dd:c,M:"месяц",MM:c,y:"год",yy:c},meridiemParse:/ночи|утра|дня|вечера/i,isPM:function(a){return/^(дня|вечера)$/.test(a)},meridiem:function(a){return 4>a?"ночи":12>a?"утра":17>a?"дня":"вечера"},ordinalParse:/\d{1,2}-(й|го|я)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":return a+"-й";case"D":return a+"-го";case"w":case"W":return a+"-я";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){function b(a){return a>1&&5>a}function c(a,c,d,e){var f=a+" ";switch(d){case"s":return c||e?"pár sekúnd":"pár sekundami";case"m":return c?"minúta":e?"minútu":"minútou";case"mm":return c||e?f+(b(a)?"minúty":"minút"):f+"minútami";break;case"h":return c?"hodina":e?"hodinu":"hodinou";case"hh":return c||e?f+(b(a)?"hodiny":"hodín"):f+"hodinami";break;case"d":return c||e?"deň":"dňom";case"dd":return c||e?f+(b(a)?"dni":"dní"):f+"dňami";break;case"M":return c||e?"mesiac":"mesiacom";case"MM":return c||e?f+(b(a)?"mesiace":"mesiacov"):f+"mesiacmi";break;case"y":return c||e?"rok":"rokom";case"yy":return c||e?f+(b(a)?"roky":"rokov"):f+"rokmi"}}var d="január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split("_"),e="jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split("_");return a.defineLocale("sk",{months:d,monthsShort:e,monthsParse:function(a,b){var c,d=[];for(c=0;12>c;c++)d[c]=new RegExp("^"+a[c]+"$|^"+b[c]+"$","i");return d}(d,e),weekdays:"nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split("_"),weekdaysShort:"ne_po_ut_st_št_pi_so".split("_"),weekdaysMin:"ne_po_ut_st_št_pi_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd D. MMMM YYYY LT"},calendar:{sameDay:"[dnes o] LT",nextDay:"[zajtra o] LT",nextWeek:function(){switch(this.day()){case 0:return"[v nedeľu o] LT";case 1:case 2:return"[v] dddd [o] LT";case 3:return"[v stredu o] LT";case 4:return"[vo štvrtok o] LT";case 5:return"[v piatok o] LT";case 6:return"[v sobotu o] LT"}},lastDay:"[včera o] LT",lastWeek:function(){switch(this.day()){case 0:return"[minulú nedeľu o] LT";case 1:case 2:return"[minulý] dddd [o] LT";case 3:return"[minulú stredu o] LT";case 4:case 5:return"[minulý] dddd [o] LT";case 6:return"[minulú sobotu o] LT"}},sameElse:"L"},relativeTime:{future:"za %s",past:"pred %s",s:c,m:c,mm:c,h:c,hh:c,d:c,dd:c,M:c,MM:c,y:c,yy:c},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){function b(a,b,c){var d=a+" ";switch(c){case"m":return b?"ena minuta":"eno minuto";case"mm":return d+=1===a?"minuta":2===a?"minuti":3===a||4===a?"minute":"minut";case"h":return b?"ena ura":"eno uro";case"hh":return d+=1===a?"ura":2===a?"uri":3===a||4===a?"ure":"ur";case"dd":return d+=1===a?"dan":"dni";case"MM":return d+=1===a?"mesec":2===a?"meseca":3===a||4===a?"mesece":"mesecev";case"yy":return d+=1===a?"leto":2===a?"leti":3===a||4===a?"leta":"let"}}return a.defineLocale("sl",{months:"januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split("_"),monthsShort:"jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split("_"),weekdays:"nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split("_"),weekdaysShort:"ned._pon._tor._sre._čet._pet._sob.".split("_"),weekdaysMin:"ne_po_to_sr_če_pe_so".split("_"),longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danes ob] LT",nextDay:"[jutri ob] LT",nextWeek:function(){switch(this.day()){case 0:return"[v] [nedeljo] [ob] LT";case 3:return"[v] [sredo] [ob] LT";case 6:return"[v] [soboto] [ob] LT";case 1:case 2:case 4:case 5:return"[v] dddd [ob] LT"}},lastDay:"[včeraj ob] LT",lastWeek:function(){switch(this.day()){case 0:case 3:case 6:return"[prejšnja] dddd [ob] LT";case 1:case 2:case 4:case 5:return"[prejšnji] dddd [ob] LT"}},sameElse:"L"},relativeTime:{future:"čez %s",past:"%s nazaj",s:"nekaj sekund",m:b,mm:b,h:b,hh:b,d:"en dan",dd:b,M:"en mesec",MM:b,y:"eno leto",yy:b},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("sq",{months:"Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split("_"),monthsShort:"Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split("_"),weekdays:"E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë".split("_"),weekdaysShort:"Die_Hën_Mar_Mër_Enj_Pre_Sht".split("_"),weekdaysMin:"D_H_Ma_Më_E_P_Sh".split("_"),meridiemParse:/PD|MD/,isPM:function(a){return"M"===a.charAt(0)},meridiem:function(a){return 12>a?"PD":"MD"},longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[Sot në] LT",nextDay:"[Nesër në] LT",nextWeek:"dddd [në] LT",lastDay:"[Dje në] LT",lastWeek:"dddd [e kaluar në] LT",sameElse:"L"},relativeTime:{future:"në %s",past:"%s më parë",s:"disa sekonda",m:"një minutë",mm:"%d minuta",h:"një orë",hh:"%d orë",d:"një ditë",dd:"%d ditë",M:"një muaj",MM:"%d muaj",y:"një vit",yy:"%d vite"},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={words:{m:["један минут","једне минуте"],mm:["минут","минуте","минута"],h:["један сат","једног сата"],hh:["сат","сата","сати"],dd:["дан","дана","дана"],MM:["месец","месеца","месеци"],yy:["година","године","година"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,c,d){var e=b.words[d];return 1===d.length?c?e[0]:e[1]:a+" "+b.correctGrammaticalCase(a,e)}};return a.defineLocale("sr-cyrl",{months:["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар"],monthsShort:["јан.","феб.","мар.","апр.","мај","јун","јул","авг.","сеп.","окт.","нов.","дец."],weekdays:["недеља","понедељак","уторак","среда","четвртак","петак","субота"],weekdaysShort:["нед.","пон.","уто.","сре.","чет.","пет.","суб."],weekdaysMin:["не","по","ут","ср","че","пе","су"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[данас у] LT",nextDay:"[сутра у] LT",nextWeek:function(){switch(this.day()){case 0:return"[у] [недељу] [у] LT";case 3:return"[у] [среду] [у] LT";case 6:return"[у] [суботу] [у] LT";case 1:case 2:case 4:case 5:return"[у] dddd [у] LT"}},lastDay:"[јуче у] LT",lastWeek:function(){var a=["[прошле] [недеље] [у] LT","[прошлог] [понедељка] [у] LT","[прошлог] [уторка] [у] LT","[прошле] [среде] [у] LT","[прошлог] [четвртка] [у] LT","[прошлог] [петка] [у] LT","[прошле] [суботе] [у] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"за %s",past:"пре %s",s:"неколико секунди",m:b.translate,mm:b.translate,h:b.translate,hh:b.translate,d:"дан",dd:b.translate,M:"месец",MM:b.translate,y:"годину",yy:b.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){var b={words:{m:["jedan minut","jedne minute"],mm:["minut","minute","minuta"],h:["jedan sat","jednog sata"],hh:["sat","sata","sati"],dd:["dan","dana","dana"],MM:["mesec","meseca","meseci"],yy:["godina","godine","godina"]},correctGrammaticalCase:function(a,b){return 1===a?b[0]:a>=2&&4>=a?b[1]:b[2]},translate:function(a,c,d){var e=b.words[d];return 1===d.length?c?e[0]:e[1]:a+" "+b.correctGrammaticalCase(a,e)}};return a.defineLocale("sr",{months:["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"],monthsShort:["jan.","feb.","mar.","apr.","maj","jun","jul","avg.","sep.","okt.","nov.","dec."],weekdays:["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],weekdaysShort:["ned.","pon.","uto.","sre.","čet.","pet.","sub."],weekdaysMin:["ne","po","ut","sr","če","pe","su"],longDateFormat:{LT:"H:mm",LTS:"LT:ss",L:"DD. MM. YYYY",LL:"D. MMMM YYYY",LLL:"D. MMMM YYYY LT",LLLL:"dddd, D. MMMM YYYY LT"},calendar:{sameDay:"[danas u] LT",nextDay:"[sutra u] LT",nextWeek:function(){switch(this.day()){case 0:return"[u] [nedelju] [u] LT";case 3:return"[u] [sredu] [u] LT";case 6:return"[u] [subotu] [u] LT";case 1:case 2:case 4:case 5:return"[u] dddd [u] LT"}},lastDay:"[juče u] LT",lastWeek:function(){var a=["[prošle] [nedelje] [u] LT","[prošlog] [ponedeljka] [u] LT","[prošlog] [utorka] [u] LT","[prošle] [srede] [u] LT","[prošlog] [četvrtka] [u] LT","[prošlog] [petka] [u] LT","[prošle] [subote] [u] LT"];return a[this.day()]},sameElse:"L"},relativeTime:{future:"za %s",past:"pre %s",s:"nekoliko sekundi",m:b.translate,mm:b.translate,h:b.translate,hh:b.translate,d:"dan",dd:b.translate,M:"mesec",MM:b.translate,y:"godinu",yy:b.translate},ordinalParse:/\d{1,2}\./,ordinal:"%d.",week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("sv",{months:"januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),monthsShort:"jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),weekdays:"söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),weekdaysShort:"sön_mån_tis_ons_tor_fre_lör".split("_"),weekdaysMin:"sö_må_ti_on_to_fr_lö".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"YYYY-MM-DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[Idag] LT",nextDay:"[Imorgon] LT",lastDay:"[Igår] LT",nextWeek:"dddd LT",lastWeek:"[Förra] dddd[en] LT",sameElse:"L"},relativeTime:{future:"om %s",past:"för %s sedan",s:"några sekunder",m:"en minut",mm:"%d minuter",h:"en timme",hh:"%d timmar",d:"en dag",dd:"%d dagar",M:"en månad",MM:"%d månader",y:"ett år",yy:"%d år"},ordinalParse:/\d{1,2}(e|a)/,ordinal:function(a){var b=a%10,c=1===~~(a%100/10)?"e":1===b?"a":2===b?"a":"e";return a+c},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("ta",{months:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),monthsShort:"ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split("_"),weekdays:"ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split("_"),weekdaysShort:"ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split("_"),weekdaysMin:"ஞா_தி_செ_பு_வி_வெ_ச".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY, LT",LLLL:"dddd, D MMMM YYYY, LT"},calendar:{sameDay:"[இன்று] LT",nextDay:"[நாளை] LT",nextWeek:"dddd, LT",lastDay:"[நேற்று] LT",lastWeek:"[கடந்த வாரம்] dddd, LT",sameElse:"L"},relativeTime:{future:"%s இல்",past:"%s முன்",s:"ஒரு சில விநாடிகள்",m:"ஒரு நிமிடம்",mm:"%d நிமிடங்கள்",h:"ஒரு மணி நேரம்",hh:"%d மணி நேரம்",d:"ஒரு நாள்",dd:"%d நாட்கள்",M:"ஒரு மாதம்",MM:"%d மாதங்கள்",y:"ஒரு வருடம்",yy:"%d ஆண்டுகள்"},ordinalParse:/\d{1,2}வது/,ordinal:function(a){return a+"வது"},meridiemParse:/யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,meridiem:function(a){return 2>a?" யாமம்":6>a?" வைகறை":10>a?" காலை":14>a?" நண்பகல்":18>a?" எற்பாடு":22>a?" மாலை":" யாமம்"},meridiemHour:function(a,b){return 12===a&&(a=0),"யாமம்"===b?2>a?a:a+12:"வைகறை"===b||"காலை"===b?a:"நண்பகல்"===b&&a>=10?a:a+12},week:{dow:0,doy:6}})}),function(a){a(vb)}(function(a){return a.defineLocale("th",{months:"มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split("_"),monthsShort:"มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split("_"),weekdays:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split("_"),weekdaysShort:"อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split("_"),weekdaysMin:"อา._จ._อ._พ._พฤ._ศ._ส.".split("_"),longDateFormat:{LT:"H นาฬิกา m นาที",LTS:"LT s วินาที",L:"YYYY/MM/DD",LL:"D MMMM YYYY",LLL:"D MMMM YYYY เวลา LT",LLLL:"วันddddที่ D MMMM YYYY เวลา LT"},meridiemParse:/ก่อนเที่ยง|หลังเที่ยง/,isPM:function(a){return"หลังเที่ยง"===a
},meridiem:function(a){return 12>a?"ก่อนเที่ยง":"หลังเที่ยง"},calendar:{sameDay:"[วันนี้ เวลา] LT",nextDay:"[พรุ่งนี้ เวลา] LT",nextWeek:"dddd[หน้า เวลา] LT",lastDay:"[เมื่อวานนี้ เวลา] LT",lastWeek:"[วัน]dddd[ที่แล้ว เวลา] LT",sameElse:"L"},relativeTime:{future:"อีก %s",past:"%sที่แล้ว",s:"ไม่กี่วินาที",m:"1 นาที",mm:"%d นาที",h:"1 ชั่วโมง",hh:"%d ชั่วโมง",d:"1 วัน",dd:"%d วัน",M:"1 เดือน",MM:"%d เดือน",y:"1 ปี",yy:"%d ปี"}})}),function(a){a(vb)}(function(a){return a.defineLocale("tl-ph",{months:"Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split("_"),monthsShort:"Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split("_"),weekdays:"Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split("_"),weekdaysShort:"Lin_Lun_Mar_Miy_Huw_Biy_Sab".split("_"),weekdaysMin:"Li_Lu_Ma_Mi_Hu_Bi_Sab".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"MM/D/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY LT",LLLL:"dddd, MMMM DD, YYYY LT"},calendar:{sameDay:"[Ngayon sa] LT",nextDay:"[Bukas sa] LT",nextWeek:"dddd [sa] LT",lastDay:"[Kahapon sa] LT",lastWeek:"dddd [huling linggo] LT",sameElse:"L"},relativeTime:{future:"sa loob ng %s",past:"%s ang nakalipas",s:"ilang segundo",m:"isang minuto",mm:"%d minuto",h:"isang oras",hh:"%d oras",d:"isang araw",dd:"%d araw",M:"isang buwan",MM:"%d buwan",y:"isang taon",yy:"%d taon"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){var b={1:"'inci",5:"'inci",8:"'inci",70:"'inci",80:"'inci",2:"'nci",7:"'nci",20:"'nci",50:"'nci",3:"'üncü",4:"'üncü",100:"'üncü",6:"'ncı",9:"'uncu",10:"'uncu",30:"'uncu",60:"'ıncı",90:"'ıncı"};return a.defineLocale("tr",{months:"Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),monthsShort:"Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),weekdays:"Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),weekdaysShort:"Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),weekdaysMin:"Pz_Pt_Sa_Ça_Pe_Cu_Ct".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd, D MMMM YYYY LT"},calendar:{sameDay:"[bugün saat] LT",nextDay:"[yarın saat] LT",nextWeek:"[haftaya] dddd [saat] LT",lastDay:"[dün] LT",lastWeek:"[geçen hafta] dddd [saat] LT",sameElse:"L"},relativeTime:{future:"%s sonra",past:"%s önce",s:"birkaç saniye",m:"bir dakika",mm:"%d dakika",h:"bir saat",hh:"%d saat",d:"bir gün",dd:"%d gün",M:"bir ay",MM:"%d ay",y:"bir yıl",yy:"%d yıl"},ordinalParse:/\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,ordinal:function(a){if(0===a)return a+"'ıncı";var c=a%10,d=a%100-c,e=a>=100?100:null;return a+(b[c]||b[d]||b[e])},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("tzm-latn",{months:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),monthsShort:"innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split("_"),weekdays:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysShort:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),weekdaysMin:"asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[asdkh g] LT",nextDay:"[aska g] LT",nextWeek:"dddd [g] LT",lastDay:"[assant g] LT",lastWeek:"dddd [g] LT",sameElse:"L"},relativeTime:{future:"dadkh s yan %s",past:"yan %s",s:"imik",m:"minuḍ",mm:"%d minuḍ",h:"saɛa",hh:"%d tassaɛin",d:"ass",dd:"%d ossan",M:"ayowr",MM:"%d iyyirn",y:"asgas",yy:"%d isgasn"},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){return a.defineLocale("tzm",{months:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),monthsShort:"ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split("_"),weekdays:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysShort:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),weekdaysMin:"ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"dddd D MMMM YYYY LT"},calendar:{sameDay:"[ⴰⵙⴷⵅ ⴴ] LT",nextDay:"[ⴰⵙⴽⴰ ⴴ] LT",nextWeek:"dddd [ⴴ] LT",lastDay:"[ⴰⵚⴰⵏⵜ ⴴ] LT",lastWeek:"dddd [ⴴ] LT",sameElse:"L"},relativeTime:{future:"ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s",past:"ⵢⴰⵏ %s",s:"ⵉⵎⵉⴽ",m:"ⵎⵉⵏⵓⴺ",mm:"%d ⵎⵉⵏⵓⴺ",h:"ⵙⴰⵄⴰ",hh:"%d ⵜⴰⵙⵙⴰⵄⵉⵏ",d:"ⴰⵙⵙ",dd:"%d oⵙⵙⴰⵏ",M:"ⴰⵢoⵓⵔ",MM:"%d ⵉⵢⵢⵉⵔⵏ",y:"ⴰⵙⴳⴰⵙ",yy:"%d ⵉⵙⴳⴰⵙⵏ"},week:{dow:6,doy:12}})}),function(a){a(vb)}(function(a){function b(a,b){var c=a.split("_");return b%10===1&&b%100!==11?c[0]:b%10>=2&&4>=b%10&&(10>b%100||b%100>=20)?c[1]:c[2]}function c(a,c,d){var e={mm:"хвилина_хвилини_хвилин",hh:"година_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"};return"m"===d?c?"хвилина":"хвилину":"h"===d?c?"година":"годину":a+" "+b(e[d],+a)}function d(a,b){var c={nominative:"січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),accusative:"січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_")},d=/D[oD]? *MMMM?/.test(b)?"accusative":"nominative";return c[d][a.month()]}function e(a,b){var c={nominative:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),accusative:"неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),genitive:"неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")},d=/(\[[ВвУу]\]) ?dddd/.test(b)?"accusative":/\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)?"genitive":"nominative";return c[d][a.day()]}function f(a){return function(){return a+"о"+(11===this.hours()?"б":"")+"] LT"}}return a.defineLocale("uk",{months:d,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekdays:e,weekdaysShort:"нд_пн_вт_ср_чт_пт_сб".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., LT",LLLL:"dddd, D MMMM YYYY р., LT"},calendar:{sameDay:f("[Сьогодні "),nextDay:f("[Завтра "),lastDay:f("[Вчора "),nextWeek:f("[У] dddd ["),lastWeek:function(){switch(this.day()){case 0:case 3:case 5:case 6:return f("[Минулої] dddd [").call(this);case 1:case 2:case 4:return f("[Минулого] dddd [").call(this)}},sameElse:"L"},relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:c,mm:c,h:"годину",hh:c,d:"день",dd:c,M:"місяць",MM:c,y:"рік",yy:c},meridiemParse:/ночі|ранку|дня|вечора/,isPM:function(a){return/^(дня|вечора)$/.test(a)},meridiem:function(a){return 4>a?"ночі":12>a?"ранку":17>a?"дня":"вечора"},ordinalParse:/\d{1,2}-(й|го)/,ordinal:function(a,b){switch(b){case"M":case"d":case"DDD":case"w":case"W":return a+"-й";case"D":return a+"-го";default:return a}},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("uz",{months:"январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),monthsShort:"янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),weekdays:"Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split("_"),weekdaysShort:"Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split("_"),weekdaysMin:"Як_Ду_Се_Чо_Па_Жу_Ша".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY LT",LLLL:"D MMMM YYYY, dddd LT"},calendar:{sameDay:"[Бугун соат] LT [да]",nextDay:"[Эртага] LT [да]",nextWeek:"dddd [куни соат] LT [да]",lastDay:"[Кеча соат] LT [да]",lastWeek:"[Утган] dddd [куни соат] LT [да]",sameElse:"L"},relativeTime:{future:"Якин %s ичида",past:"Бир неча %s олдин",s:"фурсат",m:"бир дакика",mm:"%d дакика",h:"бир соат",hh:"%d соат",d:"бир кун",dd:"%d кун",M:"бир ой",MM:"%d ой",y:"бир йил",yy:"%d йил"},week:{dow:1,doy:7}})}),function(a){a(vb)}(function(a){return a.defineLocale("vi",{months:"tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split("_"),monthsShort:"Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split("_"),weekdays:"chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split("_"),weekdaysShort:"CN_T2_T3_T4_T5_T6_T7".split("_"),weekdaysMin:"CN_T2_T3_T4_T5_T6_T7".split("_"),longDateFormat:{LT:"HH:mm",LTS:"LT:ss",L:"DD/MM/YYYY",LL:"D MMMM [năm] YYYY",LLL:"D MMMM [năm] YYYY LT",LLLL:"dddd, D MMMM [năm] YYYY LT",l:"DD/M/YYYY",ll:"D MMM YYYY",lll:"D MMM YYYY LT",llll:"ddd, D MMM YYYY LT"},calendar:{sameDay:"[Hôm nay lúc] LT",nextDay:"[Ngày mai lúc] LT",nextWeek:"dddd [tuần tới lúc] LT",lastDay:"[Hôm qua lúc] LT",lastWeek:"dddd [tuần rồi lúc] LT",sameElse:"L"},relativeTime:{future:"%s tới",past:"%s trước",s:"vài giây",m:"một phút",mm:"%d phút",h:"một giờ",hh:"%d giờ",d:"một ngày",dd:"%d ngày",M:"một tháng",MM:"%d tháng",y:"một năm",yy:"%d năm"},ordinalParse:/\d{1,2}/,ordinal:function(a){return a},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("zh-cn",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"周日_周一_周二_周三_周四_周五_周六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah点mm",LTS:"Ah点m分s秒",L:"YYYY-MM-DD",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY-MM-DD",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/凌晨|早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"凌晨"===b||"早上"===b||"上午"===b?a:"下午"===b||"晚上"===b?a+12:a>=11?a:a+12},meridiem:function(a,b){var c=100*a+b;return 600>c?"凌晨":900>c?"早上":1130>c?"上午":1230>c?"中午":1800>c?"下午":"晚上"},calendar:{sameDay:function(){return 0===this.minutes()?"[今天]Ah[点整]":"[今天]LT"},nextDay:function(){return 0===this.minutes()?"[明天]Ah[点整]":"[明天]LT"},lastDay:function(){return 0===this.minutes()?"[昨天]Ah[点整]":"[昨天]LT"},nextWeek:function(){var b,c;return b=a().startOf("week"),c=this.unix()-b.unix()>=604800?"[下]":"[本]",0===this.minutes()?c+"dddAh点整":c+"dddAh点mm"},lastWeek:function(){var b,c;return b=a().startOf("week"),c=this.unix()<b.unix()?"[上]":"[本]",0===this.minutes()?c+"dddAh点整":c+"dddAh点mm"},sameElse:"LL"},ordinalParse:/\d{1,2}(日|月|周)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"周";default:return a}},relativeTime:{future:"%s内",past:"%s前",s:"几秒",m:"1分钟",mm:"%d分钟",h:"1小时",hh:"%d小时",d:"1天",dd:"%d天",M:"1个月",MM:"%d个月",y:"1年",yy:"%d年"},week:{dow:1,doy:4}})}),function(a){a(vb)}(function(a){return a.defineLocale("zh-tw",{months:"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),monthsShort:"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),weekdays:"星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),weekdaysShort:"週日_週一_週二_週三_週四_週五_週六".split("_"),weekdaysMin:"日_一_二_三_四_五_六".split("_"),longDateFormat:{LT:"Ah點mm",LTS:"Ah點m分s秒",L:"YYYY年MMMD日",LL:"YYYY年MMMD日",LLL:"YYYY年MMMD日LT",LLLL:"YYYY年MMMD日ddddLT",l:"YYYY年MMMD日",ll:"YYYY年MMMD日",lll:"YYYY年MMMD日LT",llll:"YYYY年MMMD日ddddLT"},meridiemParse:/早上|上午|中午|下午|晚上/,meridiemHour:function(a,b){return 12===a&&(a=0),"早上"===b||"上午"===b?a:"中午"===b?a>=11?a:a+12:"下午"===b||"晚上"===b?a+12:void 0},meridiem:function(a,b){var c=100*a+b;return 900>c?"早上":1130>c?"上午":1230>c?"中午":1800>c?"下午":"晚上"},calendar:{sameDay:"[今天]LT",nextDay:"[明天]LT",nextWeek:"[下]ddddLT",lastDay:"[昨天]LT",lastWeek:"[上]ddddLT",sameElse:"L"},ordinalParse:/\d{1,2}(日|月|週)/,ordinal:function(a,b){switch(b){case"d":case"D":case"DDD":return a+"日";case"M":return a+"月";case"w":case"W":return a+"週";default:return a}},relativeTime:{future:"%s內",past:"%s前",s:"幾秒",m:"一分鐘",mm:"%d分鐘",h:"一小時",hh:"%d小時",d:"一天",dd:"%d天",M:"一個月",MM:"%d個月",y:"一年",yy:"%d年"}})}),vb.locale("en"),Lb?module.exports=vb:"function"==typeof define&&define.amd?(define(function(a,b,c){return c.config&&c.config()&&c.config().noGlobal===!0&&(zb.moment=wb),vb}),ub(!0)):ub()}).call(this);
/* jshint ignore:end */
angular.module("app.kit").run(["$templateCache", function($templateCache) {$templateCache.put("core/login/login.tpl.html","<md-content class=\"md-padding anim-zoom-in login\" layout=\"row\" layout-sm=\"column\" ng-if=\"!app.isAuthed()\" flex=\"\"><div layout=\"column\" class=\"login\" layout-padding=\"\" flex=\"\"><login-form config=\"vm.config\" user=\"app.user\"></login-form></div></md-content>");
$templateCache.put("core/account/account.tpl.html","<md-content class=\"main-wrapper account anim-zoom-in md-padding\" layout=\"column\" flex=\"\"><div class=\"account-wrapper connections\"><h4><i class=\"fa fa-rss\"></i> Suas conexões <span ng-if=\"vm.account.role.length>1\">({{vm.account.role.length}})</span></h4><opt-out class=\"animate-repeat-opt-out\" ng-if=\"vm.account.role.length\" ng-repeat=\"item in vm.account.role\" item-id=\"item.company._id\" item-title=\"item.company.name\" item-title-tooltip=\"\'Ir para \'+item.company.name\" item-location=\"\'/\'+item.company.ref+\'/\'\" item-info=\"vm.optOutInfo(item)\" put-location=\"vm.optOutPutLocation\" put-params=\"vm.optOutPutParams\" alert-title=\"\'Desfazer conexão\'\" alert-info=\"\'Você será desconectado da empresa \'+item.company.name+\'.\'\" alert-ok=\"\'Ok, entendo.\'\" alert-cancel=\"\'Não, obrigado.\'\"></opt-out><div class=\"empty\" ng-if=\"!vm.account.role.length\"><small>Você não possui conexões.</small></div></div><div class=\"account-wrapper\"><h4><i class=\"fa fa-at\"></i> Dados gerais</h4><form novalidate=\"\" name=\"vm.form.account\" class=\"md-whiteframe-z1\"><div class=\"head-bg\" md-theme=\"default\" layout-padding=\"\" layout=\"row\" layout-sm=\"column\"><md-input-container><label>Seu nome</label> <input name=\"firstName\" ng-model=\"vm.account.profile.firstName\" required=\"\"></md-input-container><md-input-container><label>Sobrenome</label> <input name=\"lastName\" ng-model=\"vm.account.profile.lastName\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Melhor email</label> <input name=\"email\" ng-model=\"vm.account.email\" type=\"email\" required=\"\"></md-input-container></div><md-button class=\"md-fab md-primary md-hue-2 save\" aria-label=\"Salvar\" ng-click=\"vm.saveAccount($event)\" ng-disabled=\"vm.account.busy||vm.form.account.$invalid||!vm.form.account.$dirty||vm.pristineAccount()\"><md-tooltip>Salvar</md-tooltip><i class=\"fa fa-thumbs-up\"></i></md-button></form></div><div class=\"account-wrapper\"><h4><i class=\"fa fa-unlock-alt\"></i> Alterar senha</h4><form name=\"vm.form.password\" class=\"md-whiteframe-z1\"><div class=\"head-bg\" md-theme=\"default\" layout-padding=\"\" layout=\"row\" layout-sm=\"column\"><md-input-container><label>Nova senha</label> <input type=\"password\" ng-model=\"vm.account._password\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Repetir nova senha</label> <input type=\"password\" ng-model=\"vm.account.__password\" required=\"\"></md-input-container></div><md-button class=\"md-fab md-primary md-hue-2 save\" aria-label=\"Salvar\" ng-click=\"vm.savePassword()\" ng-disabled=\"vm.account.busy||vm.form.password.$invalid||!vm.form.password.$dirty||(vm.account._password!=vm.account.__password)\"><md-tooltip>Salvar</md-tooltip><i class=\"fa fa-thumbs-up\"></i></md-button></form></div><div class=\"account-remove\"><a ng-click=\"vm.deactivateAccount($event)\"><i class=\"fa fa-remove\"></i> Quero cancelar minha conta</a></div></md-content>");
$templateCache.put("core/account/confirm.tpl.html","<md-dialog aria-label=\"Confirme sua identidade\"><md-toolbar><div class=\"md-toolbar-tools\"><h5>Confirme sua identidade</h5><span flex=\"\"></span><md-button class=\"md-icon-button\" ng-click=\"hide()\"><md-icon md-svg-src=\"/assets/images/icons/ic_close_24px.svg\" aria-label=\"Fechar\"></md-icon></md-button></div></md-toolbar><md-dialog-content><menu-avatar first-name=\"user.profile.firstName\" last-name=\"user.profile.lastName\" gender=\"user.profile.gender\" facebook=\"user.facebook\"></menu-avatar><br><form name=\"passwordForm\"><md-input-container><label>Senha</label> <input type=\"password\" ng-model=\"account.password\" required=\"\"></md-input-container></form></md-dialog-content><div class=\"md-actions\" layout=\"row\"><md-button ng-click=\"confirm()\" class=\"md-primary\" ng-disabled=\"passwordForm.$invalid||!passwordForm.$dirty\">Confirmar</md-button></div></md-dialog>");
$templateCache.put("core/account/deactivate.tpl.html","<md-dialog aria-label=\"Desativação de conta\"><md-toolbar><div class=\"md-toolbar-tools\"><h5>Desativação de conta</h5><span flex=\"\"></span><md-button class=\"md-icon-button\" ng-click=\"hide()\"><md-icon md-svg-src=\"/assets/images/icons/ic_close_24px.svg\" aria-label=\"Fechar\"></md-icon></md-button></div></md-toolbar><md-dialog-content><strong>Prezad{{gender}} {{account.profile.firstName}}</strong><p>Conforme nossa política de usuários, não podemos apagar todos os seus dados, pois nem tudo está relacionado somente a você.<br>Iremos apagar suas conexões e o que mais for possível, além disso, você não receberá mais nenhuma oportunidade, ou notificação do LiveJob.</p><p>Deseja realmente prosseguir com a desativação de sua conta?</p></md-dialog-content><div class=\"md-actions\" layout=\"row\"><md-button ng-click=\"cancel()\" class=\"md-primary\">Não, obrigado.</md-button><md-button ng-click=\"confirm()\" class=\"md-primary\">Ok, entendo.</md-button></div></md-dialog>");
$templateCache.put("core/page/page.tpl.html","<div class=\"main-wrapper anim-zoom-in md-padding page\" layout=\"column\" flex=\"\"><div class=\"text-center\">Olá moda foca <a ui-sref=\"app.login\">entrar</a></div></div><style>\r\n/*md-toolbar.main.not-authed, md-toolbar.main.not-authed .md-toolbar-tools {\r\n    min-height: 10px !important; height: 10px !important;\r\n}*/\r\n</style>");
$templateCache.put("core/profile/profile.tpl.html","<md-content class=\"main-wrapper md-padding\" layout=\"column\" flex=\"\"><profile-form company=\"app.user.current(\'company\')\" ng-if=\"vm.companyCurrent\"></profile-form></md-content>");
$templateCache.put("core/login/facebook/facebookLogin.tpl.html","<button flex=\"\" ng-click=\"fb.login()\" ng-disabled=\"app.$page.load.status\" layout=\"row\"><i class=\"fa fa-facebook\"></i> <span>Entrar com Facebook</span></button>");
$templateCache.put("core/login/form/loginForm.tpl.html","<div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><md-content class=\"md-padding\"><form name=\"logon\" novalidate=\"\"><div layout=\"row\" class=\"email\"><i class=\"fa fa-at\"></i><md-input-container flex=\"\"><label>Email</label> <input ng-model=\"logon.email\" type=\"email\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"senha\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Senha</label> <input ng-model=\"logon.password\" type=\"password\" required=\"\"></md-input-container></div></form></md-content><div layout=\"row\" layout-padding=\"\"><button flex=\"\" class=\"entrar\" ng-click=\"vm.login(logon)\" ng-disabled=\"logon.$invalid||app.$page.load.status\">Entrar</button><facebook-login user=\"user\"></facebook-login></div></div><div class=\"help\" layout=\"row\"><a flex=\"\" ui-sref=\"app.login-lost\" class=\"lost\"><i class=\"fa fa-support\"></i> Esqueci minha senha</a> <a flex=\"\" ui-sref=\"app.signup\" class=\"lost\"><i class=\"fa fa-support\"></i> Não tenho cadastro</a></div><style>\r\nbody, html {  overflow: auto;}\r\n</style>");
$templateCache.put("core/login/google/googleLogin.tpl.html","<google-plus-signin clientid=\"{{google.clientId}}\" language=\"{{google.language}}\"><button class=\"google\" layout=\"row\" ng-disabled=\"app.$page.load.status\"><i class=\"fa fa-google-plus\"></i> <span>Entrar com Google</span></button></google-plus-signin>");
$templateCache.put("core/login/register/lost.tpl.html","<div layout=\"row\" class=\"login-lost\" ng-if=\"!app.isAuthed()\"><div layout=\"column\" class=\"login\" flex=\"\" ng-if=\"!vm.userHash\"><div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><md-content class=\"md-padding\"><form name=\"lost\" novalidate=\"\"><div layout=\"row\" class=\"email\"><i class=\"fa fa-at\"></i><md-input-container flex=\"\"><label>Email</label> <input ng-model=\"email\" type=\"email\" required=\"\"></md-input-container></div></form></md-content><md-button class=\"md-primary md-raised entrar\" ng-disabled=\"lost.$invalid||app.$page.load.status\" ng-click=\"!lost.$invalid?vm.lost(email):false\">Recuperar</md-button></div></div><div layout=\"column\" class=\"login\" flex=\"\" ng-if=\"vm.userHash\"><div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><h4 class=\"text-center\">Entre com sua nova senha</h4><md-content class=\"md-padding\"><form name=\"lost\" novalidate=\"\"><div layout=\"row\" class=\"email\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Senha</label> <input ng-model=\"senha\" type=\"password\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"email\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Repetir senha</label> <input ng-model=\"senhaConfirm\" name=\"senhaConfirm\" type=\"password\" match=\"senha\" required=\"\"></md-input-container></div></form></md-content><md-button class=\"md-primary md-raised entrar\" ng-disabled=\"lost.$invalid||app.$page.load.status\" ng-click=\"!lost.$invalid?vm.change(senha):false\">Alterar</md-button></div><div ng-show=\"lost.senhaConfirm.$error.match\" class=\"warn\"><span>(!) As senhas não conferem</span></div></div></div><style>\r\nbody, html {  overflow: auto;}\r\n</style>");
$templateCache.put("core/login/register/register.tpl.html","<md-content class=\"md-padding anim-zoom-in login\" layout=\"row\" layout-sm=\"column\" ng-if=\"!app.isAuthed()\" flex=\"\"><div layout=\"column\" class=\"register\" layout-padding=\"\" flex=\"\"><register-form config=\"vm.config\"></register-form></div></md-content>");
$templateCache.put("core/login/register/registerForm.tpl.html","<div class=\"wrapper md-whiteframe-z1\"><img class=\"avatar\" src=\"assets/images/avatar-m.jpg\"><md-content><form name=\"registerForm\" novalidate=\"\"><div layout=\"row\" layout-sm=\"column\" class=\"nome\"><i hide-sm=\"\" class=\"fa fa-smile-o\"></i><md-input-container flex=\"\"><label>Seu nome</label> <input ng-model=\"sign.firstName\" type=\"text\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Sobrenome</label> <input ng-model=\"sign.lastName\" type=\"text\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"email\"><i class=\"fa fa-at\"></i><md-input-container flex=\"\"><label>Email</label> <input ng-model=\"sign.email\" type=\"email\" required=\"\"></md-input-container></div><div layout=\"row\" class=\"senha\"><i class=\"fa fa-key\"></i><md-input-container flex=\"\"><label>Senha</label> <input ng-model=\"sign.password\" type=\"password\" required=\"\"></md-input-container></div></form><div layout=\"row\" layout-padding=\"\"><button flex=\"\" class=\"entrar\" ng-disabled=\"registerForm.$invalid||app.$page.load.status\" ng-click=\"register(sign)\">Registrar</button><facebook-login user=\"user\"></facebook-login></div></md-content></div><div layout=\"column\"><a flex=\"\" class=\"lost\" ui-sref=\"app.pages({slug:\'terms\'})\"><i class=\"fa fa-warning\"></i> Concordo com os termos</a></div><style>\r\nbody, html {  overflow: auto;}\r\n</style>");
$templateCache.put("core/account/optOut/optOut.tpl.html","<div class=\"opt-out md-whiteframe-z1\" layout=\"column\"><img ng-if=\"itemImage\" ng-src=\"{{itemImage}}\"><md-button class=\"md-fab md-primary md-hue-1\" aria-label=\"{{putLabel}}\" ng-click=\"callAction($event)\"><md-tooltip ng-if=\"putLabel\">{{putLabel}}</md-tooltip><i class=\"fa fa-times\"></i></md-button><a class=\"md-primary\" href=\"{{itemLocation}}\"><h4 ng-if=\"itemTitle\" ng-bind=\"itemTitle | cut:true:18:\'..\'\"></h4><md-tooltip ng-if=\"itemTitleTooltip\">{{itemTitleTooltip}}</md-tooltip></a><p ng-bind-html=\"itemInfo\"></p></div>");
$templateCache.put("core/page/layout/layout.tpl.html","<md-sidenav ui-view=\"sidenav\" class=\"page-menu md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\" md-is-locked-open=\"$mdMedia(\'gt-md\')\" ng-if=\"app.isAuthed()\"></md-sidenav><div layout=\"column\" flex=\"\" class=\"main-content-wrapper\"><loader></loader><md-toolbar ui-view=\"toolbar\" class=\"main\" ng-class=\"{\'not-authed\':!app.isAuthed()&&!app.user.current(\'company\')}\" md-scroll-shrink=\"\" md-shrink-speed-factor=\"0.25\"></md-toolbar><md-content class=\"main-content\" on-scroll-apply-opacity=\"\"><div ui-view=\"content\" ng-class=\"{ \'anim-in-out anim-slide-below-fade\': app.state.current.name != \'app.profile\' && app.state.current.name != \'app.landing\'}\"></div></md-content></div>");
$templateCache.put("core/page/loader/loader.tpl.html","<div class=\"page-loader\" ng-class=\"{\'show\':app.$page.load.status}\"><md-progress-linear md-mode=\"indeterminate\"></md-progress-linear></div>");
$templateCache.put("core/page/menu/menuLink.tpl.html","<md-button ng-class=\"{\'active\' : isSelected()||vm.state.current.name === section.state}\" ng-href=\"{{section.url}}\"><i ng-if=\"section.icon\" class=\"{{section.icon}}\"></i> <span>{{section | menuHuman }}</span></md-button>");
$templateCache.put("core/page/menu/menuToggle.tpl.html","<md-button class=\"md-button-toggle\" ng-click=\"toggle()\" aria-controls=\"app-menu-{{section.name | nospace}}\" flex=\"\" layout=\"row\" aria-expanded=\"{{isOpen()}}\"><i ng-if=\"section.icon\" class=\"{{section.icon}}\"></i> <span class=\"title\">{{section.name}}</span> <span aria-hidden=\"true\" class=\"md-toggle-icon\" ng-class=\"{\'toggled\' : isOpen()}\"></span></md-button><ul ng-show=\"isOpen()\" id=\"app-menu-{{section.name | nospace}}\" class=\"menu-toggle-list\"><li ng-repeat=\"page in section.pages\"><div layout=\"row\"><menu-link section=\"page\" flex=\"\"></menu-link><md-button flex=\"25\" ng-click=\"cart.add(page._)\" aria-label=\"adicione {{page.name}} ao carrinho\" title=\"adicione {{page.name}} ao carrinho\" ng-if=\"section.product\"><i class=\"fa fa-cart-plus\"></i></md-button></div></li></ul>");
$templateCache.put("core/page/menu/sidenav.tpl.html","<div layout=\"column\"><menu-facepile ng-if=\"app.user.current(\'company\').facebook && (app.state.current.name!=\'app.home\' && app.state.current.name!=\'app.account\') && app.enviroment !== \'development\' && !app.iframe\" hide-sm=\"\" width=\"304\" url=\"https://www.facebook.com/{{app.user.current(\'company\').facebook}}\" facepile=\"true\" hide-cover=\"false\" ng-hide=\"app.state.current.name===\'app.pages\'\"></menu-facepile><menu-avatar first-name=\"app.user.profile.firstName\" last-name=\"app.user.profile.lastName\" gender=\"app.user.profile.gender\" facebook=\"app.user.facebook\"></menu-avatar><div flex=\"\"><ul class=\"app-menu\"><li ng-repeat=\"section in app.menu.sections\" class=\"parent-list-item\" ng-class=\"{\'parentActive\' : app.menu.isSectionSelected(section)}\"><h2 class=\"menu-heading\" ng-if=\"section.type === \'heading\'\" id=\"heading_{{ section.name | nospace }}\" layout=\"row\"><i ng-if=\"section.icon\" class=\"{{section.icon}}\"></i><my-svg-icon ng-if=\"section.iconSvg\" class=\"ic_24px\" icon=\"{{section.iconSvg}}\"></my-svg-icon><span>{{section.name}}</span></h2><menu-link section=\"section\" ng-if=\"section.type === \'link\'\"></menu-link><menu-toggle section=\"section\" ng-if=\"section.type === \'toggle\'\"></menu-toggle><ul ng-if=\"section.children\" class=\"menu-nested-list\"><li ng-repeat=\"child in section.children\" ng-class=\"{\'childActive\' : app.menu.isChildSectionSelected(child)}\"><menu-toggle section=\"child\"></menu-toggle></li></ul></li><li><a class=\"md-button md-default-theme\" ng-click=\"app.logout()\"><i class=\"fa fa-power-off\"></i> <span class=\"title\">Sair</span></a></li></ul></div><div layout=\"column\" layout-align=\"center center\" class=\"page-footer text-center\"><md-content flex=\"\" class=\"main-wrapper\"><div class=\"copyright\"><strong>{{ app.setting.copyright }} © {{ app.year }}</strong></div><div class=\"terms\"><a ui-sref=\"app.pages({slug:\'privacy\'})\">Política de Privacidade</a> - <a ui-sref=\"app.pages({slug:\'terms\'})\">Termos de Serviço</a></div></md-content></div></div>");
$templateCache.put("core/page/toolbar/toolbar.tpl.html","<div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\"><div hide=\"\" show-sm=\"\" show-md=\"\" layout=\"row\"><a ng-click=\"app.menu.open()\" ng-if=\"app.isAuthed()\" aria-label=\"menu\"><md-icon md-svg-src=\"assets/images/icons/ic_menu_24px.svg\"></md-icon></a><toolbar-title hide-sm=\"\" hide-md=\"\"></toolbar-title></div><toolbar-title hide=\"\" show-gt-md=\"\"></toolbar-title><div layout=\"row\" ng-if=\"app.state.current.name != \'app.home\'\"><ul class=\"top-menu\"><li></li></ul><toolbar-menu ng-if=\"app.isAuthed()\"></toolbar-menu><a ui-sref=\"app.home\"><img hide=\"\" show-sm=\"\" show-md=\"\" class=\"logo-header\" src=\"https://livejob.s3.amazonaws.com/livejob-white.png\"></a></div></div>");
$templateCache.put("core/profile/form/profileForm-step1.tpl.html","<div layout-padding=\"\" layout=\"row\" layout-sm=\"column\"><profile-form-positions options=\"company.positions\" selected=\"vm.profile.positions\"></profile-form-positions></div>");
$templateCache.put("core/profile/form/profileForm-step2.tpl.html","<div layout=\"column\"><div class=\"fieldset\"><h5>Seus dados</h5><div class=\"group\" layout=\"row\" layout-sm=\"column\"><div flex=\"\" class=\"group-inner\" layout=\"column\"><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'firstName\')}\" flex=\"\"><label>Nome</label> <input name=\"firstName\" ng-model=\"vm.profile.firstName\" required=\"\" focus=\"\"></md-input-container><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'cpf\')}\" flex=\"\"><label>CPF</label> <input name=\"cpf\" ng-model=\"vm.profile.doc.cpf\" ui-br-cpf-mask=\"\" required=\"\"></md-input-container><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'email\')}\" flex=\"\"><label>Email para contato</label> <input name=\"email\" ng-model=\"vm.profile.contact.email\" required=\"\"></md-input-container></div><div flex=\"\" class=\"group-inner\" layout=\"column\"><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'lastName\')}\" flex=\"\"><label>Sobrenome</label> <input name=\"lastName\" ng-model=\"vm.profile.lastName\" required=\"\"></md-input-container><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'rg\')}\" flex=\"\"><label>RG</label> <input name=\"rg\" ng-model=\"vm.profile.doc.rg\" required=\"\"></md-input-container><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'birthday\')}\" flex=\"\"><label>Data de nascimento</label> <input name=\"birthday\" ng-model=\"vm.profile.doc.birthday\" mask=\"39/19/9999\" required=\"\"></md-input-container></div></div></div><div class=\"fieldset\"><h5>Sua localização</h5><div class=\"group\" layout=\"row\" layout-sm=\"column\"><div flex=\"\" class=\"group-inner\" layout=\"column\"><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'cep\')}\"><label>CEP</label> <input name=\"cep\" ng-model=\"vm.profile.address.default.cep\" ng-change=\"vm.setAddrByCep()\" type=\"number\" ng-maxlength=\"8\" required=\"\"></md-input-container><md-input-container><label>Complemento</label> <input ng-model=\"vm.profile.address.default.comp\"></md-input-container><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'district\')}\"><label>Bairro</label> <input name=\"district\" ng-model=\"vm.profile.address.default.district\" required=\"\"></md-input-container><md-select required=\"\" placeholder=\"Estado\" class=\"state\" ng-model=\"vm.profile.address.default.state\" ng-class=\"{\'md-input-invalid\':!vm.profile.address.default.state}\"><md-option ng-value=\"opt.value\" ng-repeat=\"opt in vm.states\">{{ opt.name }}</md-option></md-select></div><div flex=\"\" class=\"group-inner\" layout=\"column\"><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'street\')}\"><label>Endereço</label> <input name=\"street\" ng-model=\"vm.profile.address.default.street\" required=\"\"></md-input-container><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'num\')}\"><label>Número</label> <input name=\"num\" ng-model=\"vm.profile.address.default.num\" type=\"number\"></md-input-container><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'city\')}\"><label>Cidade</label> <input name=\"city\" ng-model=\"vm.profile.address.default.city\" required=\"\"></md-input-container></div></div></div><div class=\"fieldset\"><h5>Informações de contato</h5><div class=\"group\" layout=\"row\" layout-sm=\"column\"><div flex=\"\" class=\"group-inner\" layout=\"column\"><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'phone\')}\" flex=\"\"><label>Telefone fixo</label> <input name=\"phone\" ng-model=\"vm.profile.contact.phone\" ui-br-phone-number=\"\"></md-input-container></div><div flex=\"\" class=\"group-inner\" layout=\"column\"><md-input-container ng-class=\"{\'md-input-invalid\':vm.hasFormError(\'mobile\')}\" flex=\"\"><label>Telefone celular</label> <input name=\"mobile\" ng-model=\"vm.profile.contact.mobile\" required=\"\" ui-br-phone-number=\"\"></md-input-container></div></div></div><div class=\"fieldset\"><h5>Informações adicionais</h5><div class=\"group m-bottom\" layout=\"row\" layout-sm=\"column\"><div flex=\"\" class=\"group-inner\" layout=\"column\" ng-class=\"{\'md-input-invalid\':!vm.profile.gender}\"><label>Sexo</label><md-radio-group name=\"gender\" ng-model=\"vm.profile.gender\" layout=\"row\" class=\"md-primary\"><md-radio-button value=\"M\">M</md-radio-button><md-radio-button value=\"F\">F</md-radio-button></md-radio-group></div><div flex=\"\" class=\"group-inner\" layout=\"column\" ng-class=\"{\'md-input-invalid\':!vm.profile.relocating && vm.profile.relocating != false}\"><label>Poderia mudar de cidade?</label><md-radio-group ng-model=\"vm.profile.relocating\" layout=\"row\" class=\"md-primary\"><md-radio-button value=\"1\">Sim</md-radio-button><md-radio-button value=\"0\">Não</md-radio-button></md-radio-group></div><div flex=\"\" class=\"group-inner feedback\" layout=\"column\" ng-class=\"{\'md-input-invalid\':!vm.profile.from}\"><label>Por onde conheceu {{vm.company.name}}?</label><md-select name=\"feedback\" flex=\"\" ng-model=\"vm.profile.from\" placeholder=\"Selecione\"><md-option ng-value=\"opt.value\" ng-repeat=\"opt in vm.feedback\">{{ opt.label }}</md-option></md-select></div></div><div class=\"group m-bottom\" layout=\"row\" layout-sm=\"column\"><div flex=\"\" class=\"group-inner\" layout=\"column\" ng-class=\"{\'md-input-invalid\':!vm.profile.working && vm.profile.working != false}\"><label>Está empregado atualmente?</label><md-radio-group name=\"working\" ng-model=\"vm.profile.working\" layout=\"row\" class=\"md-primary\"><md-radio-button value=\"1\">Sim</md-radio-button><md-radio-button value=\"0\">Não</md-radio-button></md-radio-group></div><div flex=\"\" class=\"group-inner\" layout=\"column\" ng-class=\"{\'md-input-invalid\':!vm.profile.doc.pne && vm.profile.doc.pne != false}\"><label>É portador de necessidades?</label><md-radio-group name=\"pne\" ng-model=\"vm.profile.doc.pne\" layout=\"row\" class=\"md-primary\"><md-radio-button value=\"1\">Sim</md-radio-button><md-radio-button value=\"0\">Não</md-radio-button></md-radio-group></div><div flex=\"\" class=\"group-inner\" layout=\"column\"><label>Possui CNH?</label><live-chips items=\"vm.cnh\" placeholder=\"Selecione digitando A, B, C ou D\" model=\"vm.profile.doc.cnh\" hide-options=\"true\"></live-chips></div></div></div></div>");
$templateCache.put("core/profile/form/profileForm-step3.tpl.html","<div layout=\"column\"><div class=\"fieldset\"><h5>Formação</h5><md-progress-circular ng-show=\"vm.educationLoading\" md-diameter=\"24\" class=\"educationLoader md-warn\" md-mode=\"indeterminate\"></md-progress-circular><div ng-hide=\"vm.educationLoading\" class=\"group\" layout=\"row\" layout-sm=\"column\"><div layout=\"column\" class=\"chips-wrap\" flex=\"\"><live-chips items=\"vm.education.schooling\" placeholder=\"Selecione uma formação\" model=\"vm.profile.education.schooling\" truncate-input=\"true\" truncate-options=\"false\"></live-chips></div><div layout=\"column\" class=\"chips-wrap\" flex=\"\"><live-chips items=\"vm.education.technical\" placeholder=\"Selecione um curso técnico\" model=\"vm.profile.education.technical\" truncate-input=\"true\" truncate-options=\"false\"></live-chips></div><div layout=\"column\" class=\"chips-wrap\" flex=\"\"><live-chips items=\"vm.education.graduation\" placeholder=\"Selecione uma graduação\" model=\"vm.profile.education.graduation\" truncate-input=\"true\" truncate-options=\"false\"></live-chips></div></div></div><div class=\"fieldset\"><h5>Cursos</h5><div class=\"group animate-repeat\" layout=\"row\" ng-repeat=\"course in vm.profile.education.courses\"><md-input-container flex=\"\"><label>Nome</label> <input required=\"\" name=\"name\" focus=\"$index===0\" ng-model=\"course.name\"></md-input-container><md-input-container flex=\"\"><label>Horas</label> <input required=\"\" type=\"number\" name=\"hours\" ng-model=\"course.hours\"></md-input-container><md-button class=\"remove md-fab md-warn\" aria-label=\"Remover {{course.name}}\" title=\"Remover {{course.name}}\" ng-click=\"vm.remove(course)\"><md-icon md-svg-src=\"assets/images/icons/ic_delete_24px.svg\"></md-icon></md-button></div><p class=\"subtitle warn\" ng-show=\"!vm.profile.education.courses.length\"><i class=\"fa fa-lightbulb-o\"></i> adicione cursos clicando no lápis --></p></div></div><br><br>");
$templateCache.put("core/profile/form/profileForm-step4.tpl.html","<div layout=\"column\"><div class=\"fieldset\"><div class=\"group animate-repeat\" layout=\"row\" layout-sm=\"column\" ng-repeat=\"company in vm.profile.xp.companies\"><div flex=\"\" layout=\"column\"><div layout=\"row\" flex=\"\"><md-input-container flex=\"\"><label>Nome da empresa</label> <input focus=\"$index===0\" required=\"\" name=\"name\" ng-model=\"company.name\"></md-input-container><md-input-container flex=\"\"><label>Cargo</label> <input required=\"\" name=\"position\" ng-model=\"company.position\"></md-input-container></div><div layout=\"row\" flex=\"\"><md-input-container flex=\"\"><label>Começou</label> <input required=\"\" mask=\"39/19/9999\" name=\"start\" ng-model=\"company.start\" ng-change=\"vm.cycleXpMonths()\" ng-model-options=\"{ updateOn: \'blur\' }\"></md-input-container><md-input-container flex=\"\"><label>Saiu</label> <input focus=\"\" focus-when=\"!company.current\" mask=\"39/19/9999\" name=\"end\" ng-disabled=\"company.current\" ng-model=\"company.end\" ng-change=\"vm.cycleXpMonths()\" ng-model-options=\"{ updateOn: \'blur\' }\"></md-input-container></div><div layout=\"column\" flex=\"\"><md-input-container flex=\"\"><label>Breve descrição do seu trabalho com {{company.name}}</label> <textarea ng-model=\"company.info\" columns=\"1\" md-maxlength=\"150\">\r\n                    </textarea></md-input-container></div></div><div layout=\"row\"><div class=\"action-button-checkbox-wrap\"><label class=\"subtitle\">meu trabalho atual</label><md-button class=\"action-button checkbox md-fab\"><md-checkbox ng-model=\"company.current\" aria-label=\"Trabalha atualmente em {{company.name}}?\"></md-checkbox></md-button></div><md-button class=\"action-button remove md-fab md-warn\" aria-label=\"Remover {{company.name}}\" title=\"Remover {{company.name}}\" ng-click=\"vm.remove(company)\"><md-icon md-svg-src=\"assets/images/icons/ic_delete_24px.svg\"></md-icon></md-button></div></div><h5 ng-show=\"vm.profile.xp.months\"><br><i class=\"fa fa-lightbulb-o\"></i> Você possui ~{{vm.profile.xp.months | toYears }} de experiência</h5><p class=\"subtitle warn\" ng-show=\"!vm.profile.xp.companies.length\"><i class=\"fa fa-lightbulb-o\"></i> adicione empresas clicando no lápis --></p></div></div><br><br>");
$templateCache.put("core/profile/form/profileForm-step5.tpl.html","<div class=\"fieldset\"><h5>Idiomas</h5><div class=\"group animate-repeat\" layout=\"row\" ng-repeat=\"idiom in vm.profile.education.idioms\"><md-select flex=\"\" required=\"\" placeholder=\"Língua\" class=\"lang\" ng-model=\"idiom.lang\" ng-class=\"{\'md-input-invalid\':!idiom.lang}\"><md-option ng-value=\"opt\" ng-repeat=\"opt in vm.idioms\">{{ opt }}</md-option></md-select><md-select flex=\"\" required=\"\" placeholder=\"Nível\" class=\"lang\" ng-model=\"idiom.level\" ng-class=\"{\'md-input-invalid\':!idiom.level}\"><md-option ng-value=\"opt\" ng-repeat=\"opt in vm.idiomsLevel\">{{ opt }}</md-option></md-select><md-button class=\"remove md-fab md-warn\" aria-label=\"Remover {{idiom.lang}}\" title=\"Remover {{idiom.lang}}\" ng-click=\"vm.remove(idiom)\"><md-icon md-svg-src=\"assets/images/icons/ic_delete_24px.svg\"></md-icon></md-button></div><p class=\"subtitle warn\" ng-show=\"!vm.profile.education.idioms.length\"><i class=\"fa fa-lightbulb-o\"></i> adicione idiomas clicando no lápis --></p></div>");
$templateCache.put("core/profile/form/profileForm.tpl.html","<form novalidate=\"\" name=\"vm.forms.profile\" class=\"md-whiteframe-z1\"><md-tabs md-dynamic-height=\"\" md-center-tabs=\"\" md-selected=\"tabCurrent\" md-border-bottom=\"\"><md-tab ng-repeat=\"tab in tabs\" ng-disabled=\"tab.disabled\"><md-tab-label><span ng-bind-html=\"tab.title\"></span></md-tab-label><md-tab-body><div class=\"profile-tab {{tab.slug}}\"><p class=\"subtitle\" ng-bind-html=\"tab.subtitle\"></p><div ng-include=\"tab.template\"></div></div></md-tab-body></md-tab></md-tabs><div layout=\"\" class=\"row actions content-action-wrapper\"><md-button ng-hide=\"vm.hideActionAddWhen()\" class=\"add md-fab md-warn\" aria-label=\"Adicionar {{tabs[tabCurrent].name}}\" title=\"Adicionar {{tabs[tabCurrent].name}}\" ng-click=\"vm.add()\"><md-icon md-svg-src=\"assets/images/icons/ic_mode_edit_18px.svg\"></md-icon></md-button><md-button class=\"save md-fab md-primary\" aria-label=\"Atualizar Perfil\" title=\"Atualizar Perfil\" ng-click=\"vm.save()\" ng-disabled=\"vm.profile.busy||(vm.forms.profile.$invalid&&tabCurrent!=0)||!vm.forms.profile.$dirty\"><md-icon md-svg-src=\"assets/images/icons/ic_thumb_up_24px.svg\" ng-click=\"vm.hasFormErrorToast()\"></md-icon></md-button></div></form>");
$templateCache.put("core/page/menu/avatar/menuAvatar.tpl.html","<div layout=\"column\" class=\"avatar-wrapper\"><img ng-src=\"{{vm.picture}}\" class=\"avatar\"><p class=\"name\"><strong>{{firstName}} {{lastName}}</strong></p></div>");
$templateCache.put("core/page/menu/facepile/menuFacepile.tpl.html","<div layout=\"column\"><md-progress-circular class=\"loading md-primary\" md-mode=\"indeterminate\" md-diameter=\"28\" ng-show=\"loading\"></md-progress-circular><div ng-hide=\"loading\" class=\"fb-page\" data-href=\"{{url}}\" data-width=\"{{width}}\" data-hide-cover=\"{{hideCover}}\" data-show-facepile=\"{{facepile}}\" data-show-posts=\"false\"><div class=\"fb-xfbml-parse-ignore\"></div></div></div>");
$templateCache.put("core/page/toolbar/menu/toolbarMenu.tpl.html","<ul class=\"top-menu\"><li ng-repeat=\"item in menu\"><a id=\"{{item.id}}\" title=\"{{item.name}}\"><i class=\"{{item.icon}}\"></i></a></li></ul>");
$templateCache.put("core/page/toolbar/title/toolbarTitle.tpl.html","<div class=\"logo-company\" layout=\"row\" layout-align=\"space-between center\"><a href=\"/\"><img class=\"logo-header\" src=\"https://livejob.s3.amazonaws.com/livejob-white.png\"></a></div>");
$templateCache.put("core/profile/form/positions/profileFormPositions.tpl.html","<ul class=\"list-positions\"><li ng-repeat=\"item in options\" class=\"animate-repeat\"><md-checkbox title=\"{{item}}\" ng-checked=\"vm.exists(item, selected)\" ng-click=\"vm.toggle(item, selected)\">{{item}}</md-checkbox></li></ul>");
$templateCache.put("core/utils/directives/companyChooser/companyChooser.tpl.html","<div class=\"company-chooser\"><div ng-hide=\"hideMe\" ng-if=\"companies.length\"><md-select aria-label=\"placeholder\" ng-model=\"vm.companyid\" placeholder=\"{{placeholder}}\" flex=\"\" required=\"\"><md-option ng-value=\"opt.company._id\" ng-repeat=\"opt in companies\">{{ opt.company.name }}</md-option></md-select></div></div>");
$templateCache.put("core/utils/directives/leadForm/leadForm.tpl.html","<form class=\"lead-form\" name=\"leadForm\" novalidate=\"\"><md-input-container flex=\"\"><label>Seu nome</label> <input name=\"name\" ng-model=\"lead.name\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Email</label> <input name=\"email\" type=\"email\" ng-model=\"lead.email\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Empresa</label> <input name=\"company\" ng-model=\"lead.company\" required=\"\"></md-input-container><md-input-container flex=\"\"><label>Telefone</label> <input name=\"phone\" ng-model=\"lead.phone\" ui-br-phone-number=\"\" required=\"\"></md-input-container><md-button ng-click=\"register()\" ng-disabled=\"leadForm.$invalid\" class=\"md-primary\">{{label?label:\'Enviar\'}}</md-button><md-progress-circular md-diameter=\"20\" class=\"md-warn md-hue-3\" md-mode=\"indeterminate\" ng-class=\"{\'busy\':vm.busy}\"></md-progress-circular></form>");
$templateCache.put("core/utils/directives/liveChips/liveChips.tpl.html","<md-chips ng-model=\"vm.selectedItems\" md-autocomplete-snap=\"\" md-require-match=\"\"><md-autocomplete md-selected-item=\"vm.selectedItem\" md-search-text=\"vm.searchText\" md-items=\"item in vm.querySearch(vm.searchText)\" md-item-text=\"item\" placeholder=\"{{vm.placeholder}}\"><span md-highlight-text=\"vm.searchText\">{{item}}</span></md-autocomplete><md-chip-template><span><a ng-class=\"{\'truncate\':truncateInput}\" title=\"{{$chip}}\">{{$chip}}</a></span></md-chip-template></md-chips><v-accordion ng-hide=\"hideOptions\" class=\"vAccordion--default\" layout-align=\"start start\" layout-align-sm=\"center start\" control=\"accordion\"><v-pane><v-pane-header class=\"border-bottom\"><div>Opções</div></v-pane-header><v-pane-content><md-list><md-list-item class=\"filter-opt\" ng-repeat=\"chip in items track by $index\"><div class=\"md-list-item-text compact\"><a ng-class=\"{\'truncate\':truncateOptions}\" title=\"{{chip}}\" ng-click=\"vm.applyRole(chip,accordion)\"><i class=\"fa fa-gear\"></i> {{chip}}</a></div></md-list-item></md-list></v-pane-content></v-pane></v-accordion>");}]);