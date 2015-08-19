'use strict';
angular.module('core.utils').factory('HttpInterceptor', /*@ngInject*/ function($q, $rootScope) {
    return {
        // optional method
        'request': function(config) {
            // do something on success
            return config;
        },
        // optional method
        'requestError': function(rejection) {
            // do something on error
            //if (canRecover(rejection)) {
            //return responseOrNewPromise
            //}
            return $q.reject(rejection);
        },
        // optional method
        'response': function(response) {
            // do something on success
            return response;
        },
        // optional method
        'responseError': function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
                $rootScope.$emit('$Unauthorized');
            }
            // do something on error
            //if (canRecover(rejection)) {
            //return responseOrNewPromise
            //}
            return $q.reject(rejection);
        }
    }
})