'use strict';
/**
 * @ngdoc directive
 * @name core.utils.directive:contactForm
 * @restrict EA
 * @description
 * Componente para formularios de contato
 * @element 
 * div
 * @param {object} ngModel model do contato
 * @param {object} handleForm model para reter estados do form
 * @param {string} endpointUrl endereço do servidor api
 * @param {function} callbackSuccess callback de sucesso
 **/
angular.module('core.utils').directive('contactForm', /*@ngInject*/ function() {
    return {
        scope: {
            ngModel: '=',
            handleForm: '=',
            endpointUrl: '@',
            callbackSuccess: '='
        },
        controller: 'ContactFormCtrl',
        controllerAs: 'vm',
        templateUrl: 'core/utils/directives/contactForm/contactForm.tpl.html',
        replace: true,
        restrict: 'EA'
    }
})