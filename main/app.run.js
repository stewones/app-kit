 'use strict';
 angular.module('app.module').run( /*@ngInject*/ function($rootScope) {
     $rootScope.$on('$locationChangeSuccess', function() {
         $rootScope.$emit('locationChanged');

     });
     $rootScope.$on('$stateChangeSuccess', function() {
         $rootScope.$emit('stateChanged');
     });
 });