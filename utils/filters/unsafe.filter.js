 'use strict';
 //
 // Usage:
 // {{some_str | unsafe }}
 //
 angular.module('app.utils').filter('unsafe', /*@ngInject*/ function($sce) {
     return function(value) {
         return $sce.trustAsHtml(value);
     };
 })