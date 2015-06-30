'use strict';
angular.module('core.account').factory('account', /*@ngInject*/ function() {
    this.instance = {};
    return {
        set: function(data) {
            this.instance = data;
            return data;
        }
    }
})