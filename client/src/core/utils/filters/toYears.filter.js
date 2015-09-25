'use strict';
//
// Usage:
// {{months | toYears }}
//
angular.module('core.utils').filter('toYears', /*@ngInject*/ function() {
    return function(value) {
        if (!value) return '';
        var what = value,
            stringYear = '',
            stringMonth = '';
        if (value >= 12) {
            what = value / 12;
            if (isFloat(what)) {
                var real = what, //1.25
                    years = parseInt(real), //1
                    months = Math.floor((real - years) * 10);
                if (years)
                    stringYear = years + ' ano' + ((years > 1) ? 's' : '');
                if (months)
                    stringMonth = ' e ' + months + ' mes' + ((months > 1) ? 'es' : '');
            } else {
                stringYear = what + ' ano' + ((what > 1) ? 's' : '');
            }
        } else {
            stringMonth = value + ' mes' + ((value > 1) ? 'es' : '');
        }
        return stringYear + stringMonth;
    }

    function isFloat(n) {
        return n === Number(n) && n % 1 !== 0
    }
})