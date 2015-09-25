'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:moipCcForm
 * @restrict EA
 * @description
 * Componente para formularios de pagamento via Moip
 * @element 
 * div
 * @param {object} ngModel model do contato
 * @param {object} handleForm model para reter estados do form
 * @param {array} parcels array com a qtd de parcelas. ex: [1,2,3]
 **/
angular.module('core.utils').directive('moipCcForm', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            handleForm: '=',
            parcels: '='
        },
        controller: 'MoipCcFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/moipCcForm/moipCcForm.tpl.html',
        replace: true,
        restrict: 'EA'
    }
})