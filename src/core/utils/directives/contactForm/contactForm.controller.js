'use strict';
/**
 * @ngdoc object
 * @name core.utils.controller:ContactFormCtrl
 * @description 
 * @requires $scope
 * @requires $http
 * @requires $page
 * @requires api
 **/
angular.module('core.utils').controller('ContactFormCtrl', /*@ngInject*/ function($scope, $http, $page, api) {
    var vm = this;
    vm.save = save;
    vm.busy = false;
    if (!$scope.handleForm)
        $scope.handleForm = {};

    $scope.$watch('ngModel', function(nv, ov) {
        if (nv != ov) {
            $scope.handleForm.$dirty = true;
        }
    }, true)

    function save() {
        if ($scope.endpointUrl) {
            vm.busy = true;
            $http
                .put($scope.endpointUrl, $scope.ngModel)
                .success(function(response) {
                    vm.busy = false;
                    $scope.handleForm.$dirty = false;
                    $page.toast('Seu contato foi atualizado');
                    if ($scope.callbackSuccess && typeof $scope.callbackSuccess === 'function')
                        $scope.callbackSuccess(response);
                })
                .error(function() {
                    vm.busy = false;
                });
        }
    }
})