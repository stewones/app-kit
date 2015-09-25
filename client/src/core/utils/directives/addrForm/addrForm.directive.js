'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:addrForm
 * @restrict EA
 * @description
 * Componente para formularios de endereço
 * @element 
 * div
 * @param {object} ngModel model do endereço
 * @param {object} handleForm model para reter os estados do form
 * @param {string} endpointUrl endereço do server para postagem dos dados
 * @param {object} endpointParams parametros a serem enviados ao server
 * @param {function} callbackSuccess callback de sucesso
 **/
angular.module('core.utils').directive('addrForm', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            handleForm: '=',
            endpointUrl: '@',
            endpointParams: '=',
            callbackSuccess: '='
        },
        controller: 'AddrFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/addrForm/addrForm.tpl.html',
        replace: true,
        restrict: 'EA'
    }
})