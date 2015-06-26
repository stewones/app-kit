 'use strict';
 /* global moment */
 //
 // Usage:
 // {{some_date | age }}
 //
 angular.module('app.utils').filter('age', /*@ngInject*/ function() {
     return function(value) {
         if (!value) return '';
         return moment(value).fromNow(true);
     };
 })