'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:cep
 * @description 
 * Filtro para adicionar máscara de CEP
 * @param {string} value código postal
 * @example
 * <pre>
 * {{some_text | cep}}
 * </pre>
 **/
angular.module('core.utils').filter('cep', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/^(\d{2})(\d{3})(\d)/, '$1.$2-$3');
        return str;
    }
})