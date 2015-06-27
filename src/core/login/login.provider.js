'use strict';
angular.module('login.module').provider('CoreLogin', /*@ngInject*/ function() {
    this.config = {};
    this.$get = this.get = function() {
        return {
            config: this.config
        }
    }
    this.set = function(key, val) {
        this.config[key] = val;
    }
});