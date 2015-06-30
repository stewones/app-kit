'use strict';
/**
 * @ngdoc directive
 * @name core.login.directive:loginForm
 * @restrict EA
 * @description 
 * Componente para o formulário de login
 * @element div
 * @param {object} config objeto de configurações do módulo login
 * @param {object} user objeto instância do usuário
 **/
angular.module('core.login').directive('loginForm', /*@ngInject*/ function() {
    return {
        scope: {
            config: '=',
            user: '='
        },
        restrict: 'EA',
        templateUrl: "core/login/form/loginForm.tpl.html",
        controller: '$LoginFormCtrl',
        controllerAs: 'vm',
        link: function() {}
    }
});