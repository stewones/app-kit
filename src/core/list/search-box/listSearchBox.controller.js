'use strict';
angular.module('core.list').controller('ListSearchBoxCtrl', /*@ngInject*/ function($scope, $stateParams, $state, $location) {
    var vm = this;

    vm.listRoute = vm.listRoute ? vm.listRoute : 'app.home';
    vm.listFilters = vm.listFilters ? vm.listFilters : {};
    vm.goToSearch = goToSearch;

    function goToSearch(e) {
        if (e && (e.which !== 13 || !vm.listFilters.term))
            return false;

        $state.transitionTo(vm.listRoute, vm.listFilters, {
            reload: true
        });

        $('html, body').animate({
            scrollTop: 0
        }, 'slow');
    }
});