'use strict';
/**
 * @ngdoc filter
 * @name utils.module.filter:cnpj
 * @description 
 * Filtro para adicionar máscara de CNPJ
 * @param {string} value CNPJ
 * @example
 * <pre>
 * {{some_text | cnpj}}
 * </pre>
 **/
angular.module('utils.module').filter('cnpj', /*@ngInject*/ function() {
    return function(input) {
        // regex créditos @ Matheus Biagini de Lima Dias
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/^(\d{2})(\d)/, '$1.$2');
        str = str.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        str = str.replace(/\.(\d{3})(\d)/, '.$1/$2');
        str = str.replace(/(\d{4})(\d)/, '$1-$2');
        return str;
    }
});