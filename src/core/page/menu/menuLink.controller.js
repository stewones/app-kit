'use strict';
angular.module('menu.module').controller('MenuLinkCtrl', /*@ngInject*/ function($state) {
    var vm = this;
    vm.state = $state;
})