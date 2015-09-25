 'use strict';
 /* global moment */
 /**
  * @ngdoc filter
  * @name core.utils.filter:age
  * @description 
  * Filtro para converter data (EN) para idade
  * @param {date} value data de nascimento
  * @example
  * <pre>
  * {{some_date | age}}
  * </pre>
  **/
 angular.module('core.utils').filter('age', /*@ngInject*/ function() {
     return function(value) {
         if (!value) return '';
         return moment(value).fromNow(true);
     };
 })