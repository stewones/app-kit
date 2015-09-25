'use strict';
/**
 * @ngdoc service
 * @name core.user.service:$User
 **/
angular.module('core.user').service('$User', /*@ngInject*/ function() {
    var _ = lodash,
        self = this;
    var $User = function(params) {
        params = params ? params : {};
        angular.extend(this, params);
    }
    $User.prototype.method = function() {};
  
    /**
     * @ngdoc method
     * @name core.user.service:$User#save
     * @methodOf core.user.service:$User
     * @description
     * - Persists data of user in sessionStorage
     * @param {object} data Save custom data
     **/
    function save(data) {
 
    }
  
    return $User;
});