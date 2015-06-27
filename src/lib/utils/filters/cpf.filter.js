'use strict';
//
// Usage:
// {{some_text | cpf}}
//
angular.module('app.utils').filter('cpf', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return str;
    }
});