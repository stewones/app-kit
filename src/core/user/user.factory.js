'use strict';
angular.module('core.user').factory('user', /*@ngInject*/ function() {
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