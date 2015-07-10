'use strict';
/*global window*/
angular.module('core.home').config( /*@ngInject*/ function($stateProvider, $urlRouterProvider, $locationProvider) {
    //
    // States & Routes
    //
    $stateProvider.state('app.home', {
        url: '/',
        views: {
            'content': {
                templateUrl: 'sample/home/home.tpl.html',
                controller: 'HomeCtrl as vm'
            }
        },
        resolve: {
     
        }
    });
    //$urlRouterProvider.otherwise('/login');
    $locationProvider.html5Mode(true);
})