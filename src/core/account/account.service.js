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
            controller: /*@ngInject*/ function($scope, $mdDialog, $user, $account, api) {
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
                $scope.user = $user.instance();
                $scope.account = $account.instance();
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