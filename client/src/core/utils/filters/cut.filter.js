'use strict';
/**
 * @ngdoc filter
 * @name core.utils.filter:cut
 * @description 
 * Filtro para cortar strings e adicionar "..."
 * @param {string} value palavra ou texto
 * @param {bool} wordwise cortar por palavras
 * @param {integer} max tamanho máximo do corte
 * @param {string} tail final da string (cauda)
 * @example
 * <pre>
 * {{some_text | cut:true:100:' ...'}}
 * </pre>
 **/
angular.module('core.utils').filter('cut', /*@ngInject*/ function() {
    return function(value, wordwise, max, tail) {
        if (!value) return '';
        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;
        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || ' …');
    };
})