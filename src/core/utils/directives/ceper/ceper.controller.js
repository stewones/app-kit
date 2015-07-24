'use strict';
angular.module('core.utils').controller('CeperCtrl', /*@ngInject*/ function($scope, $http, $page) {
    var vm = this;
    vm.busy = false;
    vm.get = get;

    if ($scope.address || typeof $scope.address != 'object')
        $scope.address = {};

    function get() {
        var cep = $scope.ngModel;
        if (cep && cep.toString().length === 8) {
            var url = $scope.endpointUrl
            vm.busy = true;
            var onSuccess = function(response) {
                vm.busy = false;
                var addr = response.data;
                if (addr.city || addr.state) {
                    $scope.address.street = addr.street;
                    $scope.address.district = addr.district;
                    $scope.address.city = addr.city;
                    $scope.address.state = addr.state;
                } else {
                    error();
                }
            }
            var onError = function(response) {
                vm.busy = false;
                error();
            }
            $http.get(url + cep, {}).then(onSuccess, onError);
        }

        function error() {
            return $page.toast('Não foi possível encontrar o endereço com este cep, por favor insira manualmente', 10000, 'top right');
        }
    }
});