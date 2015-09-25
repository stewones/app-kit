'use strict';
angular.module('core.utils').controller('LeadFormCtrl', /*@ngInject*/ function($scope, $http, $page, $timeout, lodash, api) {
    var vm = this,
        _ = lodash;
    $scope.lead = {};
    $scope.register = function() {
        vm.busy = true;
        var onSuccess = function() {
            vm.busy = false;
            var name = $scope.lead.name ? $scope.lead.name : '';
            $page.toast(name + ' seu contato foi enviado, agradecemos o interesse.', 10000);
            $timeout(function() {
                $scope.lead = {};
            }, 500)
        }
        var onFail = function(response) {
            vm.busy = false;
            $page.toast(response.error ? response.error : response);
        }
        $http.post(api.url + '/api/leads', $scope.lead).success(onSuccess).error(onFail);
    }

    $scope.isDisabled = function(fieldName) {
        return _.indexOf($scope.dont, fieldName) < 0 ? false : true;
    }
});