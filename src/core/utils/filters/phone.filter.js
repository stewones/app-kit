'use strict';
/**
 * @ngdoc filter
 * @name app.utils.filter:phone
 * @description 
 * Adicionar máscara de telefone
 * @param {string} value telefone
 * @example
 * <pre>
 * {{some_text | phone}}
 * </pre>
 **/
angular.module('app.utils').filter('phone', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        if (str.length === 11) {
            str = str.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            str = str.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return str;
    }
});