'use strict';
/**
 * @ngdoc object
 * @name core.utils.controller:MoipCcFormCtrl
 * @description 
 * @requires $scope
 **/
angular.module('core.utils').controller('MoipCcFormCtrl', /*@ngInject*/ function($scope) {
    var vm = this;

    //
    // Lista de instituições para cartão de crédito
    //
    vm.cc = ['AmericanExpress', 'Diners', 'Mastercard', 'Hipercard', 'Hiper', 'Elo', 'Visa'];

    //
    // Lista de parcelas
    //
    vm.parcel = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12];

    if (!$scope.handleForm)
        $scope.handleForm = {};

    $scope.$watch('ngModel', function(nv, ov) {
        if (nv != ov) {
            $scope.handleForm.$dirty = true;
        }
    }, true);
});