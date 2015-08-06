'use strict';
angular.module('core.home').controller('HomeCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, $page, $mdDialog, $Account, setting, api) {
    var vm = this;
    vm.endpointUrl = 'http://localhost:9000/api/users/avatar';
    vm.endpointCepUrl = api.url + '/api/cep/';
    vm.endpointSuccess = function(response) {
        console.log(vm.imageUrl = response.url);
    }
    vm.endpointFail = function(response) {
        $page.toast('problema ao enviar imagem ' + response)
    }
    vm.account = new $Account();
    vm.confirmAccount = function() {
        vm.account.confirm();
    }
    $scope.myCep = 29126145;
    $page.toast('Oieee', 10000, 'top right');
});

'use strict';
angular.module('core.home').controller('BodyCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, $page, $mdDialog, $Account, setting, api) {
    var vm = this;

});