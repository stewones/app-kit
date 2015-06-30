'use strict';
angular.module('core.profile').controller('ProfileFormPositionsCtrl', function() {
    var vm = this;
    vm.exists = function(item, list) {
        return list.indexOf(item) > -1;
    };
    vm.selected = [];
    vm.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };

})