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
 **/
angular.module('core.utils').directive('moipCcForm', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            handleForm: '='
        },
        controller: 'MoipCcFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/moipCcForm/moipCcForm.tpl.html',
        replace: true,
        restrict: 'EA'
    }
})