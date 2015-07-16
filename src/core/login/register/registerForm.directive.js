'use strict';
/**
 * @ngdoc directive
 * @name core.login.directive:registerForm
 * @restrict E
 * @description 
 * Componente para o formulário de cadastro
 * @element div
 * @param {object} config objeto de configurações do módulo login
 * @param {string} template-url caminho para o template do formulário
 **/
angular.module('core.login').directive('registerForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '=',
            templateUrl: '='
        },
        templateUrl: function(elem, attr){
            return attr.templateUrl ? attr.templateUrl : "core/login/register/registerForm.tpl.html";
        },
        controller: 'RegisterFormCtrl',
        controlerAs: 'vm'
    }
})