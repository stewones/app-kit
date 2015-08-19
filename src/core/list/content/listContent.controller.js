'use strict';
angular.module('core.list').controller('ListContentCtrl', /*@ngInject*/ function($scope, $stateParams, $state, $location, $timeout) {
    var vm = this;

    vm.get = get;
    vm.firstQuery = true;
    vm.listFilters = vm.listFilters ? vm.listFilters : {};
    vm.listPage = vm.listPage ? vm.listPage : 1;
    vm.listLimit = vm.listLimit ? vm.listLimit : 10;
    vm.listEntries = vm.listEntries ? vm.listEntries : [];

    // Handle filter update
    $scope.$on('filterUpdated', get);

    // Handle goToNextPage
    $scope.$on('goToNextPage', get);

    get();

    function get() {
        var filters = {
            firstQuery: vm.firstQuery ? true : false
        };

        angular.extend(filters, vm.listFilters);

        // Set to false after first time
        if (vm.firstQuery) vm.firstQuery = false;

        // Get from the source(http) and return promise
        return vm.listSource(vm.listPage, vm.listLimit, filters).then(getSuccess);
    }

    function getConfig(page, limit) {
        return {
            page: page,
            limit: limit
        };
    }

    function getSuccess(data) {
        // Push new result
        vm.listEntries = vm.listEntries.concat(data.entries);

        // Timeout emit for next digest(this/listEntries x listCtrl/entries)
        $timeout(function() {
            // Emmit changes to main list controller
            // Update totals and next button
            $scope.$emit('entriesUpdated', data);
        });

        // Return event
        return data;
    }
})