'use strict';
angular.module('account.module').service('Account', /*@ngInject*/ function($http, $mdDialog, $page, api) {
    var Account = function(params) {
        params = params ? params : {};
        if (typeof params === 'object') {
            for (var k in params) {
                if (params.hasOwnProperty(k)) {
                    this[k] = params[k];
                }
            }
        }
        this.password = ''; //destinado a confirmação da conta
        this._password = 'lolggiziafkbase'; //destinado a mudança de password
        this.__password = 'lolggiziafkbase'; //confirmação da mudança de password
    }
    Account.prototype.save = function(cbSuccess, cbError) {
        if (this.busy) return;
        this.busy = true;
        $page.load.init();
        var url = api.url + '/api/accounts';
        $http.put(url + '/' + this.id, this).success(function(response) {
            $page.load.done();
            this.busy = false;
            $page.toast(response.firstName + ', sua conta foi atualizada.');
            if (cbSuccess) return cbSuccess(response);
        }.bind(this)).error(function(response) {
            $page.load.done();
            this.busy = false;
            $page.toast('Problema ao atualizar conta');
            if (cbError) return cbError(response);
        }.bind(this));
    }
    Account.prototype.confirm = function(cbSuccess, cbError) {
        if (this.busy) return;
        this.busy = true;
        var vm = this;
        $mdDialog.show({
            controller: /*@ngInject*/ function($scope, $mdDialog, user, account, api) {
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
                $scope.user = user.instance;
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