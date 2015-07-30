'use strict';
/* global window */
angular.module('core.user').service('$User', /*@ngInject*/ function($state, $http, $auth, $timeout, $user, $menu, $page, $window, setting) {
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
                angular.extend(this, params);
            }
            if (params._id) {
                var gender = (params.profile && params.profile.gender === 'F') ? 'a' : 'o',
                    roleForCompany = false;
                if ($user.setting.roleForCompany != 'user') roleForCompany = $user.setting.roleForCompany;
                if (roleForCompany && params[roleForCompany].role ? params[roleForCompany].role.length : params.role.length) {
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
            removeStorageSession();
            removeStorageUser();
            $auth.removeToken();
            $auth.logout();
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
        if ($user.setting.roleForCompany != 'user') roleForCompany = $user.setting.roleForCompany;
        return roleForCompany && userInstance[roleForCompany] ? userInstance[roleForCompany].role : userInstance.role;
    }

    function getCompany(userInstance) {
        var roleForCompany = false;
        if ($user.setting.roleForCompany != 'user') roleForCompany = $user.setting.roleForCompany;
        return roleForCompany ? userInstance[roleForCompany].role[0].company : userInstance.role[0].company;
    }
    return User;
})