 'use strict';
 /**
  * @ngdoc filter
  * @name core.utils.filter:randomInteger
  * @description 
  * Converter para um número random
  * @param {integer} value valor corrente
  * @param {integer} min valor mínimo
  * @param {integer} max valor máximo
  * @example
  * <pre>
  * {{some_number | randomInteger:1:10}}
  * </pre>
  **/
 angular.module('core.utils').filter('randomInteger', /*@ngInject*/ function() {
     return function(value, min, max) {
         return Math.floor(Math.random() * (max - min)) + min;
     }
 })