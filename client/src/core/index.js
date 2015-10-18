'use strict';
/**
 * @ngdoc overview
 * @name app.kit
 * @description
 * Kit for quick start front/back applications based in MEAN stack
 **/
angular.module('app.kit', [
	//
	// Load 3rd party
	//
    'ngMaterial',
    'ngAnimate',
    'ngTouch',
    'ngSanitize',
    'ngStorage',
    'angulartics',
    'angulartics.google.analytics',
    'pascalprecht.translate',
    'ui.router',
    //
    // Load core kit
    //
    'core.app'    
]);