'use strict';
angular.module('core.account').controller('OptOutCtrl', /*@ngInject*/ function($scope, $location, $mdDialog) {
    $scope.callAction = function(ev) {
        var confirm = $mdDialog.confirm().parent(angular.element(document.body)).title($scope.alertTitle).content($scope.alertInfo).ariaLabel($scope.alertTitle).ok($scope.alertOk).cancel($scope.alertCancel).targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.$emit('OptOutItemUnlinked', $scope.itemId);
        }, function() {});
    }
});