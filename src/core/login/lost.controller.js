'use strict';
/**
 * @ngdoc object
 * @name login.module.controller:$LostCtrl
 * @requires page.module.factory:$page
 * @requires setting
 * @requires api
 **/
angular.module('login.module').controller('$LostCtrl', /*@ngInject*/ function($state, $auth, $http, $mdToast, $location, $page, setting, api) {
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
     * @name login.module.controller:$LostCtrl#change
     * @methodOf login.module.controller:$LostCtrl
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
     * @name login.module.controller:$LostCtrl#lost
     * @methodOf login.module.controller:$LostCtrl
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