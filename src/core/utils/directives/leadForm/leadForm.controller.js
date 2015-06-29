'use strict';
angular.module('utils.module').controller('LeadFormCtrl', /*@ngInject*/ function($scope, $http, api, layout) {
    var vm = this;
    $scope.register = function() {
        vm.busy = true;
        var onSuccess = function() {
            vm.busy = false;
            $page.toast($scope.lead.name + ' agradecemos o interesse, responderemos seu contato em breve.', 10000);
            $scope.lead = {};
        }
        var onFail = function(response) {
            vm.busy = false;
            $page.toast(response);
        }
        $http.post(api.url + '/api/leads', $scope.lead).success(onSuccess).error(onFail);
    }
});