'use strict';
angular.module('account.module').factory('account', /*@ngInject*/ function() {
    this.instance = {};
    return {
        set: function(data) {
            this.instance = data;
            return data;
        }
    }
})