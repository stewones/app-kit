'use strict';
angular.module('user.module').provider('UserSetting', /*@ngInject*/ function() {
    this.setting = {};
    this.$get = this.get = function() {
        return this.setting;
    }
    this.set = function(key, val) {
        this.setting[key] = val;
    }
})