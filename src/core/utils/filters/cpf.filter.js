'use strict';
/**
 * @ngdoc filter
 * @name utils.module.filter:cpf
 * @description 
 * Filtro para adicionar máscara de CPF
 * @param {string} value CPF
 * @example
 * <pre>
 * {{some_text | cpf}}
 * </pre>
 **/
angular.module('utils.module').filter('cpf', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return str;
    }
});