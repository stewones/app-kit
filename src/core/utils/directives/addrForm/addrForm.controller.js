'use strict';
/**
 * @ngdoc object
 * @name core.utils.controller:AddrFormCtrl
 * @description 
 * @requires $scope
 * @requires core.utils.factory:$utils
 * @requires $http
 * @requires $page
 * @requires api
 **/
angular.module('core.utils').controller('AddrFormCtrl', /*@ngInject*/ function($scope, $utils, $http, $page, api) {
    var vm = this;
    vm.endpointCepUrl = api.url + '/api/cep/';
    vm.states = $utils.brStates();
    vm.save = save;
    vm.busy = false;
    if (!$scope.handleForm)
        $scope.handleForm = {};
    if (!$scope.endpointParams)
        $scope.endpointParams = {};
    $scope.$watch('ngModel', function(nv, ov) {
        if (nv != ov) {
            $scope.handleForm.$dirty = true;
        }
    }, true);

    function save() {
        if ($scope.endpointUrl) {
            vm.busy = true;
            $http
                .put($scope.endpointUrl, angular.extend($scope.ngModel, $scope.endpointParams))
                .success(function(response) {
                    vm.busy = false;
                    delete response.type;
                    $scope.handleForm.$dirty = false;
                    $page.toast('Seu endereço foi atualizado');
                    if ($scope.callbackSuccess && typeof $scope.callbackSuccess === 'function')
                        $scope.callbackSuccess(response);
                })
                .error(function() {
                    vm.busy = false;
                });
        }
    }
})