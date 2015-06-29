'use strict';
/* global window */
/**
 * @ngdoc service
 * @name user.module.User
 * @description 
 * Comportamentos de usuário
 **/
angular.module('user.module').service('User', /*@ngInject*/ function($state, $http, $auth, $timeout, UserSetting, menu, $page, setting) {
    var User = function(params, alert, message) {
            params = params ? params : {};
            this.currentData = {};
            this.sessionData = {};
            this.init(params, alert, message);
        }
        //
        // Bootstrap User
        //
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
        //
        // magic getter and setter for current data and session data configs
        //
    User.prototype.current = function(key, val, remove) {
        if (key && val) {
            if (!this.currentData) this.currentData = {};
            this.currentData[key] = val;
        } else if (key) {
            return this.currentData && this.currentData[key] ? this.currentData[key] : false;
        }
        return this.currentData;
    }
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
        //
        // filter user companies by _id
        //
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
        //checar se ta authenticado e setar token na rota
    User.prototype.isAuthed = function() {
        if ($state.current.protected) {
            //setar token no header do http se o state for protegido
            if (token()) $http.defaults.headers.common['token'] = token();
            if (!$auth.isAuthenticated()) {
                $state.go("app.login");
                return false;
            }
            $timeout(function() {
                menu.api().close();
            })
            return true;
        }
        return false;
    }
    User.prototype.destroy = function(alert) {
        $auth.logout();
        $auth.removeToken();
        removeStorageSession();
        removeStorageUser();
        // if (UserSetting.logoutStateRedirect)
        // $state.go(UserSetting.logoutStateRedirect);
        $page.load.done();
        if (alert) $page.toast('Você saiu', 3000);
    }
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