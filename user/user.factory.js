'use strict';
angular.module('user.module').factory('user', /*@ngInject*/ function() {
    this.instance = {};
    return {
        set: function(data) {
            this.instance = data;
            return data;
        },
        destroy: function() {
            this.instance = {};
        }
    }
})