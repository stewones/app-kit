'use strict';
/**
 * @ngdoc service
 * @name core.user.service:$User
 **/
angular.module('core.user').service('$User', /*@ngInject*/ function($auth, lodash) {
    var _ = lodash,
        self = this;
    var $User = function(params) {
        params = params ? params : {};
        angular.extend(this, params);
    }
    $User.prototype.isAuthed = isAuthed;

    function isAuthed() {
        return $auth.isAuthenticated();
    }
    return $User;
});