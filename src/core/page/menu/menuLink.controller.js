'use strict';
angular.module('core.menu').controller('MenuLinkCtrl', /*@ngInject*/ function($state) {
    var vm = this;
    vm.state = $state;
})