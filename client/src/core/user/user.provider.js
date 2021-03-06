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