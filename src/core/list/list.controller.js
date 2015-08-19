'use strict';
angular.module('core.list').controller('ListCtrl', /*@ngInject*/ function($scope, $stateParams, $state, $location, $timeout) {
    var vm = this;

    // Props
    vm.entries = [];
    vm.total = 0;
    vm.totalDisplay = 0;
    vm.page = $stateParams.page ? Number($stateParams.page) : 1;
    vm.limit = 8;
    vm.loadMoreBtn = false;
    vm.filter = {};
    vm.disableTransition = false;

    // Extend filters with $stateParams
    angular.extend(vm.filter, $stateParams);

    // Watch for changes in the filter
    $scope.$watch('vm.filter', filterWatch, true);

    // Handle entries update
    $scope.$on('entriesUpdated', entriesUpdated);

    // Handle goToNextPage
    $scope.$on('goToNextPage', goToNextPage);

    function search() {
        // Reset main props
        resetList();

        // Update query params, silent redirect(no refresh)
        $state.go(vm.route, updateQueryParams());
    }

    function updateTotals(total) {
        vm.total = total;
        vm.totalDisplay = vm.entries.length;
    }

    function updateLoadMoreBtn() {
        var result = (vm.total > vm.totalDisplay);

        vm.loadMoreBtn = result;
        return result;
    }

    function filterWatch(nv, ov) {
        if (nv != ov) {
            filterUpdated();
        }
    }

    function filterUpdated() {
        // Reset props
        resetList();

        // Update query params
        var updatedQueryParams = updateQueryParams();

        // Silent redirect(no refresh) / required config on state: 'reloadOnSearch : false'
        if (!vm.disableTransition)
            $location.search(updatedQueryParams);

        // Timeout broadcast for next digest
        $timeout(function() {
            // Broadcast event down to responsible directive
            // to get new entries according to filters
            $scope.$broadcast('filterUpdated', vm.filter);
        });
    }

    function updateQueryParams() {
        var obj = {};

        // Add current filters
        angular.extend(obj, vm.filter);

        // Then add page entries number
        angular.extend(obj, {
            page: vm.page
        });

        return obj;
    }

    function entriesUpdated(e, data) {
        // Update totals
        updateTotals(data.total);

        // Update page
        vm.page = data.nextPage;

        // Update next button
        updateLoadMoreBtn();
    }

    // Verificar possibilidade de ter essas props aqui e manipular a lista por aqui mesmo,
    // no controller principal, teremos essas props tbm mas apenas para fins informativos(exibir para o usuário)
    function resetList() {
        // Reset props
        vm.entries = [];
        vm.total = 0;
        vm.totalDisplay = 0;
        vm.page = 1;
        vm.loadMoreBtn = false;
    }

    function goToNextPage() {
        if (!vm.disableTransition)
            $location.search(updateQueryParams());
    }
})