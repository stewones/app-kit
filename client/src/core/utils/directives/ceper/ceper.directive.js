'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:ceper
 * @restrict EA
 * @description 
 * Input para auto busca de cep
 * @element div
 * @param {object} ngModel model qye representa o campo numerico do cep
 * @param {object} address model que representa os campos de endereço (street, district, city, state)
 * @param {string} endpointUrl endereço do server que deverá responder o json no formato esperado
 **/
angular.module('core.utils').directive('ceper', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            address: '=',
            templateUrl: '=',
            endpointUrl: '@'
        },
        replace: true,
        restrict: 'EA',
        controller: 'CeperCtrl',
        controllerAs: 'vm',
        templateUrl: function(elem, attr) {
            return attr.templateUrl ? attr.templateUrl : 'core/utils/directives/ceper/ceper.tpl.html';
        }
    }
});