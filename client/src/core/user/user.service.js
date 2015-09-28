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