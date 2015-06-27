 'use strict';
 //
 // Usage:
 // {{some_number | randomInteger:1:10 }}
 //
 angular.module('app.utils').filter('randomInteger', /*@ngInject*/ function() {
     return function(value, min, max) {
         return Math.floor(Math.random() * (max - min)) + min;
     }
 })