 'use strict';
 /**
  * @ngdoc filter
  * @name app.utils.filter:randomInteger
  * @description 
  * Convertar para um número random
  * @param {integer} value valor corrente
  * @param {integer} min valor mínimo
  * @param {integer} max valor máximo
  * @example
  * <pre>
  * {{some_number | randomInteger:1:10}}
  * </pre>
  **/
 angular.module('app.utils').filter('randomInteger', /*@ngInject*/ function() {
     return function(value, min, max) {
         return Math.floor(Math.random() * (max - min)) + min;
     }
 })