'use strict';
angular.module('utils.module').controller('LiveChipsCtrl', /*@ngInject*/ function($scope, $rootScope) {
    var vm = this;
    vm.applyRole = applyRole;
    vm.selectedItem = '';
    vm.searchText = '';
    vm.querySearch = querySearch;
    vm.items = $scope.items.length ? $scope.items : [];
    vm.placeholder = $scope.placeholder ? $scope.placeholder : '';
    //vm.selectedItems = [];
    vm.selectedItems = $scope.model ? $scope.model : [];
    //
    // Events
    //
    $rootScope.$on('FinderFilterFormChipsClean', function() {
            vm.selectedItems = [];
        })
        //
        // Watchers
        //
    $scope.$watch('vm.selectedItems', function(nv, ov) {
        if (nv != ov) {
            $scope.model = vm.selectedItems;
        }
    }, true)
    $scope.$watch('model', function(nv, ov) {
        if (nv != ov) {
            vm.selectedItems = $scope.model;
        }
    }, true)
    $scope.$watch('items', function(nv, ov) {
            if (nv != ov) {
                vm.items = $scope.items;
            }
        }, true)
        // $scope.$watchCollection('vm.items', function(nv, ov) {
        //     if (nv != ov) {
        //         console.log(nv)
        //         $scope.$emit('FinderFilterFormChipsItemsUpdated', nv);
        //     }
        // }, true)
        //
        // Bootstrap
        //
        //
    bootstrap();

    function bootstrap() {}
    /**
     * Search for items.
     */
    function querySearch(query) {
        var results = query ? vm.items.filter(createFilterFor(query)) : [];
        return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(vegetable) {
            return vegetable.toLowerCase().indexOf(lowercaseQuery) === 0;
        };
    }

    function applyRole(item, accordion) {
        if (vm.selectedItems.indexOf(item) == -1) {
            vm.selectedItems.push(item);
        }
        accordion.toggle(0);
    }
});