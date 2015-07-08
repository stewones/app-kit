'use strict';
angular.module('core.utils').controller('CompanyChooserCtrl', /*@ngInject*/ function($rootScope, $scope, $user, $auth, lodash) {
    var vm = this,
        _ = lodash;
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
    //
    // Add options for all companies
    // https://github.com/esgrupo/livejob/issues/23
    //
    if ($auth.isAuthenticated() && $scope.showAllOption && $user.instance().role.length > 1) {
        var allcompanies = [],
            already = _.findIndex($scope.companies, function(row) {
                return row.company.name === 'Todas Empresas';
            });
        if (already === -1) {
            $user.instance().current('companies').forEach(function(row) {
                allcompanies.push(row.company._id)
            })
            $scope.companies.push({
                company: {
                    name: 'Todas Empresas',
                    _id: allcompanies
                }
            });
        }
    }
});