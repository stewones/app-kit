'use strict';
angular.module('facebook.login').directive('facebookLogin', /*@ngInject*/ function() {
    return {
        templateUrl: function(elem, attr){
        	return attr.templateUrl ? attr.templateUrl : "core/login/facebook/facebookLogin.tpl.html";
        },
        scope: {
            user: '=',
            templateUrl: '='
        },
        controller: 'FacebookLoginCtrl',
        controllerAs: 'fb'
    }
})