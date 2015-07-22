'use strict';
angular.module('core.home').controller('HomeCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, $page, $mdDialog,$Account, setting) {
    var vm = this;
    vm.endpointUrl = 'http://localhost:9000/api/users/avatar';
    vm.endpointSuccess = function(response) {
        
        console.log(vm.imageUrl = response.url);
    }
    vm.endpointFail = function(response) {
        $page.toast('problema ao enviar imagem '+response)
    }
    vm.account = new $Account();
    vm.confirmAccount = function() {

    	vm.account.confirm();
    }

});