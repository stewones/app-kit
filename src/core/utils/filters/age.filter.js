 'use strict';
 /* global moment */
 /**
  * @ngdoc filter
  * @name app.utils.filter:age
  * @description 
  * Filtro para converter data (EN) para idade
  * @param {date} value data de nascimento
  * @example
  * <pre>
  * {{some_date | age}}
  * </pre>
  **/
 angular.module('app.utils').filter('age', /*@ngInject*/ function() {
     return function(value) {
         if (!value) return '';
         return moment(value).fromNow(true);
     };
 })