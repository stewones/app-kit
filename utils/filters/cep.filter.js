'use strict';
//
// Usage:
// {{some_text | cep}}
//
angular.module('app.utils').filter('cep', /*@ngInject*/ function() {
    return function(input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/^(\d{2})(\d{3})(\d)/, '$1.$2-$3');
        return str;
    }
})