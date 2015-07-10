'use strict';
angular.module('core.home').controller('HomeCtrl', /*@ngInject*/ function($rootScope, $scope, $state, $auth, $http, $mdToast, $q, $timeout, $page, setting) {
    var vm = this;


    vm.endpointUrl = 'http://localhost:9000/api/users/avatar';
    vm.endpointSuccess = function(response) {
        vm.imageUrl = response.url;
    }

});