'use strict';
//https://github.com/sparkalow/angular-count-to
angular.module('core.utils').directive('countTo', /*@ngInject*/ function($timeout, $filter) {
    return {
        replace: false,
        scope: true,
        link: function(scope, element, attrs) {
            var e = element[0];
            var num, refreshInterval, duration, steps, step, countTo, value, increment, currency;
            var calculate = function() {
                refreshInterval = 30;
                step = 0;
                scope.timoutId = null;
                countTo = parseInt(attrs.countTo) || 0;
                scope.value = parseInt(attrs.value, 10) || 0;
                duration = (parseFloat(attrs.duration) * 1000) || 0;
                steps = Math.ceil(duration / refreshInterval);
                increment = ((countTo - scope.value) / steps);
                num = scope.value;   
                currency = attrs.currency;         
            }
            var tick = function() {
                scope.timoutId = $timeout(function() {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(scope.timoutId);
                        num = countTo;
                        if (!currency) e.textContent = countTo;
                        else e.textContent = $filter('currency')(countTo);
                    } else {
                        e.textContent = Math.round(num);
                        tick();
                    }
                }, refreshInterval);
            }
            var start = function() {
                if (scope.timoutId) {
                    $timeout.cancel(scope.timoutId);
                }
                calculate();
                tick();
            }
            attrs.$observe('countTo', function(val) {
                if (val) {
                    start();
                }
            });
            attrs.$observe('value', function(val) {
                start();
            });
            return true;
        }
    }
});