'use strict';
angular.module('core.list').controller('ListLoadMoreCtrl', /*@ngInject*/ function($scope, $stateParams, $state, $location) {
    var vm = this;

    vm.goToNextPage = goToNextPage;

    // Go to next page
    function goToNextPage() {
        // Emit event up to responsible directive
        // will update entries and url with the new page
        $scope.$emit('goToNextPage');
    }
});