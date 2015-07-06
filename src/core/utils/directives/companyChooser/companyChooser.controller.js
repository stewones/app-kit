'use strict';
angular.module('core.utils').controller('CompanyChooserCtrl', /*@ngInject*/ function($rootScope, $scope) {
    var vm = this;
    vm.companyid = $scope.companyid;
    //external scope databind
    $scope.$watch('companyid', function(nv, ov) {
        if (nv != ov) {
            vm.companyid = nv;
        }
    });
    //internal scope databind
    $scope.$watch('vm.companyid', function(nv, ov) {
        if (nv != ov) {
            $scope.companyid = nv;
            $rootScope.$emit('$CompanyIdUpdated', nv, ov);
        }
    });
});